"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  className?: string
  showLabel?: boolean
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className={cn("rounded-md h-10 w-10", className)}>
        <Sun className="h-5 w-5 opacity-50" />
      </Button>
    )
  }

  const isDark = theme === "dark"

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn("rounded-md h-10 w-10", className)}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <div className="relative h-5 w-5 flex items-center justify-center shrink-0">
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </div>
      {showLabel && (
        <span className="text-sm font-medium animate-in fade-in duration-300">
          {isDark ? "Dark Mode" : "Light Mode"}
        </span>
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
