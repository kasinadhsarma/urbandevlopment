"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import Link from "next/link"
import { 
  Car, 
  Leaf, 
  Building2, 
  Activity,
  BarChart3,
  TrendingUp,
  MapPin,
  Zap,
  RefreshCcw
} from "lucide-react"

interface DashboardMetrics {
  traffic: {
    congestion_level: number
    category: string
  }
  sustainability: {
    emissions_score: number
    energy_efficiency: number
  }
  urban: {
    congestion_score: number
    green_space_ratio: number
  }
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    traffic: { congestion_level: 0, category: "Loading..." },
    sustainability: { emissions_score: 0, energy_efficiency: 0 },
    urban: { congestion_score: 0, green_space_ratio: 0 }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [trafficRes, sustainabilityRes, urbanRes] = await Promise.all([
          fetch('http://localhost:8000/api/analyze-traffic', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
time_of_day: 12, // Replace with a static value or remove if not needed
day_of_week: 1, // Replace with a static value or remove if not needed
              vehicle_count: 100,
              weather_condition: 1,
              road_type: 1
            })
          }),
          fetch('http://localhost:8000/api/sustainability-metrics'),
          fetch('http://localhost:8000/api/analyze-urban-area', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ area: "downtown", include_suggestions: false })
          })
        ])

        const [trafficData, sustainabilityData, urbanData] = await Promise.all([
          trafficRes.json(),
          sustainabilityRes.json(),
          urbanRes.json()
        ])

        setMetrics({
          traffic: {
            congestion_level: trafficData.congestion_level,
            category: trafficData.congestion_category
          },
          sustainability: {
            emissions_score: sustainabilityData.emissions_score,
            energy_efficiency: sustainabilityData.energy_efficiency
          },
          urban: {
            congestion_score: urbanData.congestion_score,
            green_space_ratio: urbanData.green_space_ratio
          }
        })
        setLoading(false)
      } catch (error) {
        console.error('Error fetching metrics:', error)
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-slate-600 mt-2">Real-time urban metrics and analysis</p>
          </div>
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={() => window.location.reload()}
          >
            <RefreshCcw className="h-4 w-4" /> Refresh Data
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <MetricCard
            href="/dashboard/traffic-flow"
            title="Traffic Flow"
            icon={<Car className="h-5 w-5" />}
            loading={loading}
          >
            <div className="space-y-4">
              <MetricProgress
                label="Current Congestion"
                value={metrics.traffic.congestion_level}
                status={metrics.traffic.category}
              />
            </div>
          </MetricCard>

          <MetricCard
            href="/dashboard/sustainability"
            title="Sustainability"
            icon={<Leaf className="h-5 w-5" />}
            loading={loading}
          >
            <div className="space-y-4">
              <MetricProgress
                label="Emissions Score"
                value={metrics.sustainability.emissions_score}
              />
              <MetricProgress
                label="Energy Efficiency"
                value={metrics.sustainability.energy_efficiency}
              />
            </div>
          </MetricCard>

          <MetricCard
            href="/dashboard/urban-analysis"
            title="Urban Analysis"
            icon={<Building2 className="h-5 w-5" />}
            loading={loading}
          >
            <div className="space-y-4">
              <MetricProgress
                label="Congestion Score"
                value={metrics.urban.congestion_score}
              />
              <MetricProgress
                label="Green Space Ratio"
                value={metrics.urban.green_space_ratio}
              />
            </div>
          </MetricCard>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <CardTitle>Quick Actions</CardTitle>
              </div>
              <CardDescription>
                Frequently used tools and analysis features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <QuickActionButton
                  href="/dashboard/traffic-flow"
                  icon={<BarChart3 className="h-4 w-4" />}
                  label="Analyze Traffic"
                />
                <QuickActionButton
                  href="/dashboard/sustainability"
                  icon={<Leaf className="h-4 w-4" />}
                  label="Check Sustainability"
                />
                <QuickActionButton
                  href="/dashboard/urban-analysis"
                  icon={<MapPin className="h-4 w-4" />}
                  label="Urban Planning"
                />
                <QuickActionButton
                  href="/dashboard/predict"
                  icon={<TrendingUp className="h-4 w-4" />}
                  label="Make Predictions"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle>System Status</CardTitle>
              </div>
              <CardDescription>
                Current status of all analysis systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <StatusItem
                  label="Traffic Analysis System"
                  status="Active"
                  icon={<Car className="h-4 w-4" />}
                />
                <StatusItem
                  label="Sustainability Monitoring"
                  status="Active"
                  icon={<Leaf className="h-4 w-4" />}
                />
                <StatusItem
                  label="Urban Analysis Tools"
                  status="Active"
                  icon={<Building2 className="h-4 w-4" />}
                />
                <StatusItem
                  label="Prediction Models"
                  status="Active"
                  icon={<TrendingUp className="h-4 w-4" />}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ 
  children, 
  title, 
  icon, 
  href,
  loading 
}: { 
  children: React.ReactNode
  title: string
  icon: React.ReactNode
  href: string
  loading: boolean
}) {
  return (
    <Link href={href}>
      <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="text-primary group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
            <CardTitle className="group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <div className="h-2 bg-slate-200 rounded animate-pulse" />
              <div className="h-2 bg-slate-200 rounded animate-pulse" />
            </div>
          ) : (
            children
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

function MetricProgress({ 
  label, 
  value, 
  status 
}: { 
  label: string
  value: number
  status?: string
}) {
  const percentage = Math.round(value * 100)
  
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm text-slate-600">{label}</span>
        <span className="text-sm font-medium">{percentage}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${getProgressColorClass(percentage)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {status && (
        <p className="text-sm mt-2 text-slate-500">Status: {status}</p>
      )}
    </div>
  )
}

function QuickActionButton({ 
  href, 
  icon, 
  label 
}: { 
  href: string
  icon: React.ReactNode
  label: string
}) {
  return (
    <Button 
      asChild 
      variant="outline" 
      className="h-auto py-4 border-slate-200 hover:border-primary hover:bg-primary/5"
    >
      <Link href={href} className="flex flex-col gap-2 items-center">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </Link>
    </Button>
  )
}

function StatusItem({ 
  label, 
  status, 
  icon 
}: { 
  label: string
  status: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="text-primary">{icon}</div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-green-500" />
        <span className="text-sm text-green-500">{status}</span>
      </div>
    </div>
  )
}

function getProgressColorClass(value: number) {
  if (value >= 70) return "bg-green-500"
  if (value >= 40) return "bg-yellow-500"
  return "bg-red-500"
}
