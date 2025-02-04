"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Trees, Bus, Download, Activity, MapPin } from "lucide-react"
import dynamic from "next/dynamic"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  TooltipProps
} from 'recharts'

// Dynamic import for the Map component
const Map = dynamic(
  () => import("@/components/map"),
  { 
    loading: () => (
      <div className="flex items-center justify-center h-full bg-muted">
        <Activity className="h-8 w-8 animate-spin" />
      </div>
    ),
    ssr: false
  }
)

interface HistoricalDataPoint {
  date: string
  congestion: number
  green_space: number
  public_transport: number
}

interface AnalysisData {
  congestion_score: number
  green_space_ratio: number
  public_transport_coverage: number
  optimization_suggestions: string[]
  historical_data: HistoricalDataPoint[]
}

interface MetricCardProps {
  title: string
  value: number
  icon: React.ReactNode
  description: string
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  payload?: Array<{
    name: string
    value: number
    color: string
  }>
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) {
    return null
  }

  return (
    <div className="bg-background border rounded-lg shadow-lg p-3">
      <p className="font-medium">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-sm text-muted-foreground">
          {entry.name}: {entry.value.toFixed(1)}%
        </p>
      ))}
    </div>
  )
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, description }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            {icon}
          </div>
          <span className="text-3xl font-bold">{value}%</span>
        </div>
        <h3 className="font-medium mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

const mockHistoricalData: HistoricalDataPoint[] = [
  { date: "Jan", congestion: 65, green_space: 40, public_transport: 75 },
  { date: "Feb", congestion: 58, green_space: 42, public_transport: 78 },
  { date: "Mar", congestion: 70, green_space: 45, public_transport: 72 },
  { date: "Apr", congestion: 63, green_space: 48, public_transport: 77 },
  { date: "May", congestion: 55, green_space: 52, public_transport: 80 },
  { date: "Jun", congestion: 68, green_space: 55, public_transport: 82 }
]

export default function UrbanAnalysis() {
  const [selectedArea, setSelectedArea] = useState("downtown")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [chartData, setChartData] = useState<HistoricalDataPoint[]>(mockHistoricalData)

  useEffect(() => {
    // Initialize with mock data for testing
    setAnalysisData({
      congestion_score: 75,
      green_space_ratio: 0.45,
      public_transport_coverage: 0.82,
      optimization_suggestions: [
        "Optimize traffic signal timing in high congestion areas",
        "Increase green space coverage in downtown area",
        "Expand public transport routes to suburban regions"
      ],
      historical_data: mockHistoricalData
    })
  }, [])

  const handleAnalyze = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('http://localhost:8000/api/analyze-urban-area', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ area: selectedArea, include_suggestions: true }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze area')
      }

      const data = await response.json()
      setAnalysisData(data as AnalysisData)
      // Transform historical_data (object) into an array for charting
      const daysOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      const transformedChartData = daysOrder.map(day => {
        let total = 0, count = 0;
        Object.entries(data.historical_data).forEach(([timestamp, accuracy]) => {
          if (timestamp.startsWith(day)) {
            total += (accuracy as number) * 100;
            count++;
          }
        });
        return {
          date: day,
          congestion: count ? total / count : 0,
          green_space: 45,  // default value
          public_transport: 75  // default value
        };
      });
      setChartData(transformedChartData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Urban Analysis</h1>
          <p className="text-muted-foreground">Analyze and optimize urban infrastructure</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedArea} onValueChange={setSelectedArea}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="downtown">Downtown</SelectItem>
              <SelectItem value="suburban">Suburban</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAnalyze} disabled={isLoading}>
            {isLoading ? (
              <>
                <Activity className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-4 w-4" />
                Analyze Area
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg border border-destructive/20">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Area Map View
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] rounded-lg overflow-hidden border">
                <Map />
              </div>
            </CardContent>
          </Card>

          {analysisData && (
            <div className="grid md:grid-cols-3 gap-4">
              <MetricCard
                title="Congestion Level"
                value={Math.round(analysisData.congestion_score)}
                icon={<Building2 className="h-5 w-5 text-primary" />}
                description="Current traffic density"
              />
              <MetricCard
                title="Green Space"
                value={Math.round(analysisData.green_space_ratio * 100)}
                icon={<Trees className="h-5 w-5 text-primary" />}
                description="Available green areas"
              />
              <MetricCard
                title="Public Transport"
                value={Math.round(analysisData.public_transport_coverage * 100)}
                icon={<Bus className="h-5 w-5 text-primary" />}
                description="Transit coverage"
              />
            </div>
          )}
        </div>

        {analysisData && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Optimization Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysisData.optimization_suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                      <span className="text-sm">{suggestion}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full mt-6">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Historical Trends</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="text-muted-foreground/20" />
                      <XAxis 
                        dataKey="date"
                        className="text-muted-foreground"
                      />
                      <YAxis
                        className="text-muted-foreground"
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar 
                        dataKey="congestion" 
                        name="Congestion" 
                        fill="hsl(var(--chart-1))"
                      />
                      <Bar 
                        dataKey="green_space" 
                        name="Green Space" 
                        fill="hsl(var(--chart-2))"
                      />
                      <Bar 
                        dataKey="public_transport" 
                        name="Public Transport" 
                        fill="hsl(var(--chart-3))"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}