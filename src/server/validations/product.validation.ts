import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  category_id: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0, "Price must be 0 or more"),
  stock: z.coerce.number().int().min(0, "Stock must be 0 or more"),
  status: z.enum(["active", "inactive"]),
});


export const paramGetProductSchema = z.object({
  page: z.number().min(1, "Page must be 1 or more"),
  limit: z.number().min(1, "Limit must be 1 or more"),
  query: z.string().optional(),
  category_id: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
export type ParamGetProductValues = z.infer<typeof paramGetProductSchema>;
