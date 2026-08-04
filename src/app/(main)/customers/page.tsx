"use client";

import { useState, useCallback } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import CustomerToolbar from "./_components/customer-toolbar";
import { type CustomerFiltersState } from "./_components/customer-filters";
import CustomerTable, { type Customer } from "./_components/customer-table";
import CustomerFormDialog from "./_components/customer-form-dialog";
import CustomerDeleteDialog from "./_components/customer-delete-dialog";
import { type CustomerFormValues } from "@/server/validations/customer.validation";
import { useCreateCustomer, useGetCustomer, useDeleteCustomer, useUpdateCustomer } from "@/hooks/use-customer"

const DEFAULT_FILTERS: CustomerFiltersState = {
  status: "all",
};


export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<CustomerFiltersState>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data, isLoading } = useGetCustomer({
    page: currentPage,
    limit: 10,
    query: debouncedSearch || undefined,
    status: filters.status !== "all" ? (filters.status as "active" | "inactive") : undefined,
  });

  // Create/Edit Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<
    (CustomerFormValues & { id?: string }) | undefined
  >(undefined);

  // Delete Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);

  // hook
  const createCustomer = useCreateCustomer();
  const deleteCustomer = useDeleteCustomer();
  const updateCustomer = useUpdateCustomer();

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // reset to page 1 on new search
  }, []);

  function handleFiltersChange(newFilters: CustomerFiltersState) {
    setFilters(newFilters);
    setCurrentPage(1); // reset to page 1 on filter change
  }

  function handleClickCreate() {
    setEditingCustomer(undefined);
    setDialogOpen(true);
  }

  function handleClickEdit(customer: Customer) {
    setEditingCustomer({
      id: customer.customer_id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email ?? "",
      address: customer.address ?? "",
      status: (customer.status.toLowerCase() === "active" ? "active" : "inactive") as "active" | "inactive",
    });
    setDialogOpen(true);
  }

  function handleClickDelete(customer: Customer) {
    setDeletingCustomer(customer);
    setDeleteDialogOpen(true);
  }

  async function handleConfirmDelete() {
    if (!deletingCustomer) return;
    try {
      await deleteCustomer.mutateAsync(deletingCustomer.customer_id);
    } catch (error) {
      console.error("Delete customer error:", error);
    }
    setDeleteDialogOpen(false);
    setDeletingCustomer(null);
  }

  async function handleFormSubmit(formData: CustomerFormValues) {
    if (editingCustomer?.id) {
      try {
        await updateCustomer.mutateAsync({ customer_id: editingCustomer.id, body: formData });
      } catch (error) {
        // TODO
        console.error("Update customer error:", error);
      }
    } else {
      try {
        await createCustomer.mutateAsync(formData);
      } catch (error) {
        // TODO
        console.error("Create customer error:", error);
      }
    }
    setDialogOpen(false);
    setEditingCustomer(undefined);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Customers</h1>

      <CustomerToolbar
        onSearch={handleSearch}
        onClickCreate={handleClickCreate}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      <CustomerTable
        customers={data?.data}
        pagination={data?.pagination}
        isLoading={isLoading}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onEdit={handleClickEdit}
        onDelete={handleClickDelete}
      />

      <CustomerFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialValues={editingCustomer}
        onSubmit={handleFormSubmit}
      />

      <CustomerDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        customer={deletingCustomer}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
