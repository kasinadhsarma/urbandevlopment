"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts'
import { Activity, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react"

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

interface PredictionResults {
  prediction: number;
  confidence: number;
  recommendations: string[];
  hourlyData: Array<{ hour: string; traffic: number }>;
  historicalData: Array<{ date: string; predicted: number; actual: number }>;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 p-2 rounded-lg shadow-lg">
        <p className="text-gray-200">{`${label}: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

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

        const baseData = JSON.parse(storedData)
        
        // Fetch additional data from backend
        const [hourlyRes, historicalRes] = await Promise.all([
          fetch('http://localhost:8000/api/hourly-distribution'),
          fetch('http://localhost:8000/api/historical-accuracy')
        ])

        const [hourlyData, historicalData] = await Promise.all([
          hourlyRes.json(),
          historicalRes.json()
        ])

        setPredictionResults({
          ...baseData,
          hourlyData: hourlyData.data,
          historicalData: historicalData.data
        })
      } catch (error) {
        console.error('Error fetching results:', error)
        // Fallback to mock data if API fails
        setPredictionResults({
          prediction: 60,
          confidence: 0.9,
          recommendations: [
            "Schedule travel outside rush hours",
            "Use park-and-ride facilities",
            "Consider carpooling options"
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
            { date: 'Mon', predicted: 75, actual: 78 },
            { date: 'Tue', predicted: 65, actual: 62 },
            { date: 'Wed', predicted: 80, actual: 82 },
            { date: 'Thu', predicted: 70, actual: 71 },
            { date: 'Fri', predicted: 85, actual: 88 }
          ]
        })
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] p-8 flex items-center justify-center">
        <div className="flex items-center gap-2 text-blue-500">
          <Activity className="h-5 w-5 animate-spin" />
          <span>Loading prediction results...</span>
        </div>
      </div>
    )
  }

  if (!predictionResults) return null

  return (
    <div className="min-h-screen bg-[#0f172a] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
            Prediction Results
          </h1>
          <div className="flex gap-4">
            <Button variant="outline" asChild className="border-blue-500/20 hover:bg-blue-500/10">
              <Link href="/dashboard/predict">
                <ArrowLeft className="mr-2 h-4 w-4" /> New Prediction
              </Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">
                Back to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                Traffic Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Traffic Flow Prediction</span>
                  <span className="text-blue-500">{predictionResults.prediction}%</span>
                </div>
                <Progress value={predictionResults.prediction} className="h-3 bg-blue-950" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Confidence Level</span>
                  <span className="text-emerald-500">{(predictionResults.confidence * 100)}%</span>
                </div>
                <Progress value={predictionResults.confidence * 100} className="h-3 bg-emerald-950" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-500" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {predictionResults.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-300">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    {rec}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle>Hourly Traffic Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer>
                  <BarChart data={predictionResults.hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis 
                      dataKey="hour" 
                      stroke="#94a3b8" 
                      tick={{ fill: '#94a3b8' }}
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      tick={{ fill: '#94a3b8' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="traffic" 
                      fill="#3b82f6" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle>Prediction Accuracy Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer>
                  <LineChart data={predictionResults.historicalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#94a3b8" 
                      tick={{ fill: '#94a3b8' }}
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      tick={{ fill: '#94a3b8' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="predicted" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', r: 4 }}
                      name="Predicted"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: '#10b981', r: 4 }}
                      name="Actual"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
