"use client";

import { useState, useCallback } from "react";
import CustomerSearch from "./customer-search";
import CustomerCreateButton from "./customer-create-button";
import CustomerFilters, { type CustomerFiltersState } from "./customer-filters";

interface CustomerToolbarProps {
  onSearch?: (value: string) => void;
  onClickCreate?: () => void;
  filters: CustomerFiltersState;
  onFiltersChange: (values: CustomerFiltersState) => void;
}

export default function CustomerToolbar({
  onSearch,
  onClickCreate,
  filters,
  onFiltersChange,
}: CustomerToolbarProps) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value);
      onSearch?.(value);
    },
    [onSearch]
  );

  return (
    <div className="flex items-center justify-between gap-3">
      {/* Left: Search + Filters */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <CustomerSearch value={searchValue} onChange={handleSearch} />
        <CustomerFilters values={filters} onChange={onFiltersChange} />
      </div>

      {/* Right: Create button */}
      <CustomerCreateButton onClick={onClickCreate} />
    </div>
  );
}
