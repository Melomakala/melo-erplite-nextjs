import { prisma } from "@/lib/prisma";
import { type CustomerFormValues, type ParamGetCustomerValues } from "../validations/customer.validation";

export const customerRepository = {
    async createCustomer(customer: CustomerFormValues, user_id: string) {
        return await prisma.customer.create({
            data: {
                name: customer.name,
                phone: customer.phone,
                email: customer.email,
                address: customer.address,
                status: customer.status,
                create_by: user_id,
            },
        });
    }
}