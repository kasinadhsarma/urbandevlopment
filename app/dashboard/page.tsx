"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import Link from "next/link"

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
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-8">Dashboard Overview</h1>
      
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Link href="/dashboard/traffic-flow" className="block">
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>Traffic Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Current Congestion</span>
                    <span>{Math.round(metrics.traffic.congestion_level * 100)}%</span>
                  </div>
                  <Progress value={metrics.traffic.congestion_level * 100} className="h-2" />
                  <p className="text-sm mt-2">Status: {metrics.traffic.category}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/sustainability" className="block">
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>Sustainability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Emissions Score</span>
                    <span>{Math.round(metrics.sustainability.emissions_score * 100)}%</span>
                  </div>
                  <Progress value={metrics.sustainability.emissions_score * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Energy Efficiency</span>
                    <span>{Math.round(metrics.sustainability.energy_efficiency * 100)}%</span>
                  </div>
                  <Progress value={metrics.sustainability.energy_efficiency * 100} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/urban-analysis" className="block">
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>Urban Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Congestion Score</span>
                    <span>{Math.round(metrics.urban.congestion_score * 100)}%</span>
                  </div>
                  <Progress value={metrics.urban.congestion_score * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Green Space Ratio</span>
                    <span>{Math.round(metrics.urban.green_space_ratio * 100)}%</span>
                  </div>
                  <Progress value={metrics.urban.green_space_ratio * 100} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button asChild className="w-full">
                <Link href="/dashboard/traffic-flow">Analyze Traffic</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/dashboard/sustainability">Check Sustainability</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/dashboard/urban-analysis">Urban Planning</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/dashboard/predict">Make Predictions</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Traffic Analysis System</span>
                <span className="text-green-500">Active</span>
              </li>
              <li className="flex justify-between">
                <span>Sustainability Monitoring</span>
                <span className="text-green-500">Active</span>
              </li>
              <li className="flex justify-between">
                <span>Urban Analysis Tools</span>
                <span className="text-green-500">Active</span>
              </li>
              <li className="flex justify-between">
                <span>Prediction Models</span>
                <span className="text-green-500">Active</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
