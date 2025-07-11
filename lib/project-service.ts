// Mock project service using localStorage for development
import type { FileNode } from "@/app/page"

export interface Project {
  id: string
  user_id: string
  name: string
  description: string | null
  files: FileNode[]
  is_template: boolean
  is_public: boolean
  template_category: string | null
  template_tags: string[]
  template_difficulty: "Beginner" | "Intermediate" | "Advanced" | null
  downloads_count: number
  likes_count: number
  created_at: string
  updated_at: string
}

export class ProjectService {
  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  // Get user's projects
  getUserProjects(userId: string): Project[] {
    const projects = this.getStoredProjects()
    return projects
      .filter((p) => p.user_id === userId)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
  }

  // Get public projects
  getPublicProjects(): Project[] {
    const projects = this.getStoredProjects()
    return projects.filter((p) => p.is_public).sort((a, b) => b.downloads_count - a.downloads_count)
  }

  // Get templates
  getTemplates(): Project[] {
    const projects = this.getStoredProjects()
    return projects.filter((p) => p.is_template && p.is_public).sort((a, b) => b.downloads_count - a.downloads_count)
  }

  // Create project
  createProject(project: {
    userId: string
    name: string
    description?: string
    files: FileNode[]
    isTemplate?: boolean
    isPublic?: boolean
    templateCategory?: string
    templateTags?: string[]
    templateDifficulty?: "Beginner" | "Intermediate" | "Advanced"
  }): Project {
    const newProject: Project = {
      id: this.generateId(),
      user_id: project.userId,
      name: project.name,
      description: project.description || null,
      files: project.files,
      is_template: project.isTemplate || false,
      is_public: project.isPublic || false,
      template_category: project.templateCategory || null,
      template_tags: project.templateTags || [],
      template_difficulty: project.templateDifficulty || null,
      downloads_count: 0,
      likes_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const projects = this.getStoredProjects()
    projects.push(newProject)
    this.saveProjects(projects)

    return newProject
  }

  // Update project
  updateProject(
    projectId: string,
    updates: {
      name?: string
      description?: string
      files?: FileNode[]
      isTemplate?: boolean
      isPublic?: boolean
      templateCategory?: string
      templateTags?: string[]
      templateDifficulty?: "Beginner" | "Intermediate" | "Advanced"
    },
  ): Project {
    const projects = this.getStoredProjects()
    const projectIndex = projects.findIndex((p) => p.id === projectId)

    if (projectIndex === -1) {
      throw new Error("Project not found")
    }

    projects[projectIndex] = {
      ...projects[projectIndex],
      name: updates.name ?? projects[projectIndex].name,
      description: updates.description ?? projects[projectIndex].description,
      files: updates.files ?? projects[projectIndex].files,
      is_template: updates.isTemplate ?? projects[projectIndex].is_template,
      is_public: updates.isPublic ?? projects[projectIndex].is_public,
      template_category: updates.templateCategory ?? projects[projectIndex].template_category,
      template_tags: updates.templateTags ?? projects[projectIndex].template_tags,
      template_difficulty: updates.templateDifficulty ?? projects[projectIndex].template_difficulty,
      updated_at: new Date().toISOString(),
    }

    this.saveProjects(projects)
    return projects[projectIndex]
  }

  // Delete project
  deleteProject(projectId: string): void {
    const projects = this.getStoredProjects()
    const filteredProjects = projects.filter((p) => p.id !== projectId)
    this.saveProjects(filteredProjects)
  }

  // Get project by ID
  getProjectById(projectId: string): Project | null {
    const projects = this.getStoredProjects()
    return projects.find((p) => p.id === projectId) || null
  }

  // Increment downloads
  incrementDownloads(projectId: string): void {
    const projects = this.getStoredProjects()
    const projectIndex = projects.findIndex((p) => p.id === projectId)

    if (projectIndex !== -1) {
      projects[projectIndex].downloads_count += 1
      this.saveProjects(projects)
    }
  }

  // Toggle like
  toggleLike(userId: string, projectId: string): boolean {
    const likes = this.getStoredLikes()
    const existingLike = likes.find((l) => l.user_id === userId && l.project_id === projectId)

    if (existingLike) {
      // Unlike
      const filteredLikes = likes.filter((l) => !(l.user_id === userId && l.project_id === projectId))
      this.saveLikes(filteredLikes)

      // Decrement likes count
      const projects = this.getStoredProjects()
      const projectIndex = projects.findIndex((p) => p.id === projectId)
      if (projectIndex !== -1) {
        projects[projectIndex].likes_count -= 1
        this.saveProjects(projects)
      }

      return false
    } else {
      // Like
      likes.push({
        id: this.generateId(),
        user_id: userId,
        project_id: projectId,
        created_at: new Date().toISOString(),
      })
      this.saveLikes(likes)

      // Increment likes count
      const projects = this.getStoredProjects()
      const projectIndex = projects.findIndex((p) => p.id === projectId)
      if (projectIndex !== -1) {
        projects[projectIndex].likes_count += 1
        this.saveProjects(projects)
      }

      return true
    }
  }

  // Get user likes
  getUserLikes(userId: string): string[] {
    const likes = this.getStoredLikes()
    return likes.filter((l) => l.user_id === userId).map((l) => l.project_id)
  }

  // Get user statistics
  getUserStats(userId: string): {
    total_projects: number
    public_projects: number
    templates: number
    total_downloads: number
    total_likes: number
  } {
    const projects = this.getStoredProjects().filter((p) => p.user_id === userId)

    return {
      total_projects: projects.length,
      public_projects: projects.filter((p) => p.is_public).length,
      templates: projects.filter((p) => p.is_template).length,
      total_downloads: projects.reduce((sum, p) => sum + p.downloads_count, 0),
      total_likes: projects.reduce((sum, p) => sum + p.likes_count, 0),
    }
  }

  // Helper methods
  private getStoredProjects(): Project[] {
    try {
      return JSON.parse(localStorage.getItem("vibescode-projects") || "[]")
    } catch {
      return []
    }
  }

  private saveProjects(projects: Project[]): void {
    localStorage.setItem("vibescode-projects", JSON.stringify(projects))
  }

  private getStoredLikes(): any[] {
    try {
      return JSON.parse(localStorage.getItem("vibescode-project-likes") || "[]")
    } catch {
      return []
    }
  }

  private saveLikes(likes: any[]): void {
    localStorage.setItem("vibescode-project-likes", JSON.stringify(likes))
  }
}

export const projectService = new ProjectService()
