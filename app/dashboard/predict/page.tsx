"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Predict() {
  const [location, setLocation] = useState("")
  const [timeframe, setTimeframe] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual prediction logic
    console.log("Prediction requested for", { location, timeframe })
    router.push("/dashboard/result")
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Traffic Prediction</h1>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Enter Prediction Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
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
              <div className="flex flex-col space-y-1.5">
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
            </div>
            <Button className="w-full mt-4" type="submit">
              Generate Prediction
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}