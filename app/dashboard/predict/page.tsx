"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

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
                <Input
                  id="location"
                  placeholder="Enter location (e.g., coordinates)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="timeframe">Timeframe</Label>
                <Input
                  id="timeframe"
                  placeholder="Enter timeframe (e.g., 2 hours)"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  required
                />
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

