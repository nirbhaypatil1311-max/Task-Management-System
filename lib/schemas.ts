import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const signUpSchema = loginSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
})

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "done", "backlog"]).default("todo"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
})

export const updateTaskSchema = taskSchema.partial()
