import { prisma } from "@/lib/prisma";
import { type CustomerFormValues, type ParamGetCustomerValues } from "../validations/customer.validation";
import { Prisma } from "@/generated/prisma";
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
    },
    async getCustomer(params: ParamGetCustomerValues) {
        const { page, limit, query, status } = params;
        const where: Prisma.CustomerWhereInput = {
            ...(query && {
                OR: [
                    { name: { contains: query } },
                    { phone: { contains: query } },
                    { email: { contains: query } },
                    { address: { contains: query } },
                ],
            }),
            ...(status && { status }),
        };
        const [customer, totalPages] = await Promise.all([
            prisma.customer.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.customer.count({ where }),
        ])
        return {
            data: customer,
            pagination: {
                page,
                limit,
                total: totalPages,
                totalPages: Math.ceil(totalPages / limit),
            }
        };
    },
    async deleteCustomer(customer_id: string) {
        return await prisma.customer.delete({
            where: {
                customer_id: customer_id,
            },
        });
    },
    async updateCustomer(customer_id: string, customer: CustomerFormValues, user_id: string) {
        return await prisma.customer.update({
            where: {
                customer_id: customer_id,
            },
            data: {
                name: customer.name,
                phone: customer.phone,
                email: customer.email,
                address: customer.address,
                status: customer.status,
                update_by: user_id,
                updated_at: new Date(),
            },
        })
    }
}