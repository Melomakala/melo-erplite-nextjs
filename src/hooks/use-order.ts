import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type OrderFormValues, type ParamOrderValues } from "@/server/validations/order.validation";

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

async function getOrder(params: ParamOrderValues) {
    const searchParams = new URLSearchParams({
        page: params.page.toString(),
        limit: params.limit.toString(),
    })

    if (params.query) {
        searchParams.set("query", params.query);
    }
    if (params.status) {
        searchParams.set("status", params.status);
    }

    const response = await fetch(`/api/order/getOrder?${searchParams}`);
    if (!response.ok) {
        throw new Error("Failed to fetch order");
    }
    const result = await response.json();
    return result.data;
}

export function useGetOrder(params: ParamOrderValues) {
    return useQuery({
        queryKey: ["orders", params],
        queryFn: () => getOrder(params),
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
    });
}

async function deleteOrder(order_id: string) {
    const response = await fetch("/api/order/deleteOrder", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ order_id }),
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message);
    }
    return result.data;
}

export function useDeleteOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });
}

async function updateOrder(data: { order_id: string, body: OrderFormValues }) {
    const response = await fetch("/api/order/updateOrder", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message);
    }
    return result.data;
}

export function useUpdateOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });
}