import { type NextRequest, NextResponse } from "next/server"
import { authService } from "@/lib/auth-service"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session")?.value

    if (sessionId) {
      await authService.signOut(sessionId)
    }

    // Clear session cookie
    cookieStore.delete("session")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Signout error:", error)
    return NextResponse.json({ error: "Signout failed" }, { status: 500 })
  }
}
