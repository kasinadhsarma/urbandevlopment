import { ScrollArea } from "@/components/ui/scroll-area"

const activities = [
  {
    id: 1,
    description: "Traffic congestion detected on Main Street",
    timestamp: "2 minutes ago",
    type: "alert",
  },
  {
    id: 2,
    description: "New green space proposal submitted",
    timestamp: "10 minutes ago",
    type: "info",
  },
  {
    id: 3,
    description: "Public transport route optimization completed",
    timestamp: "1 hour ago",
    type: "success",
  },
]

export function RecentActivity() {
  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center justify-between p-4 rounded-lg bg-muted">
            <div>
              <p>{activity.description}</p>
              <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
            </div>
            <div
              className={`w-2 h-2 rounded-full ${
                activity.type === "alert"
                  ? "bg-destructive"
                  : activity.type === "success"
                    ? "bg-green-500"
                    : "bg-blue-500"
              }`}
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

