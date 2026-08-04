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
import { MockOrderDetail } from "./order-types";

interface OrderDetailDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  detail: MockOrderDetail | null;
  onConfirmDelete: (detail_id: string) => void;
}

export default function OrderDetailDeleteDialog({
  open,
  onOpenChange,
  detail,
  onConfirmDelete,
}: OrderDetailDeleteDialogProps) {
  if (!detail) return null;

  function handleDelete() {
    if (detail) {
      onConfirmDelete(detail.order_detail_id);
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-[380px]">
        <DialogHeader>
          <DialogTitle className="text-destructive font-semibold">Remove Item</DialogTitle>
          <DialogDescription className="text-xs pt-1">
            Are you sure you want to remove <span className="font-semibold text-foreground">{detail.product_name}</span> from this order?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-3">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            Remove Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
