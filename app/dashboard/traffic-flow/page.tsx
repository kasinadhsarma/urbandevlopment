"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Chart } from "@/components/chart"

interface TrafficAnalysis {
  congestion_level: number
  feature_importance: { [key: string]: number }
  congestion_category: string
}

function TrafficAnalysisForm() {
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<TrafficAnalysis | null>(null)
  const [formData, setFormData] = useState({
    time_of_day: 12,
    day_of_week: 1,
    vehicle_count: 100,
    weather_condition: 1,
    road_type: 1
  })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!formData.time_of_day || !formData.day_of_week || !formData.vehicle_count || !formData.weather_condition || !formData.road_type) {
      setError("Please fill in all fields.")
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await fetch('http://localhost:8000/api/analyze-traffic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!response.ok) {
        throw new Error('Failed to analyze traffic')
      }
      const data = await response.json()
      setAnalysis(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    }
    setLoading(false)
  }

  const weatherConditions = [
    { value: 1, label: "Clear" },
    { value: 2, label: "Rain" },
    { value: 3, label: "Snow" },
    { value: 4, label: "Fog" }
  ]

  const roadTypes = [
    { value: 1, label: "Highway" },
    { value: 2, label: "Main Street" },
    { value: 3, label: "Residential" },
    { value: 4, label: "Downtown" }
  ]

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Time of Day (0-23)</Label>
          <Input
            type="number"
            min={0}
            max={23}
            value={formData.time_of_day}
            onChange={(e) => setFormData({...formData, time_of_day: parseInt(e.target.value)})}
          />
        </div>
        <div className="space-y-2">
          <Label>Day of Week (1-7)</Label>
          <Input
            type="number"
            min={1}
            max={7}
            value={formData.day_of_week}
            onChange={(e) => setFormData({...formData, day_of_week: parseInt(e.target.value)})}
          />
        </div>
        <div className="space-y-2">
          <Label>Vehicle Count</Label>
          <Input
            type="number"
            value={formData.vehicle_count}
            onChange={(e) => setFormData({...formData, vehicle_count: parseInt(e.target.value)})}
          />
        </div>
        <div className="space-y-2">
          <Label>Weather Condition</Label>
          <Select 
            value={formData.weather_condition.toString()}
            onValueChange={(value) => setFormData({...formData, weather_condition: parseInt(value)})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {weatherConditions.map((condition) => (
                <SelectItem key={condition.value} value={condition.value.toString()}>
                  {condition.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Road Type</Label>
          <Select 
            value={formData.road_type.toString()}
            onValueChange={(value) => setFormData({...formData, road_type: parseInt(value)})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roadTypes.map((type) => (
                <SelectItem key={type.value} value={type.value.toString()}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Traffic"}
      </Button>

      {loading && (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
          <div className="container py-8">
            <h1 className="text-4xl font-bold text-slate-900">Loading...</h1>
          </div>
        </div>
      )}

      {analysis && (
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Congestion Level: {Math.round(analysis.congestion_level * 100)}%</h3>
            <Progress value={analysis.congestion_level * 100} className="w-full h-4 mt-2" />
            <p className="text-sm mt-1">Category: {analysis.congestion_category}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Congestion Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Current Congestion Level</h3>
                    <Chart 
                      type="area"
                      data={[{ 
                        name: 'Current', 
                        value: analysis.congestion_level * 100,
                        threshold: 75,
                        target: 50
                      }]}
                      metrics={['value', 'threshold', 'target']}
                      height={200}
                      colors={['#ef4444', '#f59e0b', '#10b981']}
                      title="Congestion Level (%)"
                    />
                  </div>
                  <div>
                    <p className="text-sm mt-2 font-medium">
                      Status: <span className={`${
                        analysis.congestion_level > 0.75 ? 'text-red-500' :
                        analysis.congestion_level > 0.5 ? 'text-yellow-500' :
                        'text-green-500'
                      }`}>
                        {analysis.congestion_category}
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feature Impact Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart 
                  type="bar"
                  data={Object.entries(analysis.feature_importance).map(([feature, importance]) => ({
                    name: feature.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                    value: importance * 100
                  }))}
                  metrics={['value']}
                  height={300}
                  colors={['#8b5cf6']}
                  title="Feature Importance (%)"
                />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Traffic Pattern Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart 
                  type="line"
                  data={[
                    { name: 'Morning', congestion: 65, volume: 80 },
                    { name: 'Noon', congestion: 45, volume: 60 },
                    { name: 'Evening', congestion: 85, volume: 90 },
                    { name: 'Night', congestion: 30, volume: 40 }
                  ]}
                  metrics={['congestion', 'volume']}
                  height={300}
                  colors={['#ef4444', '#3b82f6']}
                  title="Daily Traffic Pattern"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

export default function TrafficFlow() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Traffic Flow Analysis</h1>
      <Card>
        <CardHeader>
          <CardTitle>Traffic Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <TrafficAnalysisForm />
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Traffic Optimization Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5">
            <li>Optimize signal timing based on current congestion levels</li>
            <li>Implement dynamic lane management during peak hours</li>
            <li>Consider road capacity improvements in high congestion areas</li>
            <li>Deploy smart parking solutions to reduce search traffic</li>
            <li>Encourage alternate routes during predicted high congestion periods</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
