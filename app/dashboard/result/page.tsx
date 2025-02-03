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
            <CardTitle>Predicted Traffic Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart 
              type="area"
              data={[
                { 
                  name: 'Current', 
                  value: predictionResults.prediction,
                  threshold: 75,
                  baseline: 50
                }
              ]}
              metrics={['value', 'threshold', 'baseline']}
              colors={['#ef4444', '#f59e0b', '#10b981']}
              height={200}
              title="Traffic Flow Level (%)"
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
            <CardTitle>Prediction Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart 
              type="area"
              data={[
                { 
                  name: 'Confidence', 
                  value: predictionResults.confidence * 100,
                  threshold: 90
                }
              ]}
              metrics={['value', 'threshold']}
              colors={['#8b5cf6', '#f59e0b']}
              height={200}
              title="Model Confidence (%)"
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

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Time-based Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart 
              type="line"
              data={[
                { name: 'Previous', flow: 45, confidence: 92 },
                { name: 'Current', flow: predictionResults.prediction, confidence: predictionResults.confidence * 100 },
                { name: 'Projected', flow: predictionResults.prediction * 1.1, confidence: 85 }
              ]}
              metrics={['flow', 'confidence']}
              colors={['#ef4444', '#8b5cf6']}
              height={300}
              title="Traffic Flow & Confidence Trend"
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Impact Analysis & Recommendations</CardTitle>
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
                  title="Impact Scores"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
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
