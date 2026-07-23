"use client";

import { useState, useCallback } from "react";
import ProductToolbar from "./_components/product-toolbar";
import { type ProductFiltersState } from "./_components/product-filters";
import ProductTable, { type Product } from "./_components/product-table";
import ProductFormDialog, { type ProductFormValues } from "./_components/product-form-dialog";

const DEFAULT_FILTERS: ProductFiltersState = {
  category: "all",
  status: "all",
};

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<ProductFiltersState>(DEFAULT_FILTERS);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<
    (ProductFormValues & { id?: number }) | undefined
  >(undefined);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  function handleClickCreate() {
    setEditingProduct(undefined);
    setDialogOpen(true);
  }

  function handleClickEdit(product: Product) {
    setEditingProduct(product);
    setDialogOpen(true);
  }

  function handleFormSubmit(values: ProductFormValues) {
    if (editingProduct?.id) {
      // TODO: call update API
      console.log("Update product", editingProduct.id, values);
    } else {
      // TODO: call create API
      console.log("Create product", values);
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
