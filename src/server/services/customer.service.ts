import { getValidSession } from "../helpers/session.helper";
import { logger } from "../helpers/logger";
import { customerRepository } from "../repositories/customer.repository";
import { type CustomerFormValues, type ParamGetCustomerValues } from "../validations/customer.validation";

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
    },

    async getCustomer(session_token: string, params: ParamGetCustomerValues) {
        const session = await getValidSession(session_token);
        const result = await customerRepository.getCustomer(params);
        logger.info("getCustomer", "Customer fetched successfully", {
            user_id: session.user_id,
            data: {
                ...params,
            }
        });
        return result;
    },
    async deleteCustomer(session_token: string, customer_id: string) {
        const session = await getValidSession(session_token);
        await customerRepository.deleteCustomer(customer_id);
        logger.info("deleteCustomer", "Customer deleted successfully", {
            user_id: session.user_id,
            customer_id,
        });
    },
    async updateCustomer(session_token: string, data: { customer_id: string, body: CustomerFormValues }) {
        const session = await getValidSession(session_token);
        await customerRepository.updateCustomer(data.customer_id, data.body, session.user_id);
        logger.info("updateCustomer", "Customer updated successfully", {
            user_id: session.user_id,
            customer_id: data.customer_id,
        });
    }
}