"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Chart } from "@/components/chart"

interface SustainabilityMetrics {
  emissions_score: number
  energy_efficiency: number
  green_infrastructure: number
  public_transport_usage: number
  walking_cycling_score: number
  trend_analysis: {
    [key: string]: {
      direction: string
      rate: number
    }
  }
}

export default function Sustainability() {
  const [metrics, setMetrics] = useState<SustainabilityMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSustainabilityMetrics()
  }, [])

  const fetchSustainabilityMetrics = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('http://localhost:8000/api/sustainability-metrics')
      if (!response.ok) {
        throw new Error('Failed to fetch sustainability metrics')
      }
      const data = await response.json()
      setMetrics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching sustainability metrics:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchSustainabilityMetrics()
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-4xl font-bold mb-8">Sustainability Metrics</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <AlertDescription>
            {error}
            <Button variant="outline" className="ml-4" onClick={handleRefresh} disabled={loading}>
              {loading ? "Refreshing..." : "Retry"}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!metrics) {
    return null
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Sustainability Metrics</h1>
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Detailed Metrics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Carbon Footprint</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{(100 - metrics.emissions_score * 100).toFixed(1)} tons CO2e per capita</p>
                <Progress value={metrics.emissions_score * 100} className="mt-2" />
                <p className="text-sm mt-2 text-muted-foreground">
                  Trend: {metrics.trend_analysis.emissions?.direction || 'Stable'}
                </p>
                <Button className="mt-4" onClick={handleRefresh} disabled={loading}>
                  {loading ? "Refreshing..." : "Refresh Data"}
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Green Space Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{(metrics.green_infrastructure * 100).toFixed(1)}% of total city area</p>
                <Progress value={metrics.green_infrastructure * 100} className="mt-2" />
                <p className="text-sm mt-2 text-muted-foreground">
                  Trend: {metrics.trend_analysis.green_infra?.direction || 'Stable'}
                </p>
                <Button className="mt-4" onClick={handleRefresh} disabled={loading}>
                  {loading ? "Refreshing..." : "Refresh Data"}
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Renewable Energy Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{(metrics.energy_efficiency * 100).toFixed(1)}% efficiency score</p>
                <Progress value={metrics.energy_efficiency * 100} className="mt-2" />
                <p className="text-sm mt-2 text-muted-foreground">
                  Trend: {metrics.trend_analysis.energy?.direction || 'Stable'}
                </p>
                <Button className="mt-4" onClick={handleRefresh} disabled={loading}>
                  {loading ? "Refreshing..." : "Refresh Data"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Emissions & Energy</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart 
                  type="line"
                  data={[
                    { name: 'Jan', emissions: metrics.emissions_score * 100, energy: metrics.energy_efficiency * 100 },
                    { name: 'Feb', emissions: 75, energy: 82 },
                    { name: 'Mar', emissions: 82, energy: 85 },
                    { name: 'Apr', emissions: 85, energy: 88 },
                    { name: 'May', emissions: 88, energy: 90 },
                    { name: 'Jun', emissions: metrics.emissions_score * 100, energy: metrics.energy_efficiency * 100 }
                  ]}
                  metrics={['emissions', 'energy']}
                  colors={['#ef4444', '#f59e0b']}
                  height={300}
                  title="6-Month Trend (%)"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Green Infrastructure</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart 
                  type="area"
                  data={[
                    { name: 'Parks', value: 35 },
                    { name: 'Urban Forest', value: 25 },
                    { name: 'Green Roofs', value: 15 },
                    { name: 'Gardens', value: 25 }
                  ]}
                  metrics={['value']}
                  colors={['#10b981']}
                  height={300}
                  title="Distribution (%)"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transport Sustainability</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart 
                  type="bar"
                  data={[
                    { 
                      name: 'Current Usage',
                      public_transport: metrics.public_transport_usage * 100,
                      walking_cycling: metrics.walking_cycling_score * 100
                    },
                    { 
                      name: 'Target',
                      public_transport: 80,
                      walking_cycling: 70
                    }
                  ]}
                  metrics={['public_transport', 'walking_cycling']}
                  colors={['#3b82f6', '#8b5cf6']}
                  height={300}
                  title="Transport Metrics vs Targets (%)"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Overall Sustainability Score</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart 
                  type="area"
                  data={[
                    { 
                      name: 'Score',
                      current: (
                        metrics.emissions_score * 100 +
                        metrics.energy_efficiency * 100 +
                        metrics.green_infrastructure * 100 +
                        metrics.public_transport_usage * 100 +
                        metrics.walking_cycling_score * 100
                      ) / 5,
                      target: 80
                    }
                  ]}
                  metrics={['current', 'target']}
                  colors={['#10b981', '#f59e0b']}
                  height={300}
                  title="Overall Performance (%)"
                />
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Key Recommendations:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Increase renewable energy adoption</li>
                    <li>Expand green infrastructure</li>
                    <li>Improve public transport connectivity</li>
                    <li>Promote cycling infrastructure</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
