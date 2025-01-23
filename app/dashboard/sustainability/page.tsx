"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Sustainability() {
  const [carbonFootprint, setCarbonFootprint] = useState(15.2)
  const [greenSpaceCoverage, setGreenSpaceCoverage] = useState(18)
  const [renewableEnergy, setRenewableEnergy] = useState(30)

  const handleImprovement = (metric: string) => {
    switch (metric) {
      case "carbon":
        setCarbonFootprint((prev) => Math.max(0, prev - 0.5))
        break
      case "green":
        setGreenSpaceCoverage((prev) => Math.min(100, prev + 1))
        break
      case "energy":
        setRenewableEnergy((prev) => Math.min(100, prev + 2))
        break
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Sustainability Metrics</h1>
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Detailed Metrics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Carbon Footprint</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{carbonFootprint.toFixed(1)} tons CO2e per capita</p>
                <Progress value={100 - (carbonFootprint / 20) * 100} className="mt-2" />
                <Button className="mt-4" onClick={() => handleImprovement("carbon")}>
                  Implement Reduction Strategies
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Green Space Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{greenSpaceCoverage}% of total city area</p>
                <Progress value={greenSpaceCoverage} className="mt-2" />
                <Button className="mt-4" onClick={() => handleImprovement("green")}>
                  Expand Green Spaces
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Renewable Energy Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{renewableEnergy}% of total energy consumption</p>
                <Progress value={renewableEnergy} className="mt-2" />
                <Button className="mt-4" onClick={() => handleImprovement("energy")}>
                  Increase Renewable Sources
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Sustainability Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This section would contain more detailed sustainability metrics and analysis.</p>
              <Button className="mt-4">Generate Comprehensive Report</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

