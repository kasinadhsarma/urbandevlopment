"use client"

import { ThemeToggle } from "@/components/theme-toggle"

export default function ClientHeader() {
  return (
    <header className="w-full flex items-center justify-end p-4 border-b border-gray-200 dark:border-gray-800">
      <ThemeToggle />
    </header>
  )
}
