"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MockProduct } from "./order-types";

interface ProductComboboxProps {
  products: MockProduct[];
  value: string;
  onChange: (productId: string) => void;
  error?: string;
  className?: string;
}

export default function ProductCombobox({
  products,
  value,
  onChange,
  error,
  className,
}: ProductComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedProduct = products.find((p) => p.product_id === value);

  // Sync input display when value changes externally
  useEffect(() => {
    if (selectedProduct) {
      setQuery(selectedProduct.name);
    } else if (!value) {
      setQuery("");
    }
  }, [value, selectedProduct]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        if (selectedProduct) {
          setQuery(selectedProduct.name);
        } else {
          setQuery("");
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedProduct]);

  const filteredProducts = products.filter((prod) =>
    prod.name.toLowerCase().includes(query.toLowerCase()) ||
    prod.product_id.toLowerCase().includes(query.toLowerCase())
  );

  function handleSelect(prod: MockProduct) {
    onChange(prod.product_id);
    setQuery(prod.name);
    setOpen(false);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setOpen(true);
    if (!e.target.value) {
      onChange("");
    }
  }

  return (
    <div ref={containerRef} className={`relative w-full ${className || ""}`}>
      <div className="relative">
        <Input
          type="text"
          placeholder="Type product name..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          className="h-8 text-xs pr-7 pl-7 focus-visible:ring-1 bg-card"
        />
        <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <ChevronDown
          className="absolute right-2 top-2 h-3.5 w-3.5 text-muted-foreground cursor-pointer"
          onClick={() => setOpen(!open)}
        />
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover text-popover-foreground shadow-md outline-none max-h-52 overflow-y-auto">
          {filteredProducts.length === 0 ? (
            <div className="py-2.5 px-3 text-xs text-muted-foreground text-center">
              No product found.
            </div>
          ) : (
            <div className="p-1 space-y-0.5">
              {filteredProducts.map((prod) => {
                const isSelected = prod.product_id === value;
                return (
                  <button
                    key={prod.product_id}
                    type="button"
                    onClick={() => handleSelect(prod)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-sm transition-colors text-left ${
                      isSelected
                        ? "bg-accent text-accent-foreground font-medium"
                        : "hover:bg-muted/70 text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Package className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="truncate">{prod.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <span className="text-[11px] font-medium text-muted-foreground">
                        ฿{prod.price.toLocaleString()}
                      </span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
