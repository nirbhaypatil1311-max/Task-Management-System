import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()

    const [stats] = await query<any[]>(
      `SELECT 
        COUNT(*) as total_tasks,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
        SUM(CASE WHEN status = 'in-progress' THEN 1 ELSE 0 END) as in_progress_tasks,
        SUM(CASE WHEN status = 'todo' THEN 1 ELSE 0 END) as todo_tasks,
        SUM(CASE WHEN priority = 'high' AND status != 'completed' THEN 1 ELSE 0 END) as high_priority_tasks,
        SUM(CASE WHEN due_date < NOW() AND status != 'completed' THEN 1 ELSE 0 END) as overdue_tasks
      FROM tasks WHERE user_id = ?`,
      [user.id],
    )

    const recentActivity = await query<any[]>(
      "SELECT * FROM activity_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 10",
      [user.id],
    )

    return NextResponse.json(
      {
        stats: stats || {
          total_tasks: 0,
          completed_tasks: 0,
          in_progress_tasks: 0,
          todo_tasks: 0,
          high_priority_tasks: 0,
          overdue_tasks: 0,
        },
        recentActivity: recentActivity || [],
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("[v0] Get task stats API error:", error)
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
