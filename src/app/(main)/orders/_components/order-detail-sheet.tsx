"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, ShoppingBag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Order, OrderDetail, OrderProduct } from "./order-types";
import OrderDetailFormDialog from "./order-detail-form-dialog";
import OrderDetailDeleteDialog from "./order-detail-delete-dialog";

interface OrderDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  products: OrderProduct[];
  onAddDetail: (order_id: string, detail: { product_id: string; product_name: string; price: number; quantity: number }) => void;
  onUpdateDetail: (order_id: string, detail_id: string, detail: { product_id: string; product_name: string; price: number; quantity: number }) => void;
  onDeleteDetail: (order_id: string, detail_id: string) => void;
}

export default function OrderDetailSheet({
  open,
  onOpenChange,
  order,
  products,
  onAddDetail,
  onUpdateDetail,
  onDeleteDetail,
}: OrderDetailSheetProps) {
  const [detailFormOpen, setDetailFormOpen] = useState(false);
  const [detailToEdit, setDetailToEdit] = useState<OrderDetail | null>(null);

  const [detailDeleteOpen, setDetailDeleteOpen] = useState(false);
  const [detailToDelete, setDetailToDelete] = useState<OrderDetail | null>(null);

  if (!order) return null;

  function handleOpenAdd() {
    setDetailToEdit(null);
    setDetailFormOpen(true);
  }

  function handleOpenEdit(detail: MockOrderDetail) {
    setDetailToEdit(detail);
    setDetailFormOpen(true);
  }

  function handleOpenDelete(detail: MockOrderDetail) {
    setDetailToDelete(detail);
    setDetailDeleteOpen(true);
  }

  function handleDetailFormSubmit(data: { product_id: string; product_name: string; price: number; quantity: number }) {
    if (!order) return;
    if (detailToEdit) {
      onUpdateDetail(order.order_id, detailToEdit.order_detail_id, data);
    } else {
      onAddDetail(order.order_id, data);
    }
  }

  function handleConfirmDeleteDetail(detail_id: string) {
    if (!order) return;
    onDeleteDetail(order.order_id, detail_id);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent aria-describedby={undefined} className="sm:max-w-[640px] max-h-[85vh] flex flex-col p-0 overflow-hidden">
          {/* Header with pr-12 padding to prevent overlap with Dialog close (X) button */}
          <div className="p-4 pr-12 border-b border-border bg-muted/30">
            <DialogHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <DialogTitle className="text-base font-semibold flex items-center gap-2">
                    Order Details: <span className="font-mono text-primary">{order.order_id}</span>
                  </DialogTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Customer: <span className="font-medium text-foreground">{order.customer_name}</span> | Status:{" "}
                    <span className="font-semibold text-foreground">{order.status}</span>
                  </p>
                </div>

                <Button size="sm" onClick={handleOpenAdd} className="h-8 text-xs gap-1 shrink-0">
                  <Plus className="h-3.5 w-3.5" /> Add Item
                </Button>
              </div>
            </DialogHeader>
          </div>

          {/* Details Table */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground text-xs font-medium uppercase tracking-wider">
                    <th className="px-3 py-2.5 text-left">Product</th>
                    <th className="px-3 py-2.5 text-right">Price</th>
                    <th className="px-3 py-2.5 text-center">Qty</th>
                    <th className="px-3 py-2.5 text-right">Subtotal</th>
                    <th className="px-3 py-2.5 text-center w-20">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {order.order_details.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-8 text-center text-muted-foreground text-xs">
                        <div className="flex flex-col items-center justify-center space-y-1.5">
                          <ShoppingBag className="h-6 w-6 text-muted-foreground/50" />
                          <p>No items in this order yet.</p>
                          <Button variant="link" size="sm" className="h-auto text-xs p-0" onClick={handleOpenAdd}>
                            Click here to add an item
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    order.order_details.map((detail) => (
                      <tr key={detail.order_detail_id} className="border-b border-border last:border-0 hover:bg-muted/20">
                        <td className="px-3 py-2.5 font-medium text-foreground text-xs">
                          {detail.product_name}
                        </td>
                        <td className="px-3 py-2.5 text-right text-muted-foreground text-xs tabular-nums">
                          ฿{detail.price.toLocaleString()}
                        </td>
                        <td className="px-3 py-2.5 text-center text-muted-foreground text-xs tabular-nums">
                          {detail.quantity}
                        </td>
                        <td className="px-3 py-2.5 text-right font-semibold text-foreground text-xs tabular-nums">
                          ฿{detail.total.toLocaleString()}
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-foreground"
                              onClick={() => handleOpenEdit(detail)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              <span className="sr-only">Edit item</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() => handleOpenDelete(detail)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span className="sr-only">Delete item</span>
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

          {/* Footer with Grand Total */}
          <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground">Total Line Items: </span>
              <span className="text-xs font-semibold text-foreground">{order.order_details.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">Grand Total:</span>
              <span className="text-lg font-bold text-primary tabular-nums">
                ฿{order.grand_total.toLocaleString()}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Item Form Dialog */}
      <OrderDetailFormDialog
        open={detailFormOpen}
        onOpenChange={setDetailFormOpen}
        detailToEdit={detailToEdit}
        products={products}
        onSubmit={handleDetailFormSubmit}
      />

      {/* Item Delete Dialog */}
      <OrderDetailDeleteDialog
        open={detailDeleteOpen}
        onOpenChange={setDetailDeleteOpen}
        detail={detailToDelete}
        onConfirmDelete={handleConfirmDeleteDetail}
      />
    </>
  );
}
