import { getValidSession } from "../helpers/session.helper";
import { logger } from "../helpers/logger";
import { customerRepository } from "../repositories/customer.repository";
import { type CustomerFormValues } from "../validations/customer.validation";

export const customerService = {
    async createCustomer(session_token: string, data: CustomerFormValues) {
        const session = await getValidSession(session_token);
        await customerRepository.createCustomer(data, session.user_id);
        logger.info("createCustomer", "Customer created successfully", {
            user_id: session.user_id,
            data: {
                ...data,
            }
        });
    }
}