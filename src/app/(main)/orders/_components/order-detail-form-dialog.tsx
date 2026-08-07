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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderDetail, OrderProduct } from "./order-types";

interface OrderDetailFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  detailToEdit?: OrderDetail | null;
  products: OrderProduct[];
  onSubmit: (data: { product_id: string; product_name: string; price: number; quantity: number }) => void;
}

export default function OrderDetailFormDialog({
  open,
  onOpenChange,
  detailToEdit,
  products,
  onSubmit,
}: OrderDetailFormDialogProps) {
  const isEditing = !!detailToEdit;

  const [productId, setProductId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (open) {
      if (detailToEdit) {
        setProductId(detailToEdit.product_id);
        setQuantity(detailToEdit.quantity);
        setPrice(detailToEdit.price);
      } else {
        const defaultProd = products[0];
        setProductId(defaultProd?.product_id || "");
        setQuantity(1);
        setPrice(defaultProd?.price || 0);
      }
      setError("");
    }
  }, [open, detailToEdit, products]);

  function handleProductSelect(selectedId: string) {
    setProductId(selectedId);
    const prod = products.find((p) => p.product_id === selectedId);
    if (prod && !isEditing) {
      setPrice(prod.price);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!productId) {
      setError("Please select a product");
      return;
    }
    if (quantity <= 0) {
      setError("Quantity must be at least 1");
      return;
    }
    if (price < 0) {
      setError("Price cannot be negative");
      return;
    }

    const prod = products.find((p) => p.product_id === productId);
    const prodName = prod ? prod.name : detailToEdit?.product_name || "Unknown Product";

    onSubmit({
      product_id: productId,
      product_name: prodName,
      price,
      quantity,
    });
    onOpenChange(false);
  }

  const lineTotal = quantity * price;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Item in Order" : "Add Item to Order"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Product Select */}
          <div className="space-y-1.5">
            <Label htmlFor="detail-product">Product</Label>
            <Select value={productId} onValueChange={handleProductSelect}>
              <SelectTrigger id="detail-product" className="h-9 text-xs">
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.product_id} value={p.product_id}>
                    {p.name} (฿{p.price.toLocaleString()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Unit Price */}
            <div className="space-y-1.5">
              <Label htmlFor="detail-price">Unit Price (฿)</Label>
              <Input
                id="detail-price"
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="h-9 text-xs"
              />
            </div>

            {/* Quantity */}
            <div className="space-y-1.5">
              <Label htmlFor="detail-qty">Quantity</Label>
              <Input
                id="detail-qty"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="h-9 text-xs"
              />
            </div>
          </div>

          {/* Computed Line Total Preview */}
          <div className="flex items-center justify-between p-2.5 rounded-md bg-muted/40 border border-border text-xs">
            <span className="text-muted-foreground font-medium">Computed Subtotal:</span>
            <span className="font-semibold text-foreground text-sm">฿{lineTotal.toLocaleString()}</span>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              {isEditing ? "Save Item" : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
