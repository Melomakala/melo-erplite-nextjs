"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Home
} from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"


const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Products",
    href: "/products",
    icon: Package,
  },
]

export function NavSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out border-r border-sidebar-border overflow-hidden",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Brand Logo Section */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border shrink-0 overflow-hidden">
        {collapsed ? (
          <button
            onClick={() => setCollapsed(false)}
            className="group relative w-10 h-10 rounded-md bg-sidebar-primary flex items-center justify-center mx-auto shadow-lg shadow-sidebar-primary/20 hover:ring-2 hover:ring-sidebar-primary/50 transition-all duration-200"
            title="Expand sidebar"
          >
            <span className="font-bold text-sidebar-primary-foreground text-sm group-hover:scale-0 transition-all duration-200">M</span>
            <ChevronRight className="absolute w-5 h-5 text-sidebar-primary-foreground scale-0 group-hover:scale-100 transition-all duration-200" />
          </button>
        ) : (
          <div className="flex items-center justify-between w-full animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-sidebar-primary flex items-center justify-center shrink-0 shadow-lg shadow-sidebar-primary/20">
                <span className="font-bold text-sidebar-primary-foreground text-sm">M</span>
              </div>
              <span className="font-bold text-lg text-sidebar-foreground truncate">
                Melo ERP
              </span>
            </div>
            <button
              onClick={() => setCollapsed(true)}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {/* Back to Launcher Button */}
        <Link
          href="/"
          className={cn(
            "flex items-center rounded-md transition-all duration-200 group relative mb-6",
            collapsed ? "justify-center h-11 w-11 mx-auto" : "gap-3 px-3 py-2.5",
            "bg-sidebar-accent/40 border border-sidebar-border/50 hover:bg-sidebar-accent hover:border-sidebar-border text-sidebar-foreground"
          )}
        >
          <LayoutGrid className="w-5 h-5 shrink-0 text-blue-400 group-hover:text-blue-300 transition-colors" />
          {!collapsed && (
            <span className="text-sm font-semibold truncate animate-in fade-in duration-300">
              Module Panel
            </span>
          )}
          {collapsed && (
            <div className="absolute left-full ml-4 px-2 py-1 bg-sidebar text-sidebar-foreground text-xs rounded border border-sidebar-border opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl hidden group-hover:block">
              Back to Panel
            </div>
          )}
        </Link>

        {!collapsed && (
          <div className="text-[10px] font-bold text-sidebar-foreground/40 uppercase tracking-widest px-3 mb-2 animate-in fade-in duration-300">
            Main Menu
          </div>
        )}

        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center transition-all duration-200 group relative rounded-md",
                collapsed ? "justify-center h-11 w-11 mx-auto" : "gap-3 px-3 py-2.5",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/10"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 shrink-0 transition-colors",
                  isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground"
                )}
              />
              {!collapsed && (
                <span className="text-sm font-medium truncate animate-in fade-in duration-300">
                  {item.title}
                </span>
              )}

              {collapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-sidebar text-sidebar-foreground text-xs rounded border border-sidebar-border opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl hidden group-hover:block">
                  {item.title}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-sidebar-border space-y-2 bg-sidebar/50">
        <ThemeToggle
          showLabel={!collapsed}
          className={cn(
            "w-full bg-transparent border-sidebar-border text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all h-11",
            collapsed ? "justify-center" : "px-3 justify-start gap-3"
          )}
        />

        <Link
          href="/login"
          className={cn(
            "flex items-center w-full transition-all duration-200 rounded-md hover:bg-destructive/10 hover:text-destructive group relative text-sidebar-foreground/60",
            collapsed ? "justify-center h-11" : "gap-3 px-3 py-2.5"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && (
            <span className="text-sm font-medium animate-in fade-in duration-300">Logout</span>
          )}
          {collapsed && (
            <div className="absolute left-full ml-4 px-2 py-1 bg-destructive text-destructive-foreground text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl hidden group-hover:block">
              Logout
            </div>
          )}
        </Link>
      </div>
    </aside>
  )
}
