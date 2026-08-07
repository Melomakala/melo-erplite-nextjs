import { prisma } from "@/lib/prisma";
import { toCents, fromCents } from "@/lib/currency";
import { type OrderFormValues } from "../validations/order.validation";

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
}