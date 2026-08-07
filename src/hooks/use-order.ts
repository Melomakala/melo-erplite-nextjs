import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OrderFormValues } from "@/server/validations/order.validation";

async function createOrder(data: OrderFormValues) {
    const response = await fetch("/api/order/createOrder", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message);
    }
    return result.data;
}

export function useCreateOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });
}