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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysisData, setAnalysisData] = useState<{
    congestion_score: number;
    green_space_ratio: number;
    public_transport_coverage: number;
    optimization_suggestions: string[];
  } | null>(null)

  const handleAnalyze = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:8000/api/analyze-urban-area', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          area: selectedArea,
          include_suggestions: true 
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze area')
      }

      const data = await response.json()
      setAnalysisData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

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
              <Button 
                className="w-full mt-4" 
                onClick={handleAnalyze}
                disabled={isLoading}
              >
                {isLoading ? "Analyzing..." : "Analyze Selected Area"}
              </Button>
              {error && (
                <div className="mt-4 p-4 text-red-600 bg-red-50 rounded-md">
                  {error}
                </div>
              )}
              {analysisData && (
                <div className="mt-4">
                  <div className="mb-2">
                    <span className="font-semibold">Congestion Score:</span> {analysisData.congestion_score.toFixed(2)}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Green Space Ratio:</span> {(analysisData.green_space_ratio * 100).toFixed(1)}%
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Public Transport Coverage:</span> {(analysisData.public_transport_coverage * 100).toFixed(1)}%
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          {analysisData && (
            <Card>
              <CardHeader>
                <CardTitle>Optimization Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5">
                  {analysisData.optimization_suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
                <Button className="w-full mt-4">Download Detailed Report</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
