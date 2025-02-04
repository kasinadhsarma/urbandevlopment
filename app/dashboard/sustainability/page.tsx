"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { Leaf, Wind, TreePine, RefreshCcw, Download, TrendingUp, Activity } from "lucide-react"

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
  historical_data: Array<{
    month: string
    emissions: number
    energy: number
    green_space: number
  }>
}

interface MetricCardProps {
  title: string
  value: number
  trend?: string
  icon: React.ReactNode
  description: string
  onClick: () => void
}

const mockHistoricalData = [
  { month: 'Jan', emissions: 65, energy: 70, green_space: 45 },
  { month: 'Feb', emissions: 68, energy: 72, green_space: 48 },
  { month: 'Mar', emissions: 72, energy: 75, green_space: 52 },
  { month: 'Apr', emissions: 75, energy: 78, green_space: 55 },
  { month: 'May', emissions: 78, energy: 80, green_space: 58 },
  { month: 'Jun', emissions: 82, energy: 83, green_space: 62 }
]

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3">
        <p className="font-medium mb-2">{label}</p>
        {payload.map((entry: { name: string; value: number }, index: number) => (
          <p key={index} className="text-sm text-muted-foreground">
            {entry.name}: {entry.value.toFixed(1)}%
          </p>
        ))}
      </div>
    )
  }
  return null
}

function MetricCard({ title, value, trend, icon, description, onClick }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold">{value.toFixed(1)}%</p>
              {trend && (
                <span className={`text-sm ${trend === 'Improving' ? 'text-green-500' : trend === 'Declining' ? 'text-red-500' : 'text-yellow-500'}`}>
                  {trend}
                </span>
              )}
            </div>
          </div>
          <div className="p-2 bg-primary/10 rounded-lg">
            {icon}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <Progress value={value} className="h-2" />
        <Button variant="outline" className="w-full mt-4" onClick={onClick}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Update
        </Button>
      </CardContent>
    </Card>
  )
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
      // For demo, using mock data
      setMetrics({
        emissions_score: 0.75,
        energy_efficiency: 0.82,
        green_infrastructure: 0.45,
        public_transport_usage: 0.68,
        walking_cycling_score: 0.58,
        trend_analysis: {
          emissions: { direction: 'Improving', rate: 0.05 },
          energy: { direction: 'Improving', rate: 0.03 },
          green_infra: { direction: 'Stable', rate: 0 }
        },
        historical_data: mockHistoricalData
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-[200px]">
          <Activity className="h-8 w-8 animate-spin text-primary" />
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
            <Button variant="outline" className="ml-4" onClick={fetchSustainabilityMetrics}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!metrics) return null

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Sustainability Metrics</h1>
        <p className="text-muted-foreground">Monitor and analyze environmental impact and sustainability initiatives</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              title="Carbon Footprint"
              value={metrics.emissions_score * 100}
              trend={metrics.trend_analysis.emissions.direction}
              icon={<Leaf className="h-5 w-5 text-primary" />}
              description="Measuring total greenhouse gas emissions per capita"
              onClick={fetchSustainabilityMetrics}
            />
            <MetricCard
              title="Renewable Energy"
              value={metrics.energy_efficiency * 100}
              trend={metrics.trend_analysis.energy.direction}
              icon={<Wind className="h-5 w-5 text-primary" />}
              description="Percentage of energy from renewable sources"
              onClick={fetchSustainabilityMetrics}
            />
            <MetricCard
              title="Green Infrastructure"
              value={metrics.green_infrastructure * 100}
              trend={metrics.trend_analysis.green_infra.direction}
              icon={<TreePine className="h-5 w-5 text-primary" />}
              description="Green space coverage and ecological corridors"
              onClick={fetchSustainabilityMetrics}
            />
          </div>
        </TabsContent>

        <TabsContent value="details">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Environmental Performance Metrics</CardTitle>
                <CardDescription>Detailed breakdown of sustainability indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer>
                    <BarChart data={metrics.historical_data}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" className="text-muted-foreground" />
                      <YAxis className="text-muted-foreground" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="emissions" name="Emissions" fill="hsl(var(--chart-1))" />
                      <Bar dataKey="energy" name="Energy Efficiency" fill="hsl(var(--chart-2))" />
                      <Bar dataKey="green_space" name="Green Space" fill="hsl(var(--chart-3))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sustainability Trends</CardTitle>
                <CardDescription>Monthly progression of key metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer>
                    <LineChart data={metrics.historical_data}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" className="text-muted-foreground" />
                      <YAxis className="text-muted-foreground" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="emissions" 
                        name="Emissions"
                        stroke="hsl(var(--chart-1))" 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="energy" 
                        name="Energy Efficiency"
                        stroke="hsl(var(--chart-2))" 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="green_space" 
                        name="Green Space"
                        stroke="hsl(var(--chart-3))" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
              <Button>
                <TrendingUp className="mr-2 h-4 w-4" />
                View Full Analysis
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}