"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Chart } from "@/components/chart"

export default function Result() {
  const router = useRouter()
  const [predictionResults, setPredictionResults] = useState<{
    prediction: number;
    confidence: number;
    recommendations: string[];
    historical_data: Array<{timestamp: string; value: number}>;
    forecast_data: Array<{timeframe: string; prediction: number}>;
    impact_factors: Record<string, number>;
  } | null>(null)

  useEffect(() => {
    const storedData = sessionStorage.getItem('prediction_result')
    if (!storedData) {
      router.push('/dashboard/predict')
      return
    }
    setPredictionResults(JSON.parse(storedData))
  }, [router])

  if (!predictionResults) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Loading prediction results...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Prediction Results</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Historical Traffic Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart 
              type="line"
              data={[
                ...predictionResults.historical_data.map(item => ({
                  name: new Date(item.timestamp).toLocaleDateString(),
                  value: item.value
                })),
                {
                  name: 'Current',
                  value: predictionResults.prediction
                }
              ]}
              metrics={['value']}
              colors={['#3b82f6']}
              height={200}
              title="Traffic Flow Trend (%)"
            />
            <p className={`text-sm mt-4 font-medium ${
              predictionResults.prediction > 75 ? 'text-red-500' :
              predictionResults.prediction > 50 ? 'text-yellow-500' :
              'text-green-500'
            }`}>
              {predictionResults.prediction > 75 ? 'High Traffic Expected' :
               predictionResults.prediction > 50 ? 'Moderate Traffic Expected' :
               'Low Traffic Expected'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Forecast Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart 
              type="area"
              data={predictionResults.forecast_data.map(item => ({
                name: item.timeframe,
                prediction: item.prediction,
                baseline: predictionResults.prediction
              }))}
              metrics={['prediction', 'baseline']}
              colors={['#8b5cf6', '#94a3b8']}
              height={200}
              title="Traffic Forecast (%)"
            />
            <p className="text-sm mt-4 text-muted-foreground">
              Showing predicted traffic levels for different timeframes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Model Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart 
              type="area"
              data={[
                { 
                  name: 'Current', 
                  value: predictionResults.confidence * 100,
                  threshold: 90
                }
              ]}
              metrics={['value', 'threshold']}
              colors={['#10b981', '#f59e0b']}
              height={200}
              title="Prediction Confidence (%)"
            />
            <p className={`text-sm mt-4 font-medium ${
              predictionResults.confidence > 0.9 ? 'text-green-500' :
              predictionResults.confidence > 0.7 ? 'text-yellow-500' :
              'text-red-500'
            }`}>
              {predictionResults.confidence > 0.9 ? 'High Confidence Prediction' :
               predictionResults.confidence > 0.7 ? 'Moderate Confidence' :
               'Low Confidence - Consider Additional Factors'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Impact Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart 
              type="bar"
              data={Object.entries(predictionResults.impact_factors).map(([factor, value]) => ({
                name: factor.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                value: value * 100
              }))}
              metrics={['value']}
              colors={['#ef4444']}
              height={200}
              title="Factor Influence (%)"
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recommendations & Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Key Impacts</h3>
                <Chart 
                  type="bar"
                  data={[
                    { name: 'Travel Time', value: 75 },
                    { name: 'Congestion', value: predictionResults.prediction },
                    { name: 'Emergency Response', value: 65 },
                    { name: 'Public Transit', value: 70 }
                  ]}
                  metrics={['value']}
                  colors={['#3b82f6']}
                  height={200}
                  title="Impact Assessment"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Recommended Actions</h3>
                <ul className="space-y-3">
                  {predictionResults.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-sm mr-3 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="flex-1">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between">
        <Link href="/dashboard/predict" passHref>
          <Button variant="outline">New Prediction</Button>
        </Link>
        <Link href="/dashboard" passHref>
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
