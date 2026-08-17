"use client";

import { useEffect, useState, useMemo } from "react";
import { Plus, Trash2, ShoppingBag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Order, OrderStatus } from "./order-types";
import CustomerCombobox from "./customer-combobox";
import ProductCombobox from "./product-combobox";
import { type ProductFormValues } from "@/server/validations/product.validation";
import { orderSchema, type OrderFormValues } from "@/server/validations/order.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";

export interface DraftOrderItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  total: number;
}

interface OrderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderToEdit?: Order | null;
  onSubmit: (data: OrderFormValues) => void;
}

export default function OrderFormDialog({
  open,
  onOpenChange,
  orderToEdit,
  onSubmit,
}: OrderFormDialogProps) {
  const isEditing = !!orderToEdit;

  // Quick line item entry form state
  const [selectedProduct, setSelectedProduct] = useState<ProductFormValues | null>(null);
  const [itemPrice, setItemPrice] = useState<number>(0);
  const [itemQuantity, setItemQuantity] = useState<number>(1);
  const [itemError, setItemError] = useState<string>("");

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customer_id: "",
      status: "PENDING",
      order_details: [],
    },
  });
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "order_details"
  });

  useEffect(() => {
    if (open) {
      if (orderToEdit) {
        form.reset({
          customer_id: orderToEdit.customer_id,
          status: orderToEdit.status,
          order_details: orderToEdit.order_details.map((d) => ({
            product_id: d.product_id,
            product_name: d.product?.name || " ",
            price: d.price,
            quantity: d.quantity,
            total: d.total,
          })),
        });
      } else {
        form.reset({
          customer_id: "",
          status: "PENDING",
          order_details: [],
        });
      }
      setItemError("");

      // Set default product for item entry form
      setSelectedProduct(null);
      setItemPrice(0);
      setItemQuantity(1);
    }
  }, [open, orderToEdit, form]);

  // When product selection changes in quick entry bar
  function handleProductChange(product: ProductFormValues | null) {
    if (product?.product_id) {
      setSelectedProduct(product);
      setItemPrice(product.price);
    } else {
      setSelectedProduct(null);
      setItemPrice(0);
    }
  }

  // Add line item to list
  function handleAddItem() {
    setItemError("");
    if (!selectedProduct) {
      setItemError("Please select a product");
      return;
    }
    if (itemQuantity <= 0) {
      setItemError("Quantity must be at least 1");
      return;
    }
    if (itemPrice < 0) {
      setItemError("Price cannot be negative");
      return;
    }

    const lineTotal = itemPrice * itemQuantity;

    append({
      product_id: selectedProduct.product_id || "",
      product_name: selectedProduct.name || "",
      price: itemPrice,
      quantity: itemQuantity,
      total: lineTotal,
    });

    // Reset quick entry quantity
    setItemQuantity(1);
    setSelectedProduct(null);
    setItemPrice(0)
  }

  // Remove line item
  function handleRemoveItem(index: number) {
    remove(index)
  }

  // Update item quantity directly in table
  function handleUpdateItemQty(index: number, qty: number) {
    const validQty = Math.max(1, qty);
    const item = fields[index];
    update(index, {
      ...item,
      quantity: validQty,
      total: item.price * validQty,
    });
  }

  // Grand Total calculation
  const grandTotal = useMemo(() => {
    return fields.reduce((sum, item) => sum + item.total, 0);
  }, [fields]);

  function handleOnSubmit(data: OrderFormValues) {
    onSubmit(data);
    onOpenChange(false);
  }

  const currentSubtotalPreview = itemPrice * itemQuantity;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="sm:max-w-[760px] max-h-[90vh] flex flex-col p-0 overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-border bg-muted/20">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-foreground">
              {isEditing ? "Edit Order" : "Create New Order"}
            </DialogTitle>
          </DialogHeader>
        </div>

        <form onSubmit={form.handleSubmit(handleOnSubmit)} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* Header Form: Customer Combobox & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3 rounded-lg border border-border bg-card items-start">
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="order-customer" className="text-xs font-medium">
                  Customer <span className="text-destructive">*</span>
                </Label>
                <CustomerCombobox
                  value={form.watch("customer_id")}
                  onChange={(val) => {
                    form.setValue("customer_id", val, { shouldValidate: true });
                  }}
                  error={form.formState.errors.customer_id?.message}
                />
              </div>

              <div className="space-y-1.5" >
                <Label htmlFor="order-status" className="text-xs font-medium">
                  Order Status
                </Label>
                <Select
                  value={form.watch("status")}
                  onValueChange={(val) => form.setValue("status", val as any, { shouldValidate: true })}
                >
                  <SelectTrigger id="order-status" className="h-9 data-[size=default]:h-9 text-xs w-full bg-card">
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
            </div>

            {/* Order Details / Line Items Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-foreground tracking-wide uppercase">
                  Order Details (Line Items)
                </h3>
                <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {fields.length} {fields.length === 1 ? "item" : "items"}
                </span>
              </div>

              {/* Quick Add Line Item Entry Bar */}
              <div className="p-3 rounded-lg border border-border bg-muted/30 space-y-2">
                <span className="text-[11px] font-medium text-muted-foreground">Add Item to Order:</span>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
                  {/* Searchable Product Combobox */}
                  <div className="sm:col-span-5 space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Product</Label>
                    <ProductCombobox
                      value={selectedProduct?.product_id || ""}
                      onChange={handleProductChange}
                    />
                  </div>

                  {/* Unit Price */}
                  <div className="sm:col-span-2 space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Price (฿)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={itemPrice}
                      onChange={(e) => setItemPrice(Number(e.target.value))}
                      className="h-8 text-xs bg-card"
                    />
                  </div>

                  {/* Quantity */}
                  <div className="sm:col-span-2 space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Qty</Label>
                    <Input
                      type="number"
                      min="1"
                      value={itemQuantity}
                      onChange={(e) => setItemQuantity(Number(e.target.value))}
                      className="h-8 text-xs bg-card"
                    />
                  </div>

                  {/* Subtotal Preview & Add Button */}
                  <div className="sm:col-span-3 flex items-center justify-end gap-2">
                    <div className="text-right pr-1">
                      <span className="text-[10px] text-muted-foreground block">Subtotal</span>
                      <span className="text-xs font-semibold text-foreground">
                        ฿{currentSubtotalPreview.toLocaleString()}
                      </span>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAddItem}
                      className="h-8 text-xs gap-1 shrink-0"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add
                    </Button>
                  </div>
                </div>

                {itemError && <p className="text-xs text-destructive mt-1">{itemError}</p>}
              </div>

              {/* Items Table */}
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-muted-foreground font-medium uppercase tracking-wider">
                      <th className="px-3 py-2 text-left">Product Name</th>
                      <th className="px-3 py-2 text-right">Unit Price</th>
                      <th className="px-3 py-2 text-center w-24">Qty</th>
                      <th className="px-3 py-2 text-right">Subtotal</th>
                      <th className="px-3 py-2 text-center w-12">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">
                          <div className="flex flex-col items-center justify-center space-y-1">
                            <ShoppingBag className="h-5 w-5 text-muted-foreground/50" />
                            <p className="text-xs">No items added to this order yet.</p>
                            <p className="text-[11px] text-muted-foreground">
                              Search a product above and click Add to include items.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      fields.map((item, index) => (
                        <tr
                          key={item.id}
                          className="border-b border-border last:border-0 hover:bg-muted/20"
                        >
                          <td className="px-3 py-2 font-medium text-foreground">
                            {item.product_name}
                          </td>
                          <td className="px-3 py-2 text-right text-muted-foreground tabular-nums">
                            ฿{item.price.toLocaleString()}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                handleUpdateItemQty(index, Number(e.target.value))
                              }
                              className="h-7 w-16 text-xs text-center mx-auto"
                            />
                          </td>
                          <td className="px-3 py-2 text-right font-semibold text-foreground tabular-nums">
                            ฿{item.total.toLocaleString()}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() => handleRemoveItem(index)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span className="sr-only">Remove item</span>
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Dialog Footer with Grand Total */}
          <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">Grand Total:</span>
              <span className="text-base font-bold text-primary tabular-nums">
                ฿{grandTotal.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                {isEditing ? "Save Changes" : "Create Order"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
