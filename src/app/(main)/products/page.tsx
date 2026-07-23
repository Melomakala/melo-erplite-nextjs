"use client";

import { useState, useCallback } from "react";
import ProductToolbar from "./_components/product-toolbar";
import { type ProductFiltersState } from "./_components/product-filters";
import ProductTable, { type Product } from "./_components/product-table";
import ProductFormDialog from "./_components/product-form-dialog";
import { type ProductFormValues } from "@/server/validations/product.validation";
import { useCreateProduct, useGetProducts } from "@/hooks/use-product";

const DEFAULT_FILTERS: ProductFiltersState = {
  category: "all",
  status: "all",
};

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<ProductFiltersState>(DEFAULT_FILTERS);

  const { data: products = [], isLoading } = useGetProducts();
  const createProduct = useCreateProduct();

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<
    (ProductFormValues & { id?: string | number }) | undefined
  >(undefined);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  function handleClickCreate() {
    setEditingProduct(undefined);
    setDialogOpen(true);
  }

  function handleClickEdit(product: Product) {
    setEditingProduct({
      id: product.product_id,
      name: product.name,
      category_id: product.category_id,
      price: product.price,
      stock: product.stock,
      status: product.status,
    });
    setDialogOpen(true);
  }

  function handleFormSubmit(data: ProductFormValues) {
    if (editingProduct?.id) {
      // TODO: call update API
      console.log("Update product", data);
    } else {
      createProduct.mutateAsync(data);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Products</h1>

      <ProductToolbar
        onSearch={handleSearch}
        onClickCreate={handleClickCreate}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <ProductTable
        products={products}
        isLoading={isLoading}
        searchQuery={searchQuery}
        categoryFilter={filters.category}
        statusFilter={filters.status}
        onEdit={handleClickEdit}
      />

      <ProductFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialValues={editingProduct}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
