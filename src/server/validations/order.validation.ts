import { z } from "zod";

export const orderSchema = z.object({
    customer_id: z.string().min(1, "Customer is required"),
    order_details: z.array(
        z.object({
            product_id: z.string().min(1, "Product is required"),
            product_name: z.string().optional(),
            quantity: z.number().min(1, "Quantity is required"),
            price: z.number().min(1, "Price is required"),
            total: z.number().min(1, "Total is required"),
        })
    ).min(1, "Items are required"),
    status: z.enum(["PENDING", "PAID", "SHIPPED", "COMPLETED", "CANCELLED"]),
})

export const customerResponseSchema = z.object({
    customer_id: z.string(),
    name: z.string(),
    phone: z.string(),
    email: z.string().email("Invalid email address").or(z.literal("")).optional(),
    address: z.string().optional(),
    status: z.enum(["active", "inactive"]),
})

export type OrderFormValues = z.infer<typeof orderSchema>
export type CustomerResponseValues = z.infer<typeof customerResponseSchema>
