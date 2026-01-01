import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyPassword, createSession } from "@/lib/auth"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = loginSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json({ error: "Invalid input", details: validated.error.format() }, { status: 400 })
    }

    const { email, password } = validated.data
    const users = await query<any[]>("SELECT id, password_hash, role FROM users WHERE email = ?", [email])

    if (!users || users.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const user = users[0]
    const isValid = await verifyPassword(password, user.password_hash)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    await createSession(user.id, user.role)

    return NextResponse.json({ message: "Login successful" })
  } catch (error) {
    console.error("[v0] API Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
