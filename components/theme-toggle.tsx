"use client"

import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        className="flex items-center gap-3 px-3 py-2 justify-start text-gray-400 hover:text-white"
      >
        <div className="h-5 w-5 flex-shrink-0" />
        <span>Theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      className="flex items-center gap-3 px-3 py-2 justify-start text-gray-400 hover:text-white"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 flex-shrink-0" />
      ) : (
        <Moon className="h-5 w-5 flex-shrink-0" />
      )}
      <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
    </Button>
  )
}
