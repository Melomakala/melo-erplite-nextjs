"use client";

import { useState, useMemo } from "react";
import OrderToolbar from "./_components/order-toolbar";
import OrderTable from "./_components/order-table";
import OrderFormDialog, { DraftOrderItem } from "./_components/order-form-dialog";
import OrderDeleteDialog from "./_components/order-delete-dialog";
import OrderDetailSheet from "./_components/order-detail-sheet";
import {
  MockCustomer,
  MockOrder,
  MockOrderDetail,
  MockProduct,
  OrderStatus,
} from "./_components/order-types";

// ─── Main Orders Page Component ───────────────────────────────────────────────

export default function OrdersPage() {
  const [orders, setOrders] = useState<MockOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const customers: MockCustomer[] = [];
  const products: MockProduct[] = [];

  // Dialog State: Create / Edit Order
  const [orderFormOpen, setOrderFormOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState<MockOrder | null>(null);

  // Dialog State: Delete Order
  const [orderDeleteOpen, setOrderDeleteOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<MockOrder | null>(null);

  // Sheet State: Order Details View
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<MockOrder | null>(null);

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

  function handleOpenEditOrder(order: MockOrder) {
    setOrderToEdit(order);
    setOrderFormOpen(true);
  }

  function handleOpenDeleteOrder(order: MockOrder) {
    setOrderToDelete(order);
    setOrderDeleteOpen(true);
  }

  function handleOrderFormSubmit(data: {
    customer_id: string;
    status: OrderStatus;
    items: DraftOrderItem[];
  }) {
    console.log(data);
    const cust = customers.find((c) => c.customer_id === data.customer_id);
    const custName = cust ? cust.name : "Unknown Customer";
    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);

    const formattedDetails: MockOrderDetail[] = data.items.map((item, idx) => ({
      order_id: orderToEdit ? orderToEdit.order_id : "",
      product_id: item.product_id,
      product_name: item.product_name,
      price: item.price,
      quantity: item.quantity,
      total: item.total,
      created_at: nowStr,
    }));

    const calculatedGrandTotal = formattedDetails.reduce((sum, d) => sum + d.total, 0);

    if (orderToEdit) {
      setOrders((prev) =>
        prev.map((ord) =>
          ord.order_id === orderToEdit.order_id
            ? {
              ...ord,
              customer_id: data.customer_id,
              customer_name: custName,
              status: data.status,
              order_details: formattedDetails.map((d) => ({
                ...d,
                order_id: orderToEdit.order_id,
              })),
              grand_total: calculatedGrandTotal,
              updated_at: nowStr,
            }
            : ord
        )
      );
    } else {
      const nextIdNum = orders.length + 1001;
      const newOrderId = `ORD-${nextIdNum}`;
      const newOrder: MockOrder = {
        order_id: newOrderId,
        customer_id: data.customer_id,
        customer_name: custName,
        status: data.status,
        grand_total: calculatedGrandTotal,
        order_details: formattedDetails.map((d) => ({ ...d, order_id: newOrderId })),
        created_at: nowStr,
        updated_at: nowStr,
      };
      setOrders((prev) => [newOrder, ...prev]);
    }
  }

  function handleConfirmDeleteOrder(order_id: string) {
    setOrders((prev) => prev.filter((ord) => ord.order_id !== order_id));
    if (selectedOrderForDetails?.order_id === order_id) {
      setSelectedOrderForDetails(null);
    }
  }

  // ─── Order Details Handlers (Add Item, Update Item, Delete Item) ────────────

  function handleAddDetail(
    order_id: string,
    detail: { product_id: string; product_name: string; price: number; quantity: number }
  ) {
    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
    const lineTotal = detail.price * detail.quantity;

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.order_id !== order_id) return ord;

        const newDetailItem: MockOrderDetail = {
          order_detail_id: `DET-${Date.now()}`,
          order_id,
          product_id: detail.product_id,
          product_name: detail.product_name,
          price: detail.price,
          quantity: detail.quantity,
          total: lineTotal,
          created_at: nowStr,
        };

        const updatedDetails = [...ord.order_details, newDetailItem];
        const newGrandTotal = updatedDetails.reduce((sum, item) => sum + item.total, 0);

        return {
          ...ord,
          order_details: updatedDetails,
          grand_total: newGrandTotal,
          updated_at: nowStr,
        };
      })
    );
  }

  function handleUpdateDetail(
    order_id: string,
    detail_id: string,
    detail: { product_id: string; product_name: string; price: number; quantity: number }
  ) {
    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
    const lineTotal = detail.price * detail.quantity;

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.order_id !== order_id) return ord;

        const updatedDetails = ord.order_details.map((item) =>
          item.order_detail_id === detail_id
            ? {
              ...item,
              product_id: detail.product_id,
              product_name: detail.product_name,
              price: detail.price,
              quantity: detail.quantity,
              total: lineTotal,
            }
            : item
        );

        const newGrandTotal = updatedDetails.reduce((sum, item) => sum + item.total, 0);

        return {
          ...ord,
          order_details: updatedDetails,
          grand_total: newGrandTotal,
          updated_at: nowStr,
        };
      })
    );
  }

  function handleDeleteDetail(order_id: string, detail_id: string) {
    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.order_id !== order_id) return ord;

        const updatedDetails = ord.order_details.filter(
          (item) => item.order_detail_id !== detail_id
        );
        const newGrandTotal = updatedDetails.reduce((sum, item) => sum + item.total, 0);

        return {
          ...ord,
          order_details: updatedDetails,
          grand_total: newGrandTotal,
          updated_at: nowStr,
        };
      })
    );
  }

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Orders</h1>
          <p className="text-xs text-muted-foreground">
            Manage customer orders and order line items.
          </p>
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
