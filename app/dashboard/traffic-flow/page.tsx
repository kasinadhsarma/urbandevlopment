"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, Calendar, Car, Cloud, Map, Activity, LineChart, BarChart3 } from "lucide-react"

interface TrafficAnalysis {
  congestion_level: number
  feature_importance: { [key: string]: number }
  congestion_category: string
  hourly_distribution: { [key: number]: number }
  historical_accuracy: { [key: string]: number }
}

function TrafficAnalysisForm() {
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<TrafficAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    time_of_day: 12,
    day_of_week: 1,
    vehicle_count: 100,
    weather_condition: 1,
    road_type: 1
  })

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/analyze-traffic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!response.ok) {
        throw new Error('Traffic analysis failed. Please try again later.')
      }
      const data = await response.json()
      setAnalysis(data)
    } catch (error) {
      console.error('Error analyzing traffic:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
      setAnalysis(null)
    }
    setLoading(false)
  }

  const weatherConditions = [
    { value: 1, label: "Clear", icon: <Cloud className="h-4 w-4" /> },
    { value: 2, label: "Rain", icon: <Cloud className="h-4 w-4" /> },
    { value: 3, label: "Snow", icon: <Cloud className="h-4 w-4" /> },
    { value: 4, label: "Fog", icon: <Cloud className="h-4 w-4" /> }
  ]

  const roadTypes = [
    { value: 1, label: "Highway", icon: <Map className="h-4 w-4" /> },
    { value: 2, label: "Main Street", icon: <Map className="h-4 w-4" /> },
    { value: 3, label: "Residential", icon: <Map className="h-4 w-4" /> },
    { value: 4, label: "Downtown", icon: <Map className="h-4 w-4" /> }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-blue-500" />
              <Label className="text-gray-200">Time of Day</Label>
            </div>
            <Input
              type="number"
              min={0}
              max={23}
              value={formData.time_of_day}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, time_of_day: parseInt(e.target.value)})}
              className="bg-gray-700/50 border-gray-600"
            />
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-blue-500" />
              <Label className="text-gray-200">Day of Week</Label>
            </div>
            <Input
              type="number"
              min={1}
              max={7}
              value={formData.day_of_week}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, day_of_week: parseInt(e.target.value)})}
              className="bg-gray-700/50 border-gray-600"
            />
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Car className="h-5 w-5 text-blue-500" />
              <Label className="text-gray-200">Vehicle Count</Label>
            </div>
            <Input
              type="number"
              value={formData.vehicle_count}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, vehicle_count: parseInt(e.target.value)})}
              className="bg-gray-700/50 border-gray-600"
            />
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Cloud className="h-5 w-5 text-blue-500" />
              <Label className="text-gray-200">Weather</Label>
            </div>
            <Select
              value={formData.weather_condition.toString()}
              onValueChange={(value: string) => setFormData({...formData, weather_condition: parseInt(value)})}>
              <SelectTrigger className="bg-gray-700/50 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {weatherConditions.map((condition) => (
                  <SelectItem key={condition.value} value={condition.value.toString()}>
                    <div className="flex items-center gap-2">
                      {condition.icon}
                      {condition.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Map className="h-5 w-5 text-blue-500" />
              <Label className="text-gray-200">Road Type</Label>
            </div>
            <Select
              value={formData.road_type.toString()}
              onValueChange={(value: string) => setFormData({...formData, road_type: parseInt(value)})}>
              <SelectTrigger className="bg-gray-700/50 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roadTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value.toString()}>
                    <div className="flex items-center gap-2">
                      {type.icon}
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-md">
            {error}
          </div>
        )}
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          {loading ? (
            <>
              <Activity className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <LineChart className="h-4 w-4 mr-2" />
              Analyze Traffic
            </>
          )}
        </Button>
      </div>

      {analysis && (
        <div className="grid gap-6 mt-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-200 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                Traffic Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Congestion Level</span>
                    <span className="text-blue-500">{Math.round(analysis.congestion_level * 100)}%</span>
                  </div>
                  <Progress
                    value={analysis.congestion_level * 100}
                    className="h-3 bg-blue-950"
                  />
                  <p className="text-sm mt-2 text-gray-400">Category: {analysis.congestion_category}</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-gray-200 font-semibold">Feature Importance</h4>
                  {analysis.feature_importance && Object.entries(analysis.feature_importance).map(([feature, importance]) => (
                    <div key={feature}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">{feature}</span>
                        <span className="text-blue-500">{Math.round(importance * 100)}%</span>
                      </div>
                      <Progress value={importance * 100} className="h-2 bg-blue-950" />
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="text-gray-200 font-semibold">Hourly Distribution</h4>
                  {analysis.hourly_distribution && Object.entries(analysis.hourly_distribution).map(([hour, volume]) => (
                    <div key={hour}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">{hour}:00</span>
                        <span className="text-blue-500">{Math.round(volume * 100)}%</span>
                      </div>
                      <Progress value={volume * 100} className="h-2 bg-blue-950" />
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="text-gray-200 font-semibold">Historical Accuracy</h4>
                  {analysis.historical_accuracy && Object.entries(analysis.historical_accuracy).map(([timestamp, accuracy]) => (
                    <div key={timestamp}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">{timestamp}</span>
                        <span className="text-blue-500">{Math.round(accuracy * 100)}%</span>
                      </div>
                      <Progress value={accuracy * 100} className="h-2 bg-blue-950" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default function TrafficFlow() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">
          Traffic Flow Analysis
        </h1>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-6">
            <TrafficAnalysisForm />
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-200">Optimization Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                "Optimize signal timing based on current congestion levels",
                "Implement dynamic lane management during peak hours",
                "Consider road capacity improvements in high congestion areas",
                "Deploy smart parking solutions to reduce search traffic",
                "Encourage alternate routes during predicted high congestion periods"
              ].map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-300">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                  {suggestion}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
