"use client";

import { useState, useCallback } from "react";
import ProductSearch from "./product-search";
import ProductCreateButton from "./product-create-button";
import ProductFilters, { type ProductFiltersState } from "./product-filters";

interface ProductToolbarProps {
  onSearch?: (value: string) => void;
  onClickCreate?: () => void;
  filters: ProductFiltersState;
  onFiltersChange: (values: ProductFiltersState) => void;
}

export default function ProductToolbar({
  onSearch,
  onClickCreate,
  filters,
  onFiltersChange,
}: ProductToolbarProps) {
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
        <ProductSearch value={searchValue} onChange={handleSearch} />
        <ProductFilters values={filters} onChange={onFiltersChange} />
      </div>

      {/* Right: Create button */}
      <ProductCreateButton onClick={onClickCreate} />
    </div>
  );
}
