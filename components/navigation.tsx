"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { 
  LayoutDashboard, 
  LineChart, 
  Lightbulb, 
  Car, 
  Building2,
  Menu, 
  X, 
  User, 
  LogOut, 
  Sun, 
  Moon, 
  ChevronRight,
  BarChart3,
  TrendingUp,
  MapPin,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { useSidebar } from "@/app/contexts/SidebarContext"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navigation() {
  const pathname = usePathname()
  const { isOpen, toggle } = useSidebar()
  const { theme, setTheme } = useTheme()

  const navigationGroups = [
    {
      title: "Main",
      links: [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Predictions", href: "/dashboard/predict", icon: LineChart },
      ]
    },
    {
      title: "Analysis",
      links: [
        { name: "Urban Analysis", href: "/dashboard/urban-analysis", icon: Building2 },
        { name: "Traffic Flow", href: "/dashboard/traffic-flow", icon: Car },
      ]
    },
    {
      title: "Sustainability",
      links: [
        { name: "Sustainability", href: "/dashboard/sustainability", icon: Lightbulb },
      ]
    },
    {
      title: "Quick Actions",
      links: [
        { name: "Analyze Traffic", href: "/dashboard/traffic-flow", icon: BarChart3 },
        { name: "Check Sustainability", href: "/dashboard/sustainability", icon: Lightbulb },
        { name: "Urban Planning", href: "/dashboard/urban-analysis", icon: MapPin },
        { name: "Make Predictions", href: "/dashboard/predict", icon: TrendingUp },
      ]
    },
    {
      title: "System Status",
      links: [
        { name: "Traffic Analysis System", href: "/dashboard/traffic-flow", icon: Car },
        { name: "Sustainability Monitoring", href: "/dashboard/sustainability", icon: Lightbulb },
        { name: "Urban Analysis Tools", href: "/dashboard/urban-analysis", icon: Building2 },
        { name: "Prediction Models", href: "/dashboard/predict", icon: TrendingUp },
      ]
    }
  ]

  const isLinkActive = (href: string) => 
    href === "/dashboard" ? pathname === href : pathname.startsWith(href)

  return (
    <aside className={cn(
      "fixed left-0 top-0 bottom-0 z-40 flex flex-col",
      "bg-gradient-to-b from-gray-900 to-black border-r border-gray-800",
      "transition-all duration-300 ease-in-out",
      isOpen ? "w-64" : "w-[68px]"
    )}>
      {/* Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-2">
          {isOpen && (
            <span className="text-white text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              UrbanDev AI
            </span>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-gray-400 hover:text-white hover:bg-gray-800/50"
          onClick={toggle}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-6">
          {navigationGroups.map((group, index) => (
            <div key={index} className="px-3">
              {isOpen && (
                <h3 className="mb-2 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {group.title}
                </h3>
              )}
              <div className="space-y-1">
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "group flex items-center gap-x-3 px-3 py-2 rounded-lg transition-all duration-200",
                      "hover:bg-gray-800/50 relative overflow-hidden",
                      isLinkActive(link.href)
                        ? "text-white bg-gray-800"
                        : "text-gray-400 hover:text-white"
                    )}
                    title={!isOpen ? link.name : undefined}
                  >
                    <link.icon className={cn(
                      "h-5 w-5 flex-shrink-0 transition-transform duration-200",
                      isLinkActive(link.href) && "text-primary"
                    )} />
                    {isOpen && (
                      <span className="flex-1">{link.name}</span>
                    )}
                    {isOpen && isLinkActive(link.href) && (
                      <ChevronRight className="h-4 w-4 text-primary" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Footer Actions */}
      <div className="border-t border-gray-800 p-4 space-y-2">
        <Button
          variant="ghost"
          className={cn(
            "w-full flex items-center gap-x-3 justify-start",
            "text-gray-400 hover:text-white hover:bg-gray-800/50",
            "transition-colors duration-200"
          )}
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
            "flex items-center gap-x-3 px-3 py-2 rounded-lg",
            "transition-colors duration-200",
            isLinkActive("/dashboard/profile")
              ? "text-white bg-gray-800"
              : "text-gray-400 hover:text-white hover:bg-gray-800/50"
          )}
          title={!isOpen ? "Profile" : undefined}
        >
          <User className="h-5 w-5 flex-shrink-0" />
          {isOpen && <span>Profile</span>}
        </Link>
        
<Link
  href="/auth/login"
  className={cn(
    "flex items-center gap-x-3 px-3 py-2 rounded-lg",
    "text-gray-400 hover:text-white hover:bg-gray-800/50",
    "transition-colors duration-200"
  )}
  title={!isOpen ? "Logout" : undefined}
>
  <LogOut className="h-5 w-5 flex-shrink-0" />
  {isOpen && <span>Logout</span>}
</Link>

<div className="absolute bottom-6 left-0 w-full flex flex-col gap-2 px-2">
  <ThemeToggle />
  {/* ... other bottom items ... */}
</div>
      </div>
    </aside>
  )
}
