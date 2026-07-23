import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type ProductFormValues } from "@/server/validations/product.validation";

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

async function fetchProducts(): Promise<Product[]> {
    const response = await fetch("/api/product/getProduct");
    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }
    const data = await response.json();
    return data.data;
}

export const useGetProducts = () => {
    return useQuery({
        queryKey: ["products"],
        queryFn: fetchProducts,
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
