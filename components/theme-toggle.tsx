"use client"
import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  // Skeleton only during mounting to prevent hydration errors
  if (!mounted) return <Button variant="ghost" size="icon" className="w-9 h-9" />

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative w-9 h-9 overflow-hidden"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <Sun className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-out ${isDark ? "translate-y-[-150%] rotate-[110deg] opacity-0" : "translate-y-0 rotate-0 opacity-100"}`} />
      <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-out ${isDark ? "translate-y-0 rotate-0 opacity-100" : "translate-y-[150%] rotate-[-110deg] opacity-0"}`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
