import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { requireAuth } from "@/lib/auth"
import { updateTaskSchema } from "@/lib/schemas"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth()
    const { id } = await params

    const tasks = await query<any[]>("SELECT * FROM tasks WHERE id = ? AND user_id = ?", [id, user.id])

    if (!tasks || tasks.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ task: tasks[0] }, { status: 200 })
  } catch (error: any) {
    console.error("[v0] Get task API error:", error)
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth()
    const { id } = await params
    const body = await request.json()

    const tasks = await query<any[]>("SELECT * FROM tasks WHERE id = ? AND user_id = ?", [id, user.id])

    if (!tasks || tasks.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const validatedFields = updateTaskSchema.safeParse(body)

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validatedFields.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    const updates = validatedFields.data
    const updateFields: string[] = []
    const updateValues: any[] = []

    if (updates.title !== undefined) {
      updateFields.push("title = ?")
      updateValues.push(updates.title)
    }
    if (updates.description !== undefined) {
      updateFields.push("description = ?")
      updateValues.push(updates.description)
    }
    if (updates.priority !== undefined) {
      updateFields.push("priority = ?")
      updateValues.push(updates.priority)
    }
    if (updates.status !== undefined) {
      updateFields.push("status = ?")
      updateValues.push(updates.status)
    }
    if (updates.dueDate !== undefined) {
      updateFields.push("due_date = ?")
      updateValues.push(updates.dueDate)
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    updateValues.push(id, user.id)

    await query(`UPDATE tasks SET ${updateFields.join(", ")} WHERE id = ? AND user_id = ?`, updateValues)

    await query("INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)", [
      user.id,
      "Updated",
      "task",
      id,
      `Updated task fields: ${Object.keys(updates).join(", ")}`,
    ])

    const [updatedTask] = await query<any[]>("SELECT * FROM tasks WHERE id = ?", [id])

    return NextResponse.json(
      {
        message: "Task updated successfully",
        task: updatedTask,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("[v0] Update task API error:", error)
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth()
    const { id } = await params

    const tasks = await query<any[]>("SELECT * FROM tasks WHERE id = ? AND user_id = ?", [id, user.id])

    if (!tasks || tasks.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    await query("DELETE FROM tasks WHERE id = ? AND user_id = ?", [id, user.id])

    await query("INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)", [
      user.id,
      "Deleted",
      "task",
      id,
      `Deleted task: ${tasks[0].title}`,
    ])

    return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 })
  } catch (error: any) {
    console.error("[v0] Delete task API error:", error)
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
