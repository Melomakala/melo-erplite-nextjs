import { prisma } from "@/lib/prisma";
import { toCents, fromCents } from "@/lib/currency";
import { type OrderFormValues, type ParamOrderValues } from "../validations/order.validation";
import { Prisma } from "@/generated/prisma";

export const orderRepository = {
    async createOrder(data: OrderFormValues, grand_total: number, user_id: string,) {
        return prisma.order.create({
            data: {
                customer: {
                    connect: {
                        customer_id: data.customer_id,
                    }
                },
                order_details: {
                    create: data.order_details.map((item) => ({
                        product: {
                            connect: {
                                product_id: item.product_id,
                            },
                        },
                        quantity: item.quantity,
                        price: toCents(item.price),
                        total: toCents(item.total),
                        create_by: user_id
                    })),
                },
                status: data.status,
                grand_total: toCents(grand_total),
                create_by: user_id
            },
        },
        )
    },
    async getOrder(data: ParamOrderValues) {
        const { page, limit, status, query } = data;
        const where: Prisma.OrderWhereInput = {
            ...(query && {
                OR: [
                    {
                        order_id: {
                            contains: query
                        }
                    },
                    {
                        customer: {
                            name: {
                                contains: query
                            }
                        }
                    }
                ]
            }),
            ...(status && {
                status: status
            }),
        }
        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    customer: {
                        select: {
                            customer_id: true,
                            name: true,
                        }
                    },
                    order_details: {
                        include: {
                            product: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    created_at: "desc"
                }
            }),
            prisma.order.count({ where })
        ]);
        return {
            data: orders.map((order) => ({
                ...order,
                grand_total: fromCents(order.grand_total),
                order_details: order.order_details.map((detail) => ({
                    ...detail,
                    price: fromCents(detail.price),
                    total: fromCents(detail.total),
                })),
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            }
        }
    },
    async deleteOrder(order_id: string) {
        return await prisma.order.delete({
            where: {
                order_id: order_id
            }
        })
    },
    async updateOrder(order_id: string, grand_total: number, data: OrderFormValues, user_id: string) {
        return await prisma.$transaction(async (tx) => {
            // update main order
            const order = await tx.order.update({
                where: {
                    order_id: order_id
                },
                data: {
                    customer: {
                        connect: {
                            customer_id: data.customer_id,
                        },
                    },
                    status: data.status,
                    grand_total: toCents(grand_total),
                    update_by: user_id
                },
            });
            // delete
            const in_OrderDetail_Id: string[] = data.order_details
                .map((item) => item.order_detail_id)
                .filter((id): id is string => Boolean(id));
            await tx.orderDetail.deleteMany({
                where: {
                    order_id: order_id,
                    order_detail_id: { notIn: in_OrderDetail_Id },
                }
            });
            // updateOrCreate
            for (const item of data.order_details) {
                if (item.order_detail_id) {
                    await tx.orderDetail.update({
                        where: {
                            order_detail_id: item.order_detail_id,
                        },
                        data: {
                            product: {
                                connect: {
                                    product_id: item.product_id,
                                }
                            },
                            quantity: item.quantity,
                            price: toCents(item.price),
                            total: toCents(item.total),
                            update_by: user_id,
                            updated_at: new Date(),
                        },
                    });
                } else {
                    await tx.orderDetail.create({
                        data: {
                            product: {
                                connect: {
                                    product_id: item.product_id,
                                }
                            },
                            order: {
                                connect: {
                                    order_id: order_id,
                                }
                            },
                            quantity: item.quantity,
                            price: toCents(item.price),
                            total: toCents(item.total),
                            create_by: user_id
                        },
                    });
                }
            }
        })
    }
}