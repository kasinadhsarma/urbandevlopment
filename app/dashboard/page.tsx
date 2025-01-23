"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
import { Building2, Users, BarChart3, Leaf } from "lucide-react"

const Chart = dynamic(() => import("../../components/chart"), { ssr: false })

const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 200 },
  { name: "Apr", value: 278 },
  { name: "May", value: 189 },
  { name: "Jun", value: 239 },
]

export default function Dashboard() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Urban Development Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          icon={<Building2 className="h-8 w-8" />}
          title="Building Projects"
          value="24"
          link="/dashboard/projects"
        />
        <DashboardCard
          icon={<Users className="h-8 w-8" />}
          title="Population Density"
          value="1,250/km²"
          link="/dashboard/urban-analysis"
        />
        <DashboardCard
          icon={<BarChart3 className="h-8 w-8" />}
          title="Traffic Flow"
          value="85%"
          link="/dashboard/traffic-flow"
        />
        <DashboardCard
          icon={<Leaf className="h-8 w-8" />}
          title="Green Spaces"
          value="18%"
          link="/dashboard/sustainability"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Development Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Chart data={data} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button className="w-full" variant="outline" asChild>
                <Link href="/dashboard/predict">New Prediction</Link>
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/dashboard/urban-analysis">Analyze Layout</Link>
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/dashboard/sustainability">Sustainability Check</Link>
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/dashboard/traffic-flow">Traffic Analysis</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface DashboardCardProps {
  icon: React.ReactNode
  title: string
  value: string
  link: string
}

function DashboardCard({ icon, title, value, link }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <Link href={link} className="text-sm text-muted-foreground hover:underline">
          View details
        </Link>
      </CardContent>
    </Card>
  )
}
