"use client";

import { useState, useCallback } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import ProductToolbar from "./_components/product-toolbar";
import { type ProductFiltersState } from "./_components/product-filters";
import ProductTable, { type Product } from "./_components/product-table";
import ProductFormDialog from "./_components/product-form-dialog";
import ProductDeleteDialog from "./_components/product-delete-dialog";
import { type ProductFormValues } from "@/server/validations/product.validation";
import { useCreateProduct, useGetProducts, useDeleteProduct, useUpdateProduct } from "@/hooks/use-product";

const DEFAULT_FILTERS: ProductFiltersState = {
  category: "all",
  status: "all",
};

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<ProductFiltersState>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search 300ms — API จะยิงเฉพาะตอนที่ user หยุดพิมพ์
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data, isLoading } = useGetProducts({
    page: currentPage,
    limit: 10,
    query: debouncedSearch || undefined,
    category_id: filters.category !== "all" ? filters.category : undefined,
    status: filters.status !== "all" ? (filters.status as "active" | "inactive") : undefined,
  });

  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();
  const updateProduct = useUpdateProduct();

  // Create/Edit Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<
    (ProductFormValues & { id?: string | number }) | undefined
  >(undefined);

  // Delete Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // reset to page 1 on new search
  }, []);

  function handleFiltersChange(newFilters: ProductFiltersState) {
    setFilters(newFilters);
    setCurrentPage(1); // reset to page 1 on filter change
  }

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

  function handleClickDelete(product: Product) {
    setDeletingProduct(product);
    setDeleteDialogOpen(true);
  }

  async function handleConfirmDelete() {
    if (!deletingProduct) return;
    try {
      await deleteProduct.mutateAsync(deletingProduct.product_id);
      setDeleteDialogOpen(false);
      setDeletingProduct(null);
    } catch (error) {
      console.error("Delete product error:", error);
      // Close modal on error or leave open for user feedback
      setDeleteDialogOpen(false);
      setDeletingProduct(null);
    }
  }

  async function handleFormSubmit(formData: ProductFormValues) {
    if (editingProduct?.id) {
      try {
        await updateProduct.mutateAsync({ product_id: editingProduct?.id.toString(), body: formData });
      } catch (error) {
        console.error("Update product error:", error);
      }
    } else {
      try {
        await createProduct.mutateAsync(formData);
      } catch (error) {
        console.error("Create product error");
      }
    }
    setDialogOpen(false);
    setEditingProduct(undefined);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Products</h1>

      <ProductToolbar
        onSearch={handleSearch}
        onClickCreate={handleClickCreate}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      <ProductTable
        products={data?.data}
        pagination={data?.pagination}
        isLoading={isLoading}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onEdit={handleClickEdit}
        onDelete={handleClickDelete}
      />

      <ProductFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialValues={editingProduct}
        onSubmit={handleFormSubmit}
      />

      <ProductDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        product={deletingProduct}
        onConfirm={handleConfirmDelete}
        isLoading={deleteProduct.isPending}
      />
    </div>
  );
}
