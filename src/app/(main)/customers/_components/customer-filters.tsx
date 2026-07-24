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

export type CustomerStatusFilter = "all" | "active" | "inactive";

export interface CustomerFiltersState {
  status: CustomerStatusFilter;
}

interface CustomerFiltersProps {
  values: CustomerFiltersState;
  onChange: (values: CustomerFiltersState) => void;
}

const DEFAULT_FILTERS: CustomerFiltersState = {
  status: "all",
};

export default function CustomerFilters({ values, onChange }: CustomerFiltersProps) {
  const isFiltered = values.status !== "all";

  function handleStatusChange(val: string) {
    onChange({ ...values, status: val as CustomerStatusFilter });
  }

  function handleClearFilters() {
    onChange(DEFAULT_FILTERS);
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
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
