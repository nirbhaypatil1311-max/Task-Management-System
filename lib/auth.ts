import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import { query } from "./db"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

export interface User {
  id: number
  name: string
  email: string
  role: string
}

export interface SessionPayload {
  userId: number
  role: string
  expiresAt: Date
}

export async function createToken(userId: number, role = "user"): Promise<string> {
  const token = await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET)

  return token
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return {
      userId: payload.userId as number,
      role: payload.role as string,
      expiresAt: new Date((payload.exp || 0) * 1000),
    }
  } catch (error) {
    console.error("[v0] JWT verification failed:", error)
    return null
  }
}

export async function createSession(userId: number, role = "user"): Promise<void> {
  const token = await createToken(userId, role)
  const expiresAt = new Date(Date.now() + SESSION_DURATION)
  ;(await cookies()).set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  })
}

export async function deleteSession(): Promise<void> {
  ;(await cookies()).delete("session")
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) {
    return null
  }

  return await verifyToken(token)
}

export async function requireAuth(): Promise<User> {
  const session = await getSession()

  if (!session) {
    throw new Error("Unauthorized")
  }

  try {
    const users = await query<any[]>("SELECT id, name, email, role FROM users WHERE id = ?", [session.userId])

    if (!users || users.length === 0) {
      throw new Error("User not found")
    }

    return users[0]
  } catch (error) {
    console.error("[v0] Auth error:", error)
    throw new Error("Unauthorized")
  }
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

export function getTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }
  return authHeader.substring(7)
}

export async function requireRole(roles: string | string[]): Promise<User> {
  const user = await requireAuth()

  const allowedRoles = Array.isArray(roles) ? roles : [roles]

  if (!allowedRoles.includes(user.role)) {
    throw new Error("Forbidden: Insufficient permissions")
  }

  return user
}

export async function requireAdmin(): Promise<User> {
  return await requireRole("admin")
}

export function hasPermission(userRole: string, requiredRole: string | string[]): boolean {
  const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
  return allowedRoles.includes(userRole)
}
