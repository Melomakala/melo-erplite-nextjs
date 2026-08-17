"use client";

import { useState } from "react";
import { Plus, Pencil, Printer, ShoppingBag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Order, OrderDetail } from "./order-types";

interface OrderDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

export default function OrderDetailSheet({
  open,
  onOpenChange,
  order,
}: OrderDetailSheetProps) {
  if (!order) return null;

  function handleDetailReport() {

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
                    Customer: <span className="font-medium text-foreground">{order.customer?.name || order.name || "-"}</span> | Status:{" "}
                    <span className="font-semibold text-foreground">{order.status}</span>
                  </p>
                </div>

                <Button size="sm" onClick={handleDetailReport} className="h-8 text-xs gap-1 shrink-0">
                  <Printer className="h-3.5 w-3.5" /> Report
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
                  </tr>
                </thead>
                <tbody>
                  {order.order_details.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-3 py-8 text-center text-muted-foreground text-xs">
                        <div className="flex flex-col items-center justify-center space-y-1.5">
                          <ShoppingBag className="h-6 w-6 text-muted-foreground/50" />
                          <p>No items in this order yet.</p>
                          <Button variant="link" size="sm" className="h-auto text-xs p-0">
                            Click here to add an item
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    order.order_details.map((detail) => (
                      <tr key={detail.order_detail_id} className="border-b border-border last:border-0 hover:bg-muted/20">
                        <td className="px-3 py-2.5 font-medium text-foreground text-xs">
                          {detail.product?.name || detail.product_name || "-"}
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
    </>
  );
}
