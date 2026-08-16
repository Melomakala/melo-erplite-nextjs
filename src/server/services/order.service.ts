import { orderRepository } from "../repositories/order.repository";
import { getValidSession } from "../helpers/session.helper";
import { type OrderFormValues, type ParamOrderValues } from "../validations/order.validation";
import { logger } from "../helpers/logger";

export const orderService = {
    async createOrder(session_token: string, data: OrderFormValues) {
        const session = await getValidSession(session_token);
        const grand_total = data.order_details.reduce((sum, item) => sum + item.total, 0)
        await orderRepository.createOrder(data, grand_total, session.user_id);
        logger.info("createOrder", "Order created successfully", {
            user_id: session.user_id,
            data: {
                ...data,
            }
        })
    },

    async getOrder(session_token: string, params: ParamOrderValues) {
        const session = await getValidSession(session_token);
        const result = await orderRepository.getOrder(params);
        logger.info("getOrder", "Order fetched successfully", {
            user_id: session.user_id,
            params: {
                ...params,
            }
        })
        return result;
    }
}