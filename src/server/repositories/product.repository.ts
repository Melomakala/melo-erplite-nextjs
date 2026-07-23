import { prisma } from "@/lib/prisma";
import { type ProductFormValues } from "@/server/validations/product.validation";
import { toCents } from "@/lib/currency";


export const productRepository = {
    async getCategories() {
        return await prisma.category.findMany();
    },

    async getProducts() {
        return await prisma.product.findMany({
            include: {
                category: true,
            },
            orderBy: {
                created_at: "desc",
            },
        });
    },

    async createProduct(product: ProductFormValues, user_id: string) {
        return await prisma.product.create({
            data: {
                name: product.name,
                category_id: product.category_id,
                price: toCents(product.price),
                stock: product.stock,
                status: product.status,
                create_by: user_id,
            }
        });
    },
}