import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type CustomerFormValues, type ParamGetCustomerValues } from "@/server/validations/customer.validation"

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

async function getCustomer(params: ParamGetCustomerValues) {
    const searchParams = new URLSearchParams({
        page: params.page.toString(),
        limit: params.limit.toString(),
    });

    if (params.query) {
        searchParams.set("query", params.query);
    }
    if (params.status) {
        searchParams.set("status", params.status);
    }


    const response = await fetch(`/api/customer/getCustomer?${searchParams}`);
    if (!response.ok) {
        throw new Error("Failed to fecth customer");
    }
    const result = await response.json();
    return result.data;
}

export function useGetCustomer(params: ParamGetCustomerValues) {
    return useQuery({
        queryKey: ["customers", params],
        queryFn: () => getCustomer(params),
        staleTime: 30 * 1000, // 30 วิ ว่ะ
        gcTime: 5 * 60 * 1000, // ลบหลังซะ หลังจากไม่มีคนไช้ 5 นาที
    });
}

async function deleteCustomer(customer_id: string) {
    const response = await fetch("/api/customer/deleteCustomer", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ customer_id }),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete customer");
    }
    return response.json();
}

export function useDeleteCustomer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteCustomer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers"] });
        },
    });
}

async function updateCustomer(data: { customer_id: string, body: CustomerFormValues }) {
    const response = await fetch("/api/customer/updateCustomer", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error("Failed to update customer");
    }
    return response.json();
}

export function useUpdateCustomer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateCustomer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers"] });
        },
    });
}