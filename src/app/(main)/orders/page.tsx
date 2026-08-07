"use client";

import { useState, useMemo } from "react";
import OrderToolbar from "./_components/order-toolbar";
import OrderTable from "./_components/order-table";
import OrderFormDialog, { DraftOrderItem } from "./_components/order-form-dialog";
import OrderDeleteDialog from "./_components/order-delete-dialog";
import OrderDetailSheet from "./_components/order-detail-sheet";
import {
  Order,
  OrderProduct,
  OrderStatus,
} from "./_components/order-types";
import { type OrderFormValues } from "@/server/validations/order.validation";
import { useCreateOrder } from "@/hooks/use-order";

// ─── Main Orders Page Component ───────────────────────────────────────────────

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const products: OrderProduct[] = [];

  //hoookkkkkkkk
  const createOrder = useCreateOrder();

  // Dialog State: Create / Edit Order
  const [orderFormOpen, setOrderFormOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);

  // Dialog State: Delete Order
  const [orderDeleteOpen, setOrderDeleteOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  // Sheet State: Order Details View
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<Order | null>(null);

  // ─── Filtered Orders ────────────────────────────────────────────────────────

  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const matchesSearch =
        ord.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.customer_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || ord.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // Keep selected order for details synced with orders state
  const currentDetailOrder = useMemo(() => {
    if (!selectedOrderForDetails) return null;
    return orders.find((o) => o.order_id === selectedOrderForDetails.order_id) || null;
  }, [orders, selectedOrderForDetails]);

  // ─── Order Handlers (Create, Update, Delete) ───────────────────────────────

  function handleOpenCreateOrder() {
    setOrderToEdit(null);
    setOrderFormOpen(true);
  }

  function handleOpenEditOrder(order: Order) {
    setOrderToEdit(order);
    setOrderFormOpen(true);
  }

  function handleOpenDeleteOrder(order: Order) {
    setOrderToDelete(order);
    setOrderDeleteOpen(true);
  }

  async function handleOrderFormSubmit(data: OrderFormValues) {
    // Ready for backend API call (POST/PUT)
    await createOrder.mutateAsync(data);
    console.log("Order form submitted to API:", data);
    setOrderFormOpen(false);
  }

  function handleConfirmDeleteOrder(order_id: string) {
    // Ready for backend API call (DELETE)
    console.log("Delete order API:", order_id);
    setOrderDeleteOpen(false);
    if (selectedOrderForDetails?.order_id === order_id) {
      setSelectedOrderForDetails(null);
    }
  }

  // ─── Order Details Handlers (Add Item, Update Item, Delete Item) ────────────

  function handleAddDetail(
    order_id: string,
    detail: { product_id: string; product_name: string; price: number; quantity: number }
  ) {
    // Ready for backend API call
    console.log("Add order detail API:", order_id, detail);
  }

  function handleUpdateDetail(
    order_id: string,
    detail_id: string,
    detail: { product_id: string; product_name: string; price: number; quantity: number }
  ) {
    // Ready for backend API call
    console.log("Update order detail API:", order_id, detail_id, detail);
  }

  function handleDeleteDetail(order_id: string, detail_id: string) {
    // Ready for backend API call
    console.log("Delete order detail API:", order_id, detail_id);
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
        onCreateClick={handleOpenCreateOrder}
      />

      {/* Main Order Table */}
      <OrderTable
        orders={filteredOrders}
        onViewDetails={(order) => setSelectedOrderForDetails(order)}
        onEditOrder={handleOpenEditOrder}
        onDeleteOrder={handleOpenDeleteOrder}
      />

      {/* Create / Edit Order Dialog */}
      <OrderFormDialog
        open={orderFormOpen}
        onOpenChange={setOrderFormOpen}
        orderToEdit={orderToEdit}
        products={products}
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
          if (!open) setSelectedOrderForDetails(null);
        }}
        order={currentDetailOrder}
        products={products}
        onAddDetail={handleAddDetail}
        onUpdateDetail={handleUpdateDetail}
        onDeleteDetail={handleDeleteDetail}
      />
    </div>
  );
}
