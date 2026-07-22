import {
  Package,
  ShoppingCart,
  Users,
  ChartNoAxesCombined,
  type LucideIcon,
} from "lucide-react";

export interface ModuleItem {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: string;
}

export type NavItem = ModuleItem;

export const modules: ModuleItem[] = [
  {
    title: "Dashboard",
    description: "Overview & Analytics",
    href: "/dashboard",
    icon: ChartNoAxesCombined,
    color: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50",
  },
  {
    title: "Products",
    description: "Inventory Management",
    href: "/products",
    icon: Package,
    color: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50",
  },
  {
    title: "Orders",
    description: "Sales & Fulfillment",
    href: "/orders",
    icon: ShoppingCart,
    color: "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-900/50",
  },
  {
    title: "Customers",
    description: "CRM & Contacts",
    href: "/customers",
    icon: Users,
    color: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/50",
  },
];

export const navItems: NavItem[] = modules;

