import { z } from "zod";

export const orderSchema = z.object({
    order_id: z.string().optional(),
    customer_id: z.string().min(1, "Customer is required"),
    customer: z.object({
        name: z.string().optional(),
    }).optional(),
    order_details: z.array(
        z.object({
            order_detail_id: z.string().optional(),
            product_id: z.string().min(1, "Product is required"),
            product_name: z.string().optional(),
            quantity: z.number().min(1, "Quantity is required"),
            price: z.number().min(1, "Price is required"),
            total: z.number().min(1, "Total is required"),
        })
    ).min(1, "Items are required"),
    status: z.enum(["PENDING", "PAID", "SHIPPED", "COMPLETED", "CANCELLED"]),
    grand_total: z.number().optional(),
    created_at: z.union([z.string(), z.date()]).optional(),
})

export const paramOrderSchema = z.object({
    page: z.number().min(1, "Page must be 1 or more"),
    limit: z.number().min(1, "Limit must be 1 or more"),
    query: z.string().optional(),
    status: z.enum(["PENDING", "PAID", "SHIPPED", "COMPLETED", "CANCELLED"]).optional(),
})

export type ParamOrderValues = z.infer<typeof paramOrderSchema>

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
