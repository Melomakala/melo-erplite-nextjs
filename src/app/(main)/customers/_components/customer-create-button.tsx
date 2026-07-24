"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CustomerCreateButtonProps {
  onClick?: () => void;
}

export default function CustomerCreateButton({ onClick }: CustomerCreateButtonProps) {
  return (
    <Button variant="default" onClick={onClick} className="gap-1.5">
      <Plus className="h-4 w-4" />
      Create Customer
    </Button>
  );
}
