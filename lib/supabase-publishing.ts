import { supabase } from "./supabase-client"
import type { Database } from "./database.types"

type PublishedSite = Database["public"]["Tables"]["published_sites"]["Row"]

export class SupabasePublishingService {
  // Get user's published sites
  async getUserPublishedSites(userId: string) {
    const { data, error } = await supabase
      .from("published_sites")
      .select("*")
      .eq("user_id", userId)
      .order("published_at", { ascending: false })

    if (error) throw error
    return data
  }

  // Get public published sites
  async getPublicSites() {
    const { data, error } = await supabase
      .from("published_sites")
      .select("*")
      .eq("is_public", true)
      .order("views_count", { ascending: false })

    if (error) throw error
    return data
  }

  // Publish site
  async publishSite(site: {
    userId: string
    projectId: string
    name: string
    description?: string
    slug: string
    isPublic?: boolean
    tags?: string[]
    siteContent: string
    seoTitle?: string
    seoDescription?: string
    seoImage?: string
  }) {
    const { data, error } = await supabase
      .from("published_sites")
      .insert({
        user_id: site.userId,
        project_id: site.projectId,
        name: site.name,
        description: site.description,
        slug: site.slug,
        is_public: site.isPublic || true,
        tags: site.tags || [],
        site_content: site.siteContent,
        seo_title: site.seoTitle,
        seo_description: site.seoDescription,
        seo_image: site.seoImage,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Update published site
  async updatePublishedSite(
    siteId: string,
    updates: {
      name?: string
      description?: string
      isPublic?: boolean
      tags?: string[]
      siteContent?: string
      seoTitle?: string
      seoDescription?: string
      seoImage?: string
    },
  ) {
    const { data, error } = await supabase
      .from("published_sites")
      .update({
        name: updates.name,
        description: updates.description,
        is_public: updates.isPublic,
        tags: updates.tags,
        site_content: updates.siteContent,
        seo_title: updates.seoTitle,
        seo_description: updates.seoDescription,
        seo_image: updates.seoImage,
      })
      .eq("id", siteId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Unpublish site
  async unpublishSite(siteId: string) {
    const { error } = await supabase.from("published_sites").delete().eq("id", siteId)

    if (error) throw error
  }

  // Get site by slug
  async getSiteBySlug(slug: string) {
    const { data, error } = await supabase.from("published_sites").select("*").eq("slug", slug).single()

    if (error) throw error
    return data
  }

  // Track site view
  async trackSiteView(siteId: string, userAgent?: string, referrer?: string) {
    // Increment views count
    const { error: updateError } = await supabase
      .from("published_sites")
      .update({ views_count: supabase.sql`views_count + 1` })
      .eq("id", siteId)

    if (updateError) throw updateError

    // Track analytics
    const { error: analyticsError } = await supabase.from("site_analytics").insert({
      site_id: siteId,
      event_type: "view",
      user_agent: userAgent,
      referrer: referrer,
    })

    if (analyticsError) throw analyticsError
  }

  // Generate unique slug
  async generateUniqueSlug(baseName: string): Promise<string> {
    const baseSlug = baseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

    let slug = baseSlug
    let counter = 1

    while (true) {
      const { data } = await supabase.from("published_sites").select("id").eq("slug", slug).single()

      if (!data) {
        return slug
      }

      slug = `${baseSlug}-${counter}`
      counter++
    }
  }
}

export const supabasePublishing = new SupabasePublishingService()
