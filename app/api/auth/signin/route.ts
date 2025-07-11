import { type NextRequest, NextResponse } from "next/server"
import { authService } from "@/lib/auth-service"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const { user, session } = await authService.signIn(email, password)

    // Set session cookie
    const cookieStore = cookies()
    cookieStore.set("session", session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    })

    return NextResponse.json({ user, success: true })
  } catch (error) {
    console.error("Signin error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid credentials" }, { status: 401 })
  }
}
