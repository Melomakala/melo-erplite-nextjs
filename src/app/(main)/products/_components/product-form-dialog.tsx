"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Schema ───────────────────────────────────────────────────────────────────

const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0, "Price must be 0 or more"),
  stock: z.coerce.number().int().min(0, "Stock must be 0 or more"),
  status: z.enum(["active", "inactive"]),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

// Raw form field values (before coercion — price/stock can be empty string in input)
type ProductFormInput = {
  name: string;
  category: string;
  price: string | number;
  stock: string | number;
  status: "active" | "inactive";
};

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pass a product to edit; undefined = create mode */
  initialValues?: ProductFormValues & { id?: number };
  onSubmit: (values: ProductFormValues) => void;
}

const CATEGORY_OPTIONS = [
  "Computer",
  "Smartphone",
  "Headphones",
  "Tablet",
  "Smart Watch",
  "Accessory",
  "Monitor",
  "Other",
];

const DEFAULT_VALUES: ProductFormValues = {
  name: "",
  category: "",
  price: 0,
  stock: 0,
  status: "active",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductFormDialog({
  open,
  onOpenChange,
  initialValues,
  onSubmit,
}: ProductDialogProps) {
  const isEditing = !!initialValues?.id;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<ProductFormValues, unknown, ProductFormValues>({
    // Cast needed: zodResolver with z.coerce produces `unknown` input types
    // which conflict with react-hook-form's TFieldValues constraint.
    resolver: zodResolver(productFormSchema) as any,
    defaultValues: DEFAULT_VALUES,
  });

  // Reset form whenever dialog opens or initialValues changes
  useEffect(() => {
    if (open) {
      reset(initialValues ?? DEFAULT_VALUES);
    }
  }, [open, initialValues, reset]);

  function handleFormSubmit(values: ProductFormValues) {
    onSubmit(values);
    onOpenChange(false);
  }

  const categoryValue = watch("category");
  const statusValue = watch("status");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Product" : "Create Product"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-2">
          {/* Product Name */}
          <div className="space-y-1.5">
            <Label htmlFor="product-name">Product Name</Label>
            <Input
              id="product-name"
              placeholder='e.g. MacBook Pro 14"'
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label htmlFor="product-category">Category</Label>
            <Select
              value={categoryValue}
              onValueChange={(val) => setValue("category", val, { shouldValidate: true })}
            >
              <SelectTrigger id="product-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-destructive">{errors.category.message}</p>
            )}
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="product-price">Price (THB)</Label>
              <Input
                id="product-price"
                type="number"
                min={0}
                placeholder="0"
                {...register("price")}
              />
              {errors.price && (
                <p className="text-xs text-destructive">{errors.price.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="product-stock">Stock</Label>
              <Input
                id="product-stock"
                type="number"
                min={0}
                placeholder="0"
                {...register("stock")}
              />
              {errors.stock && (
                <p className="text-xs text-destructive">{errors.stock.message}</p>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label htmlFor="product-status">Status</Label>
            <Select
              value={statusValue}
              onValueChange={(val) =>
                setValue("status", val as "active" | "inactive", { shouldValidate: true })
              }
            >
              <SelectTrigger id="product-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-xs text-destructive">{errors.status.message}</p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? "Save Changes" : "Create Product"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
