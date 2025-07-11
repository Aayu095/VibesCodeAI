import { type NextRequest, NextResponse } from "next/server"
import { authService } from "@/lib/auth-service"
import { projectService } from "@/lib/project-service"
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
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const projects = projectService.getUserProjects(result.user.id)
    return NextResponse.json({ projects })
  } catch (error) {
    console.error("Get projects error:", error)
    return NextResponse.json({ error: "Failed to get projects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session")?.value

    if (!sessionId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const result = await authService.validateSession(sessionId)
    if (!result) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const projectData = await request.json()
    const project = projectService.createProject({
      userId: result.user.id,
      ...projectData,
    })

    return NextResponse.json({ project })
  } catch (error) {
    console.error("Create project error:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
