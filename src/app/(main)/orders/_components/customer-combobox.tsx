"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MockCustomer } from "./order-types";

interface CustomerComboboxProps {
  customers: MockCustomer[];
  value: string;
  onChange: (customerId: string) => void;
  error?: string;
}

export default function CustomerCombobox({
  customers,
  value,
  onChange,
  error,
}: CustomerComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCustomer = customers.find((c) => c.customer_id === value);

  // Sync input display when value changes externally
  useEffect(() => {
    if (selectedCustomer) {
      setQuery(selectedCustomer.name);
    } else if (!value) {
      setQuery("");
    }
  }, [value, selectedCustomer]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        // Reset query text back to selected customer name if closed without selecting
        if (selectedCustomer) {
          setQuery(selectedCustomer.name);
        } else {
          setQuery("");
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedCustomer]);

  const filteredCustomers = customers.filter((cust) =>
    cust.name.toLowerCase().includes(query.toLowerCase()) ||
    cust.customer_id.toLowerCase().includes(query.toLowerCase())
  );

  function handleSelect(cust: MockCustomer) {
    onChange(cust.customer_id);
    setQuery(cust.name);
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
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Input
          type="text"
          placeholder="Type customer name or ID..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          className="h-9 text-xs pr-8 pl-8 focus-visible:ring-1"
        />
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        <ChevronDown
          className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer"
          onClick={() => setOpen(!open)}
        />
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover text-popover-foreground shadow-md outline-none max-h-56 overflow-y-auto">
          {filteredCustomers.length === 0 ? (
            <div className="py-3 px-3 text-xs text-muted-foreground text-center">
              No customer found.
            </div>
          ) : (
            <div className="p-1 space-y-0.5">
              {filteredCustomers.map((cust) => {
                const isSelected = cust.customer_id === value;
                return (
                  <button
                    key={cust.customer_id}
                    type="button"
                    onClick={() => handleSelect(cust)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-sm transition-colors text-left ${
                      isSelected
                        ? "bg-accent text-accent-foreground font-medium"
                        : "hover:bg-muted/70 text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <div>
                        <span>{cust.name}</span>
                        <span className="ml-1.5 text-[10px] text-muted-foreground font-mono">
                          ({cust.customer_id})
                        </span>
                      </div>
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
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
