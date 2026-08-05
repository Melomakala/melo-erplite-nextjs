import { z } from "zod";

export const orderSchema = z.object({
    customer_id: z.string().min(1, "Customer is required"),
    items: z.array(
        z.object({
            product_id: z.string().min(1, "Product is required"),
            quantity: z.number().min(1, "Quantity is required"),
        })
    ).min(1, "Items are required"),
})
// 
// export const paramGetOrderSchema = z.object({
//     page: z.coerce.number().optional(),
//     limit: z.coerce.number().optional(),
//     query: z.string().optional(),
//     status: z.string().optional(),
// })

export type OrderFormValues = z.infer<typeof orderSchema>
// export type ParamGetOrderValues = z.infer<typeof paramGetOrderSchema>