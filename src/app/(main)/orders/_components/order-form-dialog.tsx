"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MockCustomer, MockOrder, OrderStatus } from "./order-types";

interface OrderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderToEdit?: MockOrder | null;
  customers: MockCustomer[];
  onSubmit: (data: { customer_id: string; status: OrderStatus }) => void;
}

export default function OrderFormDialog({
  open,
  onOpenChange,
  orderToEdit,
  customers,
  onSubmit,
}: OrderFormDialogProps) {
  const isEditing = !!orderToEdit;

  const [customerId, setCustomerId] = useState<string>("");
  const [status, setStatus] = useState<OrderStatus>("PENDING");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (open) {
      if (orderToEdit) {
        setCustomerId(orderToEdit.customer_id);
        setStatus(orderToEdit.status);
      } else {
        setCustomerId(customers[0]?.customer_id || "");
        setStatus("PENDING");
      }
      setError("");
    }
  }, [open, orderToEdit, customers]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customerId) {
      setError("Please select a customer");
      return;
    }
    onSubmit({ customer_id: customerId, status });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Order" : "Create New Order"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Customer Selector */}
          <div className="space-y-1.5">
            <Label htmlFor="order-customer">Customer</Label>
            <Select value={customerId} onValueChange={(val) => { setCustomerId(val); setError(""); }}>
              <SelectTrigger id="order-customer" className="h-9 text-xs">
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((cust) => (
                  <SelectItem key={cust.customer_id} value={cust.customer_id}>
                    {cust.name} ({cust.customer_id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          {/* Status Selector */}
          <div className="space-y-1.5">
            <Label htmlFor="order-status">Order Status</Label>
            <Select value={status} onValueChange={(val) => setStatus(val as OrderStatus)}>
              <SelectTrigger id="order-status" className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">PENDING</SelectItem>
                <SelectItem value="PAID">PAID</SelectItem>
                <SelectItem value="SHIPPED">SHIPPED</SelectItem>
                <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                <SelectItem value="CANCELLED">CANCELLED</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              {isEditing ? "Save Changes" : "Create Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
