"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetCategories } from "@/hooks/use-product";

// ─── Constants ────────────────────────────────────────────────────────────────

export type StatusFilter = "all" | "active" | "inactive";
export type CategoryFilter = string;

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ProductFiltersState {
  category: CategoryFilter;
  status: StatusFilter;
}

interface ProductFiltersProps {
  values: ProductFiltersState;
  onChange: (values: ProductFiltersState) => void;
}

const DEFAULT_FILTERS: ProductFiltersState = {
  category: "all",
  status: "all",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductFilters({ values, onChange }: ProductFiltersProps) {
  const isFiltered = values.category !== "all" || values.status !== "all";

  const { data: categories, isLoading, isError } = useGetCategories();

  function handleCategoryChange(val: string) {
    onChange({ ...values, category: val as CategoryFilter });
  }

  function handleStatusChange(val: string) {
    onChange({ ...values, status: val as StatusFilter });
  }

  function handleClearFilters() {
    onChange(DEFAULT_FILTERS);
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Category Filter */}
      <Select value={values.category} onValueChange={handleCategoryChange}>
        <SelectTrigger className="h-8 w-[160px] text-xs">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories?.map((cat) => (
            <SelectItem key={cat.category_id} value={cat.category_id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select value={values.status} onValueChange={handleStatusChange}>
        <SelectTrigger className="h-8 w-[130px] text-xs">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {isFiltered && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2.5 text-xs text-muted-foreground gap-1.5"
          onClick={handleClearFilters}
        >
          <X className="h-3 w-3" />
          Clear filters
        </Button>
      )}
    </div>
  );
}
