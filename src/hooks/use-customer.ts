import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type CustomerFormValues } from "@/server/validations/customer.validation"

async function createCustomer(customer: CustomerFormValues) {
    const response = await fetch("/api/customer/createCustomer", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(customer),
    });
    const result = await response.json();
    if (!result.success) {
        throw new Error(result.message);
    }
    return result.data;
}

export function useCreateCustomer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createCustomer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers"] });
        },
    });
}