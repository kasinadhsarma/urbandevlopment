"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

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
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Traffic Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Traffic Flow Prediction:</strong> {predictionResults.prediction.toFixed(1)}%
            <Progress value={predictionResults.prediction} className="h-2 mt-2" />
          </p>
          <p className="mt-4">
            <strong>Confidence Level:</strong> {(predictionResults.confidence * 100).toFixed(1)}%
          </p>
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5">
            {predictionResults.recommendations.map((rec, index) => (
              <li key={index} className="mb-2">{rec}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
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
