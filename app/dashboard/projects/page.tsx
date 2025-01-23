import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const projects = [
  { name: "Downtown Revitalization", progress: 75, status: "On Track" },
  { name: "Green Park Extension", progress: 40, status: "Delayed" },
  { name: "Smart Traffic System", progress: 90, status: "Ahead of Schedule" },
  { name: "Sustainable Housing Complex", progress: 60, status: "On Track" },
]

export default function Projects() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Urban Development Projects</h1>
        <Button>New Project</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="mb-4" />
              <div className="flex justify-between items-center">
                <span
                  className={`text-sm font-medium ${
                    project.status === "On Track"
                      ? "text-green-500"
                      : project.status === "Delayed"
                        ? "text-red-500"
                        : "text-blue-500"
                  }`}
                >
                  {project.status}
                </span>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

