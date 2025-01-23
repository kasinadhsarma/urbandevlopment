"use client"

import { Navigation } from "@/components/navigation"
import { SidebarProvider, useSidebar } from "@/app/contexts/SidebarContext"

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar()
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navigation />
      <div className={`transition-all duration-300 ease-in-out ${
        isOpen ? "md:pl-64" : "md:pl-20"
      }`}>
        <main className="container mx-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  )
}
