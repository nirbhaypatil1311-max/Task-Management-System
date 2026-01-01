import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { requireAuth } from "@/lib/auth"
import { taskSchema } from "@/lib/schemas"

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(request.url)

    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const offset = (page - 1) * limit

    let sql = "SELECT * FROM tasks WHERE user_id = ?"
    const params: any[] = [user.id]

    if (status) {
      sql += " AND status = ?"
      params.push(status)
    }

    if (priority) {
      sql += " AND priority = ?"
      params.push(priority)
    }

    sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
    params.push(limit, offset)

    const tasks = await query<any[]>(sql, params)

    let countSql = "SELECT COUNT(*) as total FROM tasks WHERE user_id = ?"
    const countParams: any[] = [user.id]

    if (status) {
      countSql += " AND status = ?"
      countParams.push(status)
    }

    if (priority) {
      countSql += " AND priority = ?"
      countParams.push(priority)
    }

    const [countResult] = await query<any[]>(countSql, countParams)
    const total = countResult?.total || 0

    return NextResponse.json(
      {
        tasks,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("[v0] Get tasks API error:", error)
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()

    const validatedFields = taskSchema.safeParse(body)

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validatedFields.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    const { title, description, priority, status, dueDate } = validatedFields.data

    const result = await query<any>(
      "INSERT INTO tasks (title, description, priority, status, due_date, user_id) VALUES (?, ?, ?, ?, ?, ?)",
      [title, description || null, priority, status, dueDate || null, user.id],
    )

    await query("INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)", [
      user.id,
      "Created",
      "task",
      result.insertId,
      `Created new task: ${title}`,
    ])

    const [newTask] = await query<any[]>("SELECT * FROM tasks WHERE id = ?", [result.insertId])

    return NextResponse.json(
      {
        message: "Task created successfully",
        task: newTask,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("[v0] Create task API error:", error)
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
