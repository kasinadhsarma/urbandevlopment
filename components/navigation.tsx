"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { 
  LayoutDashboard, LineChart, Lightbulb, Car, Building2,
  Menu, X, User, LogOut, Sun, Moon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { useSidebar } from "@/app/contexts/SidebarContext"

export function Navigation() {
  const pathname = usePathname()
  const { isOpen, toggle } = useSidebar()
  const { theme, setTheme } = useTheme()

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Predictions", href: "/dashboard/predict", icon: LineChart },
    { name: "Urban Analysis", href: "/dashboard/urban-analysis", icon: Building2 },
    { name: "Traffic Flow", href: "/dashboard/traffic-flow", icon: Car },
    { name: "Sustainability", href: "/dashboard/sustainability", icon: Lightbulb }
  ]

  const isLinkActive = (href: string) => 
    href === "/dashboard" ? pathname === href : pathname.startsWith(href)

  return (
    <aside className={cn(
      "fixed left-0 top-0 bottom-0 z-40",
      "bg-[#0A0A0A]",
      isOpen ? "w-64" : "w-[68px]"
    )}>
      <div className="h-16 px-4 flex items-center justify-between">
        {isOpen && <span className="text-white text-lg font-semibold">UrbanDev AI</span>}
        <Button 
          variant="ghost" 
          size="icon"
          className="text-gray-400 hover:text-white"
          onClick={toggle}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <nav className="flex flex-col gap-1 p-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
              isLinkActive(link.href)
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            )}
            title={!isOpen ? link.name : undefined}
          >
            <link.icon className="h-5 w-5 flex-shrink-0" />
            {isOpen && <span>{link.name}</span>}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-6 left-0 w-full flex flex-col gap-2 px-2">
        <Button
          variant="ghost"
          className="flex items-center gap-3 px-3 py-2 justify-start text-gray-400 hover:text-white"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title={!isOpen ? (theme === "dark" ? "Light Mode" : "Dark Mode") : undefined}
        >
          {theme === "dark" ? 
            <Sun className="h-5 w-5 flex-shrink-0" /> : 
            <Moon className="h-5 w-5 flex-shrink-0" />
          }
          {isOpen && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
        </Button>
        <Link
          href="/dashboard/profile"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
            isLinkActive("/dashboard/profile")
              ? "text-white"
              : "text-gray-400 hover:text-white"
          )}
          title={!isOpen ? "Profile" : undefined}
        >
          <User className="h-5 w-5 flex-shrink-0" />
          {isOpen && <span>Profile</span>}
        </Link>
        <Link
          href="/auth/login"
          className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-400 hover:text-white"
          title={!isOpen ? "Logout" : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {isOpen && <span>Logout</span>}
        </Link>
      </div>
    </aside>
  )
}