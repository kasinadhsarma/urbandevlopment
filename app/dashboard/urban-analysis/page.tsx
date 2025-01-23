"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import dynamic from "next/dynamic"

const MapWithNoSSR = dynamic(() => import("@/components/map"), {
  ssr: false,
})

export default function UrbanAnalysis() {
  const [selectedArea, setSelectedArea] = useState("downtown")

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Urban Analysis</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>City Layout Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <MapWithNoSSR />
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Area Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger>
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="downtown">Downtown</SelectItem>
                  <SelectItem value="suburban">Suburban</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full mt-4">Analyze Selected Area</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Optimization Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5">
                <li>Increase green spaces in downtown area</li>
                <li>Optimize traffic flow on Main Street</li>
                <li>Expand public transportation in suburban areas</li>
              </ul>
              <Button className="w-full mt-4">Generate Detailed Report</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

