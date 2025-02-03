"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import dynamic from "next/dynamic"
import { Chart } from "@/components/chart"

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
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>City Layout Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="h-[400px] bg-muted rounded-lg">
                <MapWithNoSSR />
              </div>
              <div className="mt-4">
                <Chart 
                  type="bar"
                  data={[
                    { name: 'CBD', value: 85, target: 70 },
                    { name: 'Residential', value: 45, target: 40 },
                    { name: 'Industrial', value: 65, target: 60 },
                    { name: 'Waterfront', value: 35, target: 30 }
                  ]}
                  metrics={['value', 'target']}
                  colors={['#3b82f6', '#94a3b8']}
                  height={200}
                  title="Zone Activity Levels (%)"
                />
              </div>
            </div>
            <div>
              <div className="space-y-6">
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Urban Density</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">78%</div>
                    <Chart 
                      type="area"
                      data={[
                        { name: '2020', value: 65 },
                        { name: '2021', value: 70 },
                        { name: '2022', value: 72 },
                        { name: '2023', value: 75 },
                        { name: '2024', value: 78 }
                      ]}
                      metrics={['value']}
                      colors={['#8b5cf6']}
                      height={100}
                    />
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Green Space</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">32%</div>
                    <Chart 
                      type="area"
                      data={[
                        { name: '2020', value: 25 },
                        { name: '2021', value: 27 },
                        { name: '2022', value: 29 },
                        { name: '2023', value: 30 },
                        { name: '2024', value: 32 }
                      ]}
                      metrics={['value']}
                      colors={['#10b981']}
                      height={100}
                    />
                  </CardContent>
                </Card>
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Transit Access</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">85%</div>
                    <Chart 
                      type="area"
                      data={[
                        { name: '2020', value: 75 },
                        { name: '2021', value: 78 },
                        { name: '2022', value: 80 },
                        { name: '2023', value: 82 },
                        { name: '2024', value: 85 }
                      ]}
                      metrics={['value']}
                      colors={['#f59e0b']}
                      height={100}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
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
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              {analysisData && (
                <div className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Congestion Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Chart 
                          type="area"
                          data={[
                            { name: 'Current', value: analysisData.congestion_score * 10, target: 5 },
                          ]}
                          metrics={['value', 'target']}
                          colors={['#ef4444', '#10b981']}
                          height={200}
                          title="Congestion Score (0-10)"
                        />
                        <p className={`text-sm mt-2 font-medium ${
                          analysisData.congestion_score > 0.7 ? 'text-red-500' :
                          analysisData.congestion_score > 0.4 ? 'text-yellow-500' :
                          'text-green-500'
                        }`}>
                          {analysisData.congestion_score > 0.7 ? 'High Congestion' :
                           analysisData.congestion_score > 0.4 ? 'Moderate Congestion' :
                           'Low Congestion'}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Green Space Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Chart 
                          type="area"
                          data={[
                            { name: 'Current', value: analysisData.green_space_ratio * 100, target: 30 },
                          ]}
                          metrics={['value', 'target']}
                          colors={['#10b981', '#f59e0b']}
                          height={200}
                          title="Green Space Coverage (%)"
                        />
                        <p className={`text-sm mt-2 font-medium ${
                          analysisData.green_space_ratio > 0.3 ? 'text-green-500' :
                          analysisData.green_space_ratio > 0.15 ? 'text-yellow-500' :
                          'text-red-500'
                        }`}>
                          {analysisData.green_space_ratio > 0.3 ? 'Good Green Coverage' :
                           analysisData.green_space_ratio > 0.15 ? 'Moderate Coverage' :
                           'Low Coverage'}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle>Public Transport Coverage</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Chart 
                          type="line"
                          data={[
                            { name: 'Downtown', coverage: 85, demand: 90 },
                            { name: 'Residential', coverage: 65, demand: 75 },
                            { name: 'Commercial', coverage: 75, demand: 80 },
                            { name: 'Industrial', coverage: 45, demand: 50 }
                          ]}
                          metrics={['coverage', 'demand']}
                          colors={['#3b82f6', '#8b5cf6']}
                          height={250}
                          title="Transport Coverage vs Demand (%)"
                        />
                      </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle>Urban Metrics Comparison</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Chart 
                          type="bar"
                          data={[
                            { 
                              name: 'Current',
                              congestion: analysisData.congestion_score * 10,
                              green_space: analysisData.green_space_ratio * 100,
                              transport: analysisData.public_transport_coverage * 100
                            },
                            { 
                              name: 'Target',
                              congestion: 5,
                              green_space: 30,
                              transport: 80
                            }
                          ]}
                          metrics={['congestion', 'green_space', 'transport']}
                          height={250}
                          colors={['#ef4444', '#10b981', '#3b82f6']}
                          title="Current vs Target Metrics"
                        />
                      </CardContent>
                    </Card>
                  </div>
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
                </div>
              )}
            </CardContent>
          </Card>
        </div>
    </div>
  )
}
