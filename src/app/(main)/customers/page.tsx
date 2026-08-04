"use client";

import { useState, useCallback } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import CustomerToolbar from "./_components/customer-toolbar";
import { type CustomerFiltersState } from "./_components/customer-filters";
import CustomerTable, { type Customer } from "./_components/customer-table";
import CustomerFormDialog from "./_components/customer-form-dialog";
import CustomerDeleteDialog from "./_components/customer-delete-dialog";
import { type CustomerFormValues } from "@/server/validations/customer.validation";
import { useCreateCustomer } from "@/hooks/use-customer"

const DEFAULT_FILTERS: CustomerFiltersState = {
  status: "all",
};

interface CustomerApiResponse {
  data: Customer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<CustomerFiltersState>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search 300ms — พร้อมสำหรับยิง API เมื่อเชื่อมต่อหลังบ้าน
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Placeholder state/data สำหรับรอรับ API hook (เช่น useGetCustomers)
  const data: CustomerApiResponse | undefined = undefined;
  const isLoading = false;

  // Create/Edit Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<
    (CustomerFormValues & { id?: string }) | undefined
  >(undefined);

  // Delete Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);

  const createCustomer = useCreateCustomer();

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
    // TODO: เชื่อมต่อ API deleteCustomer เมื่อพร้อม
    console.log("Delete customer:", deletingCustomer.customer_id);
    setDeleteDialogOpen(false);
    setDeletingCustomer(null);
  }

  async function handleFormSubmit(formData: CustomerFormValues) {
    if (editingCustomer?.id) {
      // TODO: เชื่อมต่อ API updateCustomer เมื่อพร้อม
      console.log("Update customer:", editingCustomer.id, formData);
    } else {
      try {
        await createCustomer.mutateAsync(formData);
      } catch (error) {
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
        customers={(data as CustomerApiResponse | undefined)?.data}
        pagination={(data as CustomerApiResponse | undefined)?.pagination}
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
