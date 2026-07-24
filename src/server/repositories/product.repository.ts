import { prisma } from "@/lib/prisma";
import { type ProductFormValues } from "@/server/validations/product.validation";
import { toCents, fromCents } from "@/lib/currency";
import { type ParamGetProductValues } from "@/server/validations/product.validation"
import { Prisma } from "@/generated/prisma";

export const productRepository = {
    async getCategories() {
        return await prisma.category.findMany();
    },

    async getProducts(params: ParamGetProductValues) {
        const { page, limit, query, category_id, status } = params;
        const where: Prisma.ProductWhereInput = {
            ...(query && {
                OR: [
                    {
                        name:
                            { contains: query }
                    },
                    {
                        product_id:
                            { contains: query }
                    }
                ]
            }),
            ...(category_id && {
                category_id: category_id
            }),
            ...(status && {
                status: status
            }),
        }
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    category: true,
                },
                orderBy: {
                    created_at: "desc",
                },
            }),
            prisma.product.count({ where })
        ]);
        return {
            data: products.map((product) => ({
                ...product,
                price: fromCents(product.price),
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            }
        };
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