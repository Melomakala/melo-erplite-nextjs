"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCreateButtonProps {
  onClick?: () => void;
}

export default function ProductCreateButton({ onClick }: ProductCreateButtonProps) {
  return (
    <Button variant="default" onClick={onClick} className="gap-1.5">
      <Plus className="h-4 w-4" />
      Create Product
    </Button>
  );
}
