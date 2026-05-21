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
        "flex flex-col bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out border-r border-slate-800",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Brand Logo Section */}
      <div className="h-16 flex items-center px-4 border-b border-slate-800 shrink-0 overflow-hidden">
        <div className={cn("flex items-center gap-3 transition-all", collapsed && "justify-center w-full ml-0")}>
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/20">
            <span className="font-bold text-white text-sm">M</span>
          </div>
          {!collapsed && (
            <span className="font-bold text-lg text-white truncate animate-in fade-in duration-500">
              Melo ERP
            </span>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
        {/* Back to Launcher Button */}
        <Link
          href="/"
          className={cn(
            "flex items-center rounded-xl transition-all duration-200 group relative mb-6",
            collapsed ? "justify-center h-11 w-11 mx-auto" : "gap-3 px-3 py-2.5",
            "bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 text-slate-200"
          )}
        >
          <LayoutGrid className="w-5 h-5 shrink-0 text-blue-400 group-hover:text-blue-300 transition-colors" />
          {!collapsed && (
            <span className="text-sm font-semibold truncate animate-in fade-in duration-300">
              Module Panel
            </span>
          )}
          {collapsed && (
            <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded border border-slate-700 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
              Back to Panel
            </div>
          )}
        </Link>

        <div className={cn("text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2 transition-opacity", collapsed ? "opacity-0 h-0" : "opacity-100")}>
          Main Menu
        </div>

        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center transition-all duration-200 group relative rounded-xl",
                collapsed ? "justify-center h-11 w-11 mx-auto" : "gap-3 px-3 py-2.5",
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                  : "hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 shrink-0 transition-colors",
                  isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                )}
              />
              {!collapsed && (
                <span className="text-sm font-medium truncate animate-in fade-in duration-300">
                  {item.title}
                </span>
              )}
              
              {collapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded border border-slate-700 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
                  {item.title}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-900/50">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex items-center w-full transition-all duration-200 rounded-xl hover:bg-slate-800 group relative",
            collapsed ? "justify-center h-11" : "gap-3 px-3 py-2.5"
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-200" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-slate-200" />
              <span className="text-sm font-medium animate-in fade-in duration-300">Collapse</span>
            </>
          )}
        </button>

        <Link
          href="/login"
          className={cn(
            "flex items-center w-full transition-all duration-200 rounded-xl hover:bg-red-500/10 hover:text-red-400 group relative text-slate-400",
            collapsed ? "justify-center h-11" : "gap-3 px-3 py-2.5"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && (
            <span className="text-sm font-medium animate-in fade-in duration-300">Logout</span>
          )}
          {collapsed && (
            <div className="absolute left-full ml-4 px-2 py-1 bg-red-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
              Logout
            </div>
          )}
        </Link>
      </div>
    </aside>
  )
}

