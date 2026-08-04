"use client";

import { useState, useMemo } from "react";
import OrderToolbar from "./_components/order-toolbar";
import OrderTable from "./_components/order-table";
import OrderFormDialog from "./_components/order-form-dialog";
import OrderDeleteDialog from "./_components/order-delete-dialog";
import OrderDetailSheet from "./_components/order-detail-sheet";
import {
  MockCustomer,
  MockOrder,
  MockOrderDetail,
  MockProduct,
  OrderStatus,
} from "./_components/order-types";

// ─── Initial Mock Data ────────────────────────────────────────────────────────

const MOCK_CUSTOMERS: MockCustomer[] = [
  { customer_id: "CUST-001", name: "Somchai Jaidee" },
  { customer_id: "CUST-002", name: "Mana Deeja" },
  { customer_id: "CUST-003", name: "Somsri Rungruang" },
  { customer_id: "CUST-004", name: "Piti Rakdee" },
];

const MOCK_PRODUCTS: MockProduct[] = [
  { product_id: "PROD-001", name: "ERP Lite Standard License", price: 15000 },
  { product_id: "PROD-002", name: "Implementation & Setup Service", price: 35000 },
  { product_id: "PROD-003", name: "User Training Workshop", price: 8000 },
  { product_id: "PROD-004", name: "Annual Support Package", price: 12000 },
];

const INITIAL_ORDERS: MockOrder[] = [
  {
    order_id: "ORD-1001",
    customer_id: "CUST-001",
    customer_name: "Somchai Jaidee",
    status: "PAID",
    grand_total: 50000,
    created_at: "2026-08-01 10:30",
    updated_at: "2026-08-01 10:30",
    order_details: [
      {
        order_detail_id: "DET-1",
        order_id: "ORD-1001",
        product_id: "PROD-001",
        product_name: "ERP Lite Standard License",
        price: 15000,
        quantity: 1,
        total: 15000,
        created_at: "2026-08-01 10:30",
      },
      {
        order_detail_id: "DET-2",
        order_id: "ORD-1001",
        product_id: "PROD-002",
        product_name: "Implementation & Setup Service",
        price: 35000,
        quantity: 1,
        total: 35000,
        created_at: "2026-08-01 10:30",
      },
    ],
  },
  {
    order_id: "ORD-1002",
    customer_id: "CUST-002",
    customer_name: "Mana Deeja",
    status: "PENDING",
    grand_total: 8000,
    created_at: "2026-08-03 14:15",
    updated_at: "2026-08-03 14:15",
    order_details: [
      {
        order_detail_id: "DET-3",
        order_id: "ORD-1002",
        product_id: "PROD-003",
        product_name: "User Training Workshop",
        price: 8000,
        quantity: 1,
        total: 8000,
        created_at: "2026-08-03 14:15",
      },
    ],
  },
  {
    order_id: "ORD-1003",
    customer_id: "CUST-003",
    customer_name: "Somsri Rungruang",
    status: "SHIPPED",
    grand_total: 24000,
    created_at: "2026-08-04 09:00",
    updated_at: "2026-08-04 09:00",
    order_details: [
      {
        order_detail_id: "DET-4",
        order_id: "ORD-1003",
        product_id: "PROD-004",
        product_name: "Annual Support Package",
        price: 12000,
        quantity: 2,
        total: 24000,
        created_at: "2026-08-04 09:00",
      },
    ],
  },
];

// ─── Main Orders Page Component ───────────────────────────────────────────────

export default function OrdersPage() {
  const [orders, setOrders] = useState<MockOrder[]>(INITIAL_ORDERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

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

  function handleOrderFormSubmit(data: { customer_id: string; status: OrderStatus }) {
    const cust = MOCK_CUSTOMERS.find((c) => c.customer_id === data.customer_id);
    const custName = cust ? cust.name : "Unknown Customer";
    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);

    if (orderToEdit) {
      // Update existing order header
      setOrders((prev) =>
        prev.map((ord) =>
          ord.order_id === orderToEdit.order_id
            ? {
                ...ord,
                customer_id: data.customer_id,
                customer_name: custName,
                status: data.status,
                updated_at: nowStr,
              }
            : ord
        )
      );
    } else {
      // Create new order
      const nextIdNum = orders.length + 1001;
      const newOrder: MockOrder = {
        order_id: `ORD-${nextIdNum}`,
        customer_id: data.customer_id,
        customer_name: custName,
        status: data.status,
        grand_total: 0,
        order_details: [],
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

      {/* Create / Edit Order Header Dialog */}
      <OrderFormDialog
        open={orderFormOpen}
        onOpenChange={setOrderFormOpen}
        orderToEdit={orderToEdit}
        customers={MOCK_CUSTOMERS}
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
        products={MOCK_PRODUCTS}
        onAddDetail={handleAddDetail}
        onUpdateDetail={handleUpdateDetail}
        onDeleteDetail={handleDeleteDetail}
      />
    </div>
  );
}
