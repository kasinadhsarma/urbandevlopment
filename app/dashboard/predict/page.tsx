"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Chart } from "@/components/chart"

export default function Predict() {
  const [location, setLocation] = useState("")
  const [timeframe, setTimeframe] = useState("")
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!location || !timeframe) {
      setError("Please fill in all fields.")
      return
    }
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:8000/api/predict-traffic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location, timeframe }),
      })

      if (!response.ok) {
        throw new Error('Failed to get prediction')
      }

      const data = await response.json()
      sessionStorage.setItem('prediction_result', JSON.stringify(data))
      router.push('/dashboard/result')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Traffic Prediction</h1>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Enter Prediction Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select onValueChange={setLocation} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="downtown">Downtown</SelectItem>
                      <SelectItem value="suburbs">Suburbs</SelectItem>
                      <SelectItem value="industrial-area">Industrial Area</SelectItem>
                      <SelectItem value="residential-area">Residential Area</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeframe">Timeframe</Label>
                  <Select onValueChange={setTimeframe} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-hour">1 Hour</SelectItem>
                      <SelectItem value="2-hours">2 Hours</SelectItem>
                      <SelectItem value="4-hours">4 Hours</SelectItem>
                      <SelectItem value="8-hours">8 Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? "Generating..." : "Generate Prediction"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historical Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart 
              type="line"
              data={[
                { name: 'Morning', downtown: 80, suburbs: 40, industrial: 60, residential: 45 },
                { name: 'Noon', downtown: 65, suburbs: 35, industrial: 70, residential: 30 },
                { name: 'Evening', downtown: 85, suburbs: 55, industrial: 45, residential: 65 },
                { name: 'Night', downtown: 40, suburbs: 25, industrial: 30, residential: 35 }
              ]}
              metrics={['downtown', 'suburbs', 'industrial', 'residential']}
              colors={['#ef4444', '#3b82f6', '#f59e0b', '#10b981']}
              height={250}
              title="Traffic Flow by Area (%)"
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Expected Traffic Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <Chart 
                type="area"
                data={[
                  { name: '6AM', value: 45, baseline: 40 },
                  { name: '9AM', value: 85, baseline: 75 },
                  { name: '12PM', value: 65, baseline: 60 },
                  { name: '3PM', value: 70, baseline: 65 },
                  { name: '6PM', value: 90, baseline: 80 },
                  { name: '9PM', value: 50, baseline: 45 }
                ]}
                metrics={['value', 'baseline']}
                colors={['#8b5cf6', '#94a3b8']}
                height={200}
                title="Daily Traffic Flow (%)"
              />
              <Chart 
                type="bar"
                data={[
                  { name: 'Heavy Rain', value: 40 },
                  { name: 'Light Rain', value: 60 },
                  { name: 'Clear', value: 75 },
                  { name: 'Event Day', value: 90 }
                ]}
                metrics={['value']}
                colors={['#3b82f6']}
                height={200}
                title="Impact by Conditions (%)"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
