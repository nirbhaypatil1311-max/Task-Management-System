"use server"

import { z } from "zod"
import { redirect } from "next/navigation"
import { query } from "@/lib/db"
import { createSession, deleteSession, hashPassword, verifyPassword } from "@/lib/auth"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function login(prevState: any, formData: FormData) {
  const validatedFields = loginSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, password } = validatedFields.data

  try {
    const users = await query<any[]>("SELECT id, password_hash FROM users WHERE email = ?", [email])

    if (!users || users.length === 0) {
      return {
        message: "Invalid email or password",
      }
    }

    const user = users[0]
    const passwordMatch = await verifyPassword(password, user.password_hash)

    if (!passwordMatch) {
      return {
        message: "Invalid email or password",
      }
    }

    await createSession(user.id)
  } catch (error) {
    console.error("[v0] Login error:", error)
    return {
      message: "Something went wrong. Please try again.",
    }
  }

  redirect("/dashboard")
}

export async function signup(prevState: any, formData: FormData) {
  const validatedFields = signupSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, email, password } = validatedFields.data

  try {
    // Check if user already exists
    const existingUsers = await query<any[]>("SELECT id FROM users WHERE email = ?", [email])

    if (existingUsers && existingUsers.length > 0) {
      return {
        errors: {
          email: ["Email already in use"],
        },
      }
    }

    const passwordHash = await hashPassword(password)

    const result = await query<any>("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)", [
      name,
      email,
      passwordHash,
    ])

    const userId = result.insertId
    await createSession(userId)
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return {
      message: "Something went wrong. Please try again.",
    }
  }

  redirect("/dashboard")
}

export async function logout() {
  await deleteSession()
  redirect("/login")
}
