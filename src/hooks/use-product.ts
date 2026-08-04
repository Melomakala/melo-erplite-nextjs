import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type ProductFormValues, type ParamGetProductValues } from "@/server/validations/product.validation";

export interface Category {
    category_id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface Product {
    product_id: string;
    name: string;
    category_id: string;
    category: {
        category_id: string;
        name: string;
        description?: string;
    };
    price: number; // Stored in satang / cents in DB
    stock: number;
    status: "active" | "inactive";
    create_by: string;
    update_by?: string | null;
    created_at: string;
    updated_at: string;
}

export interface GetProductsResponse {
    data: Product[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    search: {
        page: number;
        limit: number;
        query?: string;
        category?: string;
        status?: string;
    }
}


async function fetchCategories(): Promise<Category[]> {
    const response = await fetch("/api/product/getCategory");
    if (!response.ok) {
        throw new Error("Failed to fetch categories");
    }
    const data = await response.json();
    return data.data;
}

export const useGetCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

async function fetchProducts(params: ParamGetProductValues): Promise<GetProductsResponse> {
    const searchParams = new URLSearchParams({
        page: params.page.toString(),
        limit: params.limit.toString(),
    });
    if (params.query) {
        searchParams.set("query", params.query);
    }
    if (params.category_id) {
        searchParams.set("category_id", params.category_id);
    }
    if (params.status) {
        searchParams.set("status", params.status);
    }

    const response = await fetch(`/api/product/getProduct?${searchParams}`);
    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }
    const result = await response.json();
    return result.data;
}

export const useGetProducts = (params: ParamGetProductValues) => {
    return useQuery({
        queryKey: ["products", params],
        queryFn: () => fetchProducts(params),
        staleTime: 30 * 1000, // 30 วิ ว่ะ
        gcTime: 5 * 60 * 1000, // ลบหลังซะ หลังจากไม่มีคนไช้ 5 นาที
    });
};

async function createProduct(data: ProductFormValues) {
    const response = await fetch("/api/product/createProduct", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error("Failed to create product");
    }
    return response.json();
}

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
};

async function deleteProduct(productId: string) {
    const response = await fetch("/api/product/deleteProduct", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_id: productId }),
    });
    if (!response.ok) {
        throw new Error("Failed to delete product");
    }
    return response.json();
}

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
};

async function updateProduct(data: { product_id: string, body: ProductFormValues }) {
    const response = await fetch("/api/product/updateProduct", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error("Failed to update product");
    }
    return response.json();
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
}


