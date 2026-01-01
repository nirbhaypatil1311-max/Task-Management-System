import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckSquare, Clock, AlertCircle, BarChart3 } from "lucide-react"
import { getDashboardStats } from "@/app/actions/tasks"
import { formatDistanceToNow } from "date-fns"

export default async function DashboardPage() {
  const { stats: dbStats, recentActivity } = await getDashboardStats()

  const stats = [
    {
      title: "Total Tasks",
      value: dbStats.total_tasks.toString(),
      description: "Lifetime tasks",
      icon: CheckSquare,
      color: "text-blue-500",
    },
    {
      title: "In Progress",
      value: dbStats.in_progress_tasks.toString(),
      description: "Currently active",
      icon: Clock,
      color: "text-orange-500",
    },
    {
      title: "High Priority",
      value: dbStats.high_priority_tasks.toString(),
      description: "Needs attention",
      icon: AlertCircle,
      color: "text-red-500",
    },
    {
      title: "Completed",
      value: dbStats.completed_tasks.toString(),
      description: "Total completed",
      icon: BarChart3,
      color: "text-green-500",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Real-time updates from your task manager.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4">
                    <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                      <CheckSquare className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{activity.details}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.created_at))} ago
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No recent activity found.</p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>3 tasks are due in the next 24 hours.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-1 border-l-2 border-red-500 pl-4 py-1">
                  <p className="text-sm font-semibold">Fix production hydration error</p>
                  <p className="text-xs text-muted-foreground">Due at 5:00 PM</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
