import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function Result() {
  // TODO: Fetch actual prediction results from the backend
  const predictionResults = {
    trafficFlow: 75,
    congestionLevel: "Moderate",
    peakHours: "8:00 AM - 10:00 AM",
    recommendations: [
      "Implement smart traffic light systems",
      "Encourage use of public transportation",
      "Consider road expansion in high-traffic areas",
    ],
    historicalData: {
      labels: ["6:00 AM", "8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM"],
      data: [50, 80, 75, 60, 55, 70, 65],
    },
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
            <strong>Traffic Flow:</strong> {predictionResults.trafficFlow}%
            <Progress value={predictionResults.trafficFlow} className="h-2 mt-2" />
          </p>
          <p className="mt-4">
            <strong>Congestion Level:</strong> {predictionResults.congestionLevel}
          </p>
          <p className="mt-4">
            <strong>Peak Hours:</strong> {predictionResults.peakHours}
          </p>
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Historical Traffic Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            {predictionResults.historicalData.labels.map((label, index) => (
              <div key={index} className="text-center">
                <p>{label}</p>
                <p>{predictionResults.historicalData.data[index]}%</p>
              </div>
            ))}
          </div>
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