"use client"

import * as React from "react"
import { LogOut, Loader2 } from "lucide-react"
import { type VariantProps } from "class-variance-authority"
import { Button, buttonVariants } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"

interface LogoutButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: VariantProps<typeof buttonVariants>["variant"]
  size?: VariantProps<typeof buttonVariants>["size"]
  collapsed?: boolean
  showLabel?: boolean
  className?: string
  iconClassName?: string
}

export function LogoutButton({
  variant = "ghost",
  size,
  collapsed = false,
  showLabel = true,
  className,
  iconClassName,
  onClick,
  ...props
}: LogoutButtonProps) {
  const { logout } = useAuth()
  const [isLoading, setIsLoading] = React.useState(false)

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e)
    }
    if (e.defaultPrevented) return

    try {
      setIsLoading(true)
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      disabled={isLoading}
      onClick={handleLogout}
      className={cn(
        "transition-all duration-200 group relative",
        collapsed ? "justify-center h-11 w-full" : "",
        className
      )}
      title={collapsed ? "Logout" : undefined}
      {...props}
    >
      {isLoading ? (
        <Loader2 className={cn("w-5 h-5 animate-spin shrink-0", iconClassName)} />
      ) : (
        <LogOut className={cn("w-5 h-5 shrink-0", iconClassName)} />
      )}

      {!collapsed && showLabel && (
        <span className="animate-in fade-in duration-300">
          {isLoading ? "Logging out..." : "Logout"}
        </span>
      )}

      {collapsed && (
        <div className="absolute left-full ml-4 px-2 py-1 bg-destructive text-destructive-foreground text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl hidden group-hover:block">
          Logout
        </div>
      )}
    </Button>
  )
}
