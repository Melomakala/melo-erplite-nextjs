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
    }
}