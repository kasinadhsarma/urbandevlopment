"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/api/analyze-traffic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      setAnalysis(data)
    } catch (error) {
      console.error('Error analyzing traffic:', error)
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

      {analysis && (
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Congestion Level: {Math.round(analysis.congestion_level * 100)}%</h3>
            <Progress value={analysis.congestion_level * 100} className="w-full h-4 mt-2" />
            <p className="text-sm mt-1">Category: {analysis.congestion_category}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Feature Importance</h3>
            <div className="space-y-2 mt-2">
              {Object.entries(analysis.feature_importance).map(([feature, importance]) => (
                <div key={feature} className="flex justify-between items-center">
                  <span className="text-sm">{feature}</span>
                  <Progress value={importance * 100} className="w-1/2 h-2" />
                </div>
              ))}
            </div>
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
