"use client";

import { useState, useMemo } from "react";
import OrderToolbar from "./_components/order-toolbar";
import OrderTable from "./_components/order-table";
import OrderFormDialog, { DraftOrderItem } from "./_components/order-form-dialog";
import OrderDeleteDialog from "./_components/order-delete-dialog";
import OrderDetailSheet from "./_components/order-detail-sheet";
import {
  Order,
  OrderStatus,
} from "./_components/order-types";
import { type OrderFormValues } from "@/server/validations/order.validation";
import { useCreateOrder, useGetOrder, useDeleteOrder, useUpdateOrder } from "@/hooks/use-order";
import { useDebounce } from "@/hooks/use-debounce";

// ─── Main Orders Page Component ───────────────────────────────────────────────

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");

  const debouncedSearch = useDebounce(searchQuery, 300);

  //hoookkkkkkkk
  const createOrder = useCreateOrder();
  const updateOrder = useUpdateOrder();
  const deleteOrder = useDeleteOrder();
  const { data, isLoading } = useGetOrder({
    page: 1,
    limit: 10,
    query: debouncedSearch || undefined,
    status: statusFilter !== "ALL" ? statusFilter : undefined,
  });

  // Dialog State: Create / Edit Order
  const [orderFormOpen, setOrderFormOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);

  // Dialog State: Delete Order
  const [orderDeleteOpen, setOrderDeleteOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  // Sheet State: Order Details View
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // ─── Filtered Orders ────────────────────────────────────────────────────────

  const orderList: Order[] = data?.data ?? [];

  // Keep selected order for details synced with orders state from TanStack Query
  const currentDetailOrder = selectedOrderId ?
    orderList.find((o) => o.order_id === selectedOrderId) ?? null
    : null;

  // ─── Order Handlers (Create, Update, Delete) ───────────────────────────────

  function handleClickCreate() {
    setOrderToEdit(null);
    setOrderFormOpen(true);
  }

  function handleClickEdit(order: Order) {
    setOrderToEdit(order);
    setOrderFormOpen(true);
  }

  function handleClickDelete(order: Order) {
    setOrderToDelete(order);
    setOrderDeleteOpen(true);
  }

  async function handleOrderFormSubmit(data: OrderFormValues) {
    if (orderToEdit) {
      try {
        await updateOrder.mutateAsync({
          order_id: orderToEdit.order_id,
          body: data
        });
      } catch (error) {
        // TODO some day I will show error message
        console.error(error);
      }
    } else {
      try {
        await createOrder.mutateAsync(data);
      } catch (error) {
        // TODO some day I will show error message
        console.error(error);
      }
    }
    setOrderFormOpen(false);
  }

  async function handleConfirmDeleteOrder(order_id: string) {
    try {
      await deleteOrder.mutateAsync(order_id);
      if (selectedOrderId === order_id) {
        setSelectedOrderId(null);
      }
    } catch (error) {
      // TODO some day I will show error message
      console.error(error);
    }
    setOrderDeleteOpen(false);
  }

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Orders</h1>
        </div>
      </div>

      {/* Toolbar */}
      <OrderToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onCreateClick={handleClickCreate}
      />

      {/* Main Order Table */}
      <OrderTable
        orders={orderList}
        onViewDetails={(order) => setSelectedOrderId(order.order_id)}
        onEditOrder={handleClickEdit}
        onDeleteOrder={handleClickDelete}
      />

      {/* Create / Edit Order Dialog */}
      <OrderFormDialog
        open={orderFormOpen}
        onOpenChange={setOrderFormOpen}
        orderToEdit={orderToEdit}
        onSubmit={handleOrderFormSubmit}
      />

      {/* Delete Order Dialog */}
      <OrderDeleteDialog
        open={orderDeleteOpen}
        onOpenChange={setOrderDeleteOpen}
        order={orderToDelete}
        onConfirmDelete={handleConfirmDeleteOrder}
      />

      {/* Order Details Sub-view Sheet */}
      <OrderDetailSheet
        open={!!currentDetailOrder}
        onOpenChange={(open) => {
          if (!open) setSelectedOrderId(null);
        }}
        order={currentDetailOrder}
      />
    </div>
  );
}
