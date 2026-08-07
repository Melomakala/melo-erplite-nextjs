"use client";

import { Eye, Pencil, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Order, OrderStatus } from "./order-types";

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  switch (status) {
    case "PAID":
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/20">
          PAID
        </span>
      );
    case "SHIPPED":
      return (
        <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-600/20">
          SHIPPED
        </span>
      );
    case "COMPLETED":
      return (
        <span className="inline-flex items-center rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-medium text-purple-700 dark:text-purple-400 ring-1 ring-inset ring-purple-600/20">
          COMPLETED
        </span>
      );
    case "CANCELLED":
      return (
        <span className="inline-flex items-center rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-medium text-rose-700 dark:text-rose-400 ring-1 ring-inset ring-rose-600/20">
          CANCELLED
        </span>
      );
    case "PENDING":
    default:
      return (
        <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400 ring-1 ring-inset ring-amber-600/20">
          PENDING
        </span>
      );
  }
}

interface OrderTableProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
  onEditOrder: (order: Order) => void;
  onDeleteOrder: (order: Order) => void;
}

export default function OrderTable({
  orders,
  onViewDetails,
  onEditOrder,
  onDeleteOrder,
}: OrderTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-muted-foreground text-xs font-medium uppercase tracking-wider">
              <th className="px-4 py-3 text-left w-28">Order ID</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-center">Items</th>
              <th className="px-4 py-3 text-right">Grand Total</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-left">Created At</th>
              <th className="px-4 py-3 text-center w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground text-sm">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <ShoppingBag className="h-8 w-8 text-muted-foreground/50" />
                    <p>No orders found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.order_id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  {/* Order ID */}
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-foreground">
                    {order.order_id}
                  </td>

                  {/* Customer Name */}
                  <td className="px-4 py-3 font-medium text-foreground">
                    {order.customer_name}
                  </td>

                  {/* Items Count */}
                  <td className="px-4 py-3 text-center text-muted-foreground tabular-nums">
                    {order.order_details.length} item{order.order_details.length !== 1 ? "s" : ""}
                  </td>

                  {/* Grand Total */}
                  <td className="px-4 py-3 text-right font-semibold text-foreground tabular-nums">
                    ฿{order.grand_total.toLocaleString()}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 text-center">
                    <OrderStatusBadge status={order.status} />
                  </td>

                  {/* Created At */}
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {order.created_at}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      {/* View Order Details */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        title="View Order Details"
                        onClick={() => onViewDetails(order)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </Button>

                      {/* Edit Order Header */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        title="Edit Order"
                        onClick={() => onEditOrder(order)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span className="sr-only">Edit</span>
                      </Button>

                      {/* Delete Order */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        title="Delete Order"
                        onClick={() => onDeleteOrder(order)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
