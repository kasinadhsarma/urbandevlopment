"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Clock, ArrowRight, Activity } from "lucide-react"

export default function Predict() {
  const [location, setLocation] = useState("")
  const [timeframe, setTimeframe] = useState("")
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:8000/api/predict-traffic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, timeframe }),
      })

      if (!response.ok) throw new Error('Failed to get prediction')

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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500 mb-4">
            Traffic Prediction
          </h1>
          <p className="text-gray-400">Get accurate traffic forecasts using our AI-powered prediction model</p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <span>Prediction Parameters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    Location
                  </Label>
                  <Select onValueChange={setLocation} required>
                    <SelectTrigger className="bg-gray-800/50 border-gray-700">
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
                  <Label className="text-gray-300 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    Timeframe
                  </Label>
                  <Select onValueChange={setTimeframe} required>
                    <SelectTrigger className="bg-gray-800/50 border-gray-700">
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
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 transition-colors group"
              >
                {isLoading ? "Generating Prediction..." : (
                  <span className="flex items-center justify-center gap-2">
                    Generate Prediction
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Real-time Data", description: "Live traffic information" },
            { title: "AI-Powered", description: "Machine learning predictions" },
            { title: "High Accuracy", description: "95% prediction accuracy" }
          ].map((feature, index) => (
            <Card key={index} className="bg-gray-800/50 border-gray-700">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-gray-200 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}