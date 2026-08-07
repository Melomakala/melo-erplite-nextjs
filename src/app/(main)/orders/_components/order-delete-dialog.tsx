"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Order } from "./order-types";

interface OrderDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onConfirmDelete: (order_id: string) => void;
}

export default function OrderDeleteDialog({
  open,
  onOpenChange,
  order,
  onConfirmDelete,
}: OrderDeleteDialogProps) {
  if (!order) return null;

  function handleDelete() {
    if (order) {
      onConfirmDelete(order.order_id);
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-destructive font-semibold">Delete Order</DialogTitle>
          <DialogDescription className="text-xs pt-1">
            Are you sure you want to delete order{" "}
            <span className="font-mono font-semibold text-foreground">{order.order_id}</span> for{" "}
            <span className="font-semibold text-foreground">{order.customer_name}</span>?
            This will also delete all associated order detail line items.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-3">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            Delete Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
