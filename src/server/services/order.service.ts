import { orderRepository } from "../repositories/order.repository";
import { getValidSession } from "../helpers/session.helper";
import { type OrderFormValues } from "../validations/order.validation";
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
    }
}