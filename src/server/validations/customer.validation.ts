import { z } from "zod";

export const customerFormSchema = z.object({
  name: z.string().min(1, "Customer name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address").or(z.literal("")).optional(),
  address: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;

export const paramGetCustomerSchema = z.object({
  page: z.number().min(1, "Page must be 1 or more"),
  limit: z.number().min(1, "Limit must be 1 or more"),
  query: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export type ParamGetCustomerValues = z.infer<typeof paramGetCustomerSchema>;
