"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import Link from "next/link"
import { BarChart3, Leaf, Building2, ArrowRight, Activity, AlertTriangle } from "lucide-react"

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

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [trafficRes, sustainabilityRes, urbanRes] = await Promise.all([
          fetch('http://localhost:8000/api/analyze-traffic', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              time_of_day: new Date().getHours(),
              day_of_week: new Date().getDay() + 1,
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
      } catch (error) {
        console.error('Error fetching metrics:', error)
      }
    }

    fetchMetrics()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">
            Dashboard Overview
          </h1>
          <Button variant="outline" className="border-blue-500/20 hover:bg-blue-500/10">
            Refresh Data <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <MetricCard
            href="/dashboard/traffic-flow"
            title="Traffic Flow"
            icon={<Activity className="h-6 w-6 text-blue-500" />}
            metrics={[
              {
                label: "Current Congestion",
                value: metrics.traffic.congestion_level * 100,
                status: metrics.traffic.category,
                color: "bg-blue-500"
              }
            ]}
          />

          <MetricCard
            href="/dashboard/sustainability"
            title="Sustainability"
            icon={<Leaf className="h-6 w-6 text-emerald-500" />}
            metrics={[
              {
                label: "Emissions Score",
                value: metrics.sustainability.emissions_score * 100,
                color: "bg-emerald-500"
              },
              {
                label: "Energy Efficiency",
                value: metrics.sustainability.energy_efficiency * 100,
                color: "bg-emerald-500"
              }
            ]}
          />

          <MetricCard
            href="/dashboard/urban-analysis"
            title="Urban Analysis"
            icon={<Building2 className="h-6 w-6 text-violet-500" />}
            metrics={[
              {
                label: "Congestion Score",
                value: metrics.urban.congestion_score * 100,
                color: "bg-violet-500"
              },
              {
                label: "Green Space Ratio",
                value: metrics.urban.green_space_ratio * 100,
                color: "bg-violet-500"
              }
            ]}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <ActionButton href="/dashboard/traffic-flow" label="Analyze Traffic" />
                <ActionButton href="/dashboard/sustainability" label="Check Sustainability" />
                <ActionButton href="/dashboard/urban-analysis" label="Urban Planning" />
                <ActionButton href="/dashboard/predict" label="Make Predictions" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">System Status</CardTitle>
              <AlertTriangle className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <StatusItem label="Traffic Analysis System" />
                <StatusItem label="Sustainability Monitoring" />
                <StatusItem label="Urban Analysis Tools" />
                <StatusItem label="Prediction Models" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

interface MetricCardProps {
  href: string
  title: string
  icon: React.ReactNode
  metrics: {
    label: string
    value: number
    status?: string
    color: string
  }[]
}

function MetricCard({ href, title, icon, metrics }: MetricCardProps) {
  return (
    <Link href={href}>
      <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/80 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent className="space-y-4">
          {metrics.map((metric, i) => (
            <div key={i}>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">{metric.label}</span>
                <span>{Math.round(metric.value)}%</span>
              </div>
              <Progress value={metric.value} className={`h-2 ${metric.color}`} />
              {metric.status && (
                <p className="text-sm mt-2 text-gray-400">Status: {metric.status}</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </Link>
  )
}

function ActionButton({ href, label }: { href: string; label: string }) {
  return (
    <Button 
      asChild 
      variant="outline" 
      className="border-gray-700 hover:border-blue-500/50 hover:bg-blue-500/10"
    >
      <Link href={href}>{label}</Link>
    </Button>
  )
}

function StatusItem({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-400">{label}</span>
      <span className="flex items-center text-emerald-500">
        <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2" />
        Active
      </span>
    </div>
  )
}