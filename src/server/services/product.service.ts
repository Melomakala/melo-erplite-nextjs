import { productRepository } from "../repositories/product.repository";
import { getValidSession } from "@/server/helpers/session.helper";
import { type ProductFormValues } from "@/server/validations/product.validation";
import { logger } from "../helpers/logger";
import { type ParamGetProductValues } from "@/server/validations/product.validation";

export const productService = {
    async getCategory(session_token: string) {
        await getValidSession(session_token);
        return await productRepository.getCategories();
    },
    async getProducts(session_token: string, params: ParamGetProductValues) {
        const session = await getValidSession(session_token);
        const result = await productRepository.getProducts(params);
        logger.info("getProducts", "Products fetched successfully", {
            user_id: session.user_id,
        });
        return result;
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
    async deleteProduct(session_token: string, product_id: string) {
        const session = await getValidSession(session_token);
        await productRepository.deleteProduct(product_id);
        logger.info("deleteProduct", "Product deleted successfully", {
            user_id: session.user_id,
            product_id,
        });
    },

    async updateProduct(session_token: string, data: { product_id: string, body: ProductFormValues }) {
        const session = await getValidSession(session_token);
        await productRepository.updateProduct(data.product_id, data.body, session.user_id);
        logger.info("updateProduct", "Product updated successfully", {
            user_id: session.user_id,
            product_id: data.product_id,
        });
    }
}