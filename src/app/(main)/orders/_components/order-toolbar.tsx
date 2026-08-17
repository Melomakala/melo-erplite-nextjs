"use client";

import { Search, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OrderStatus } from "./order-types";

interface OrderToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: OrderStatus | "ALL";
  onStatusFilterChange: (status: OrderStatus | "ALL") => void;
  onCreateClick: () => void;
}

export default function OrderToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onCreateClick,
}: OrderToolbarProps) {
  const isFiltered = statusFilter !== "ALL";

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      {/* Left: Search + Filters */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {/* Search Input matching customer-search style */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Status Filter matching customer-filters style */}
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="h-8 w-[140px] text-xs">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PENDING">PENDING</SelectItem>
            <SelectItem value="PAID">PAID</SelectItem>
            <SelectItem value="SHIPPED">SHIPPED</SelectItem>
            <SelectItem value="COMPLETED">COMPLETED</SelectItem>
            <SelectItem value="CANCELLED">CANCELLED</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters Button */}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2.5 text-xs text-muted-foreground gap-1.5"
            onClick={() => onStatusFilterChange("ALL")}
          >
            <X className="h-3 w-3" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Right: Create Order button matching customer-create-button style */}
      <Button variant="default" onClick={onCreateClick} className="gap-1.5 shrink-0">
        <Plus className="h-4 w-4" />
        Create Order
      </Button>
    </div>
  );
}
