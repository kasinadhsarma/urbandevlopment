"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts'
import { Activity, AlertCircle, ArrowLeft, ArrowRight, TrendingUp, BadgePercent } from "lucide-react"

interface TooltipProps {
  active?: boolean
  payload?: Array<{ value: number; name?: string }>
  label?: string
}

interface PredictionResults {
  prediction: number
  confidence: number
  recommendations: string[]
  hourlyData: { hour: string; traffic: number }[]
  historicalData: { date: string; accuracy: number }[]
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3">
        <p className="font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm text-muted-foreground">
            {entry.name || 'Value'}: {entry.value.toFixed(1)}%
          </p>
        ))}
      </div>
    )
  }
  return null
}

function MetricCard({ title, value, description, icon }: { 
  title: string 
  value: number
  description?: string
  icon: React.ReactNode 
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <h3 className="font-medium text-sm text-muted-foreground">{title}</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">{value}%</span>
              {description && (
                <span className="ml-2 text-sm text-muted-foreground">{description}</span>
              )}
            </div>
          </div>
          <div className="p-2 bg-primary/10 rounded-lg">
            {icon}
          </div>
        </div>
        <Progress value={value} className="h-2" />
      </CardContent>
    </Card>
  )
}

export default function Result() {
  const router = useRouter()
  const [predictionResults, setPredictionResults] = useState<PredictionResults | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const storedData = sessionStorage.getItem('prediction_result')
        if (!storedData) {
          router.push('/dashboard/predict')
          return
        }

        // Mock data for demonstration
        setPredictionResults({
          prediction: 65,
          confidence: 0.92,
          recommendations: [
            "Schedule travel outside peak hours (7-9 AM, 4-6 PM)",
            "Consider alternate routes through residential areas",
            "Use public transportation during high congestion periods",
            "Enable real-time traffic alerts for your route"
          ],
          hourlyData: [
            { hour: '6AM', traffic: 30 },
            { hour: '9AM', traffic: 85 },
            { hour: '12PM', traffic: 65 },
            { hour: '3PM', traffic: 70 },
            { hour: '6PM', traffic: 90 },
            { hour: '9PM', traffic: 45 }
          ],
          historicalData: [
            { date: 'Mon', accuracy: 85 },
            { date: 'Tue', accuracy: 82 },
            { date: 'Wed', accuracy: 88 },
            { date: 'Thu', accuracy: 86 },
            { date: 'Fri', accuracy: 84 },
            { date: 'Sat', accuracy: 89 },
            { date: 'Sun', accuracy: 87 }
          ]
        })
      } catch (error) {
        console.error('Error fetching results:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 animate-spin" />
          <span>Loading prediction results...</span>
        </div>
      </div>
    )
  }

  if (!predictionResults) return null

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Prediction Results</h1>
          <p className="text-muted-foreground">Traffic flow analysis and recommendations</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link href="/dashboard/predict">
              <ArrowLeft className="mr-2 h-4 w-4" />
              New Prediction
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">
              Back to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <MetricCard
          title="Traffic Flow Prediction"
          value={predictionResults.prediction}
          icon={<TrendingUp className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          title="Model Confidence"
          value={predictionResults.confidence * 100}
          icon={<BadgePercent className="h-5 w-5 text-primary" />}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Hourly Traffic Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer>
                <BarChart data={predictionResults.hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="hour"
                    className="text-muted-foreground"
                  />
                  <YAxis
                    className="text-muted-foreground"
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="traffic"
                    fill="hsl(var(--chart-1))"
                    radius={[4, 4, 0, 0]}
                    name="Traffic Volume"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {predictionResults.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Prediction Accuracy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer>
              <LineChart data={predictionResults.historicalData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="date"
                  className="text-muted-foreground"
                />
                <YAxis
                  className="text-muted-foreground"
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-1))", r: 4 }}
                  name="Model Accuracy"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}