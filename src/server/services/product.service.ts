import { productRepository } from "../repositories/product.repository";
import { getValidSession } from "@/server/helpers/session.helper";
import { type ProductFormValues } from "@/server/validations/product.validation";
import { logger } from "../helpers/logger";
import { fromCents } from "@/lib/currency";

export const productService = {
    async getCategory(session_token: string) {
        await getValidSession(session_token);
        return await productRepository.getCategories();
    },
    async getProducts(session_token: string) {
        await getValidSession(session_token);
        const products = await productRepository.getProducts();
        return products.map((product) => ({
            ...product,
            price: fromCents(product.price),
        }));
    },
    async createProduct(session_token: string, data: ProductFormValues) {
        const session = await getValidSession(session_token);
        await productRepository.createProduct(data, session.user_id);
        logger.info("createProduct", "Product created successfully", {
            user_id: session.user_id,
            data: {
                ...data,

            }
        });
    },
}