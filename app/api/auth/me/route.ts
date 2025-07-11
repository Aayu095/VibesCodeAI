import { type NextRequest, NextResponse } from "next/server"
import { authService } from "@/lib/auth-service"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session")?.value

    if (!sessionId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const result = await authService.validateSession(sessionId)

    if (!result) {
      // Clear invalid session cookie
      cookieStore.delete("session")
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    return NextResponse.json({ user: result.user })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "Authentication check failed" }, { status: 500 })
  }
}
