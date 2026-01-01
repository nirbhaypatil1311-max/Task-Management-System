"use server"

import { revalidateTag } from "next/cache"
import { query } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export async function getTasks() {
  const user = await requireAuth()

  try {
    const tasks = await query("SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC", [user.id])
    return tasks
  } catch (error) {
    console.error("[v0] Get tasks error:", error)
    return []
  }
}

export async function createTask(formData: FormData) {
  const user = await requireAuth()

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const priority = (formData.get("priority") as string) || "medium"
  const dueDate = (formData.get("dueDate") as string) || null

  try {
    await query("INSERT INTO tasks (title, description, priority, due_date, user_id) VALUES (?, ?, ?, ?, ?)", [
      title,
      description,
      priority,
      dueDate,
      user.id,
    ])

    await query("INSERT INTO activity_logs (user_id, action, entity_type, details) VALUES (?, ?, ?, ?)", [
      user.id,
      "Created",
      "task",
      `Created new task: ${title}`,
    ])

    revalidateTag("tasks", "max")
    return { success: true }
  } catch (error) {
    console.error("[v0] Create task error:", error)
    return { error: "Failed to create task" }
  }
}

export async function updateTaskStatus(taskId: number, status: string) {
  const user = await requireAuth()

  try {
    await query("UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?", [status, taskId, user.id])

    await query("INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)", [
      user.id,
      "Updated",
      "task",
      taskId,
      `Changed status to ${status}`,
    ])

    revalidateTag("tasks", "max")
    return { success: true }
  } catch (error) {
    console.error("[v0] Update task error:", error)
    return { error: "Failed to update task" }
  }
}

export async function deleteTask(taskId: number) {
  const user = await requireAuth()

  try {
    await query("DELETE FROM tasks WHERE id = ? AND user_id = ?", [taskId, user.id])

    revalidateTag("tasks", "max")
    return { success: true }
  } catch (error) {
    console.error("[v0] Delete task error:", error)
    return { error: "Failed to delete task" }
  }
}

export async function getDashboardStats() {
  const user = await requireAuth()

  try {
    const [stats] = await query<any[]>(
      `SELECT 
        COUNT(*) as total_tasks,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
        SUM(CASE WHEN status = 'in-progress' THEN 1 ELSE 0 END) as in_progress_tasks,
        SUM(CASE WHEN priority = 'high' AND status != 'completed' THEN 1 ELSE 0 END) as high_priority_tasks
      FROM tasks WHERE user_id = ?`,
      [user.id],
    )

    const recentActivity = await query<any[]>(
      "SELECT * FROM activity_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 5",
      [user.id],
    )

    return {
      stats: stats || { total_tasks: 0, completed_tasks: 0, in_progress_tasks: 0, high_priority_tasks: 0 },
      recentActivity: recentActivity || [],
    }
  } catch (error) {
    console.error("[v0] Get dashboard stats error:", error)
    return {
      stats: { total_tasks: 0, completed_tasks: 0, in_progress_tasks: 0, high_priority_tasks: 0 },
      recentActivity: [],
    }
  }
}
