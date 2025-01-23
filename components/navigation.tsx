"use client"

import { useState } from "react"
import { Building2, BarChart3, Leaf, Car, Map, UserIcon, LogOut, Menu, X, FileText } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useUser } from "@/app/contexts/UserContext"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Projects", href: "/dashboard/projects", icon: Building2 },
  { name: "Urban Analysis", href: "/dashboard/urban-analysis", icon: Map },
  { name: "Sustainability", href: "/dashboard/sustainability", icon: Leaf },
  { name: "Traffic Flow", href: "/dashboard/traffic-flow", icon: Car },
  { name: "Background Developments", href: "/dashboard/background-developments", icon: FileText },
]

const skinColors = {
  light: "bg-[#FFD1B3]",
  medium: "bg-[#D2996C]",
  dark: "bg-[#8D5524]",
}

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(true)
  const { skinColor } = useUser()

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log("Logging out...")
    router.push("/auth/login")
  }

  return (
    <div className={cn("flex flex-col border-r bg-background transition-all duration-300", isOpen ? "w-64" : "w-20")}>
      <div className="p-6 flex justify-between items-center">
        <h1 className={cn("text-2xl font-bold transition-opacity", isOpen ? "opacity-100" : "opacity-0 w-0")}>
          UrbanDev AI
        </h1>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
      <nav className="flex-1 space-y-1 px-2">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                !isOpen && "justify-center",
              )}
            >
              <Icon className={cn("h-5 w-5", isOpen && "mr-3")} />
              {isOpen && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center">
          <Avatar className={skinColors[skinColor]}>
            <AvatarFallback>UD</AvatarFallback>
          </Avatar>
          {isOpen && (
            <div className="ml-3">
              <p className="text-sm font-medium">Urban Developer</p>
              <p className="text-xs text-muted-foreground">developer@urbandev.ai</p>
            </div>
          )}
        </div>
        <div className="mt-4 flex flex-col space-y-2">
          <Link href="/dashboard/profile" passHref>
            <Button variant="outline" className={cn("w-full justify-start", !isOpen && "justify-center")}>
              <UserIcon className="h-4 w-4" />
              {isOpen && <span className="ml-2">Profile</span>}
            </Button>
          </Link>
          <Button
            variant="outline"
            className={cn("w-full justify-start", !isOpen && "justify-center")}
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            {isOpen && <span className="ml-2">Log out</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}
