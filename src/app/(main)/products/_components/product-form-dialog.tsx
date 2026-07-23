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
import { useGetCategories } from "@/hooks/use-product";

import { productFormSchema, type ProductFormValues } from "@/server/validations/product.validation";
// ─── Props ────────────────────────────────────────────────────────────────────

export interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pass a product to edit; undefined = create mode */
  initialValues?: ProductFormValues & { id?: string | number };
  onSubmit: (values: ProductFormValues) => void;
}

const DEFAULT_VALUES: ProductFormValues = {
  name: "",
  category_id: "",
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
  const { data: categories } = useGetCategories();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues, unknown, ProductFormValues>({
    resolver: zodResolver(productFormSchema) as any,
    defaultValues: DEFAULT_VALUES,
  });

  // Reset form whenever dialog opens or initialValues changes
  useEffect(() => {
    if (open) {
      reset(initialValues ?? DEFAULT_VALUES);
    }
  }, [open, initialValues, reset]);

  function handleFormSubmit(data: ProductFormValues) {
    onSubmit(data)
    onOpenChange(false);
  }

  const categoryValue = watch("category_id");
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
              placeholder='Product name'
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
              onValueChange={(val) => setValue("category_id", val, { shouldValidate: true })}
            >
              <SelectTrigger id="product-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((cat) => (
                  <SelectItem key={cat.category_id} value={cat.category_id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category_id && (
              <p className="text-xs text-destructive">{errors.category_id.message}</p>
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
