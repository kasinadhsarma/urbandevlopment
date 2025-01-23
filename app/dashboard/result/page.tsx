import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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
          </p>
          <p>
            <strong>Congestion Level:</strong> {predictionResults.congestionLevel}
          </p>
          <p>
            <strong>Peak Hours:</strong> {predictionResults.peakHours}
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
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <div className="flex justify-between">
        <Link href="/predict" passHref>
          <Button variant="outline">New Prediction</Button>
        </Link>
        <Link href="/dashboard" passHref>
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}

