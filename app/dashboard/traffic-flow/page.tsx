"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

function TrafficSimulation() {
  const [trafficLevel, setTrafficLevel] = useState(50)

  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficLevel((prev) => {
        const change = Math.floor(Math.random() * 11) - 5 // Random number between -5 and 5
        return Math.max(0, Math.min(100, prev + change))
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <p className="text-lg font-semibold mb-2">Current Traffic Level: {trafficLevel}%</p>
      <Progress value={trafficLevel} className="w-full h-4" />
    </div>
  )
}

export default function TrafficFlow() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Traffic Flow Analysis</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Real-time Traffic Simulation</CardTitle>
          </CardHeader>
          <CardContent>
            <TrafficSimulation />
            <Button className="mt-4">View Detailed Map</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Congestion Prediction</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Predict future traffic congestion based on historical data and current trends.</p>
            <Button className="mt-4">Run Prediction Model</Button>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Traffic Optimization Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5">
            <li>Adjust traffic light timings on Main Street during peak hours</li>
            <li>Implement smart parking systems in the downtown area</li>
            <li>Encourage carpooling and use of public transportation</li>
          </ul>
          <Button className="mt-4">Generate Detailed Suggestions</Button>
        </CardContent>
      </Card>
    </div>
  )
}

