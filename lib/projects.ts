import { supabase } from "./supabase"
import type { Database } from "./database.types"
import type { FileNode } from "@/app/page"

type Project = Database["public"]["Tables"]["projects"]["Row"]
type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"]
type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"]

export const projectService = {
  // Get user's projects
  async getUserProjects(userId: string) {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })

    if (error) throw error
    return data
  },

  // Get public projects (templates)
  async getPublicProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_public", true)
      .order("downloads_count", { ascending: false })

    if (error) throw error
    return data
  },

  // Get templates
  async getTemplates() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_template", true)
      .eq("is_public", true)
      .order("downloads_count", { ascending: false })

    if (error) throw error
    return data
  },

  // Create project
  async createProject(project: {
    userId: string
    name: string
    description?: string
    files: FileNode[]
    isTemplate?: boolean
    isPublic?: boolean
    templateCategory?: string
    templateTags?: string[]
    templateDifficulty?: "Beginner" | "Intermediate" | "Advanced"
  }) {
    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: project.userId,
        name: project.name,
        description: project.description,
        files: project.files,
        is_template: project.isTemplate || false,
        is_public: project.isPublic || false,
        template_category: project.templateCategory,
        template_tags: project.templateTags || [],
        template_difficulty: project.templateDifficulty,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update project
  async updateProject(
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
  ) {
    const { data, error } = await supabase
      .from("projects")
      .update({
        name: updates.name,
        description: updates.description,
        files: updates.files,
        is_template: updates.isTemplate,
        is_public: updates.isPublic,
        template_category: updates.templateCategory,
        template_tags: updates.templateTags,
        template_difficulty: updates.templateDifficulty,
      })
      .eq("id", projectId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete project
  async deleteProject(projectId: string) {
    const { error } = await supabase.from("projects").delete().eq("id", projectId)

    if (error) throw error
  },

  // Increment download count
  async incrementDownloads(projectId: string) {
    const { error } = await supabase.rpc("increment_downloads", {
      project_id: projectId,
    })

    if (error) throw error
  },

  // Like/unlike project
  async toggleLike(userId: string, projectId: string) {
    // Check if already liked
    const { data: existingLike } = await supabase
      .from("project_likes")
      .select("id")
      .eq("user_id", userId)
      .eq("project_id", projectId)
      .single()

    if (existingLike) {
      // Unlike
      const { error } = await supabase.from("project_likes").delete().eq("user_id", userId).eq("project_id", projectId)

      if (error) throw error
      return false
    } else {
      // Like
      const { error } = await supabase.from("project_likes").insert({
        user_id: userId,
        project_id: projectId,
      })

      if (error) throw error
      return true
    }
  },

  // Get project likes for user
  async getUserLikes(userId: string) {
    const { data, error } = await supabase.from("project_likes").select("project_id").eq("user_id", userId)

    if (error) throw error
    return data.map((like) => like.project_id)
  },
}
