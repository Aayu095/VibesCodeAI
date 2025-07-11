// Mock publishing service using localStorage for development

export interface PublishedSite {
  id: string
  user_id: string
  project_id: string
  name: string
  description: string | null
  slug: string
  custom_domain: string | null
  is_public: boolean
  tags: string[]
  views_count: number
  likes_count: number
  comments_count: number
  site_content: string
  seo_title: string | null
  seo_description: string | null
  seo_image: string | null
  published_at: string
  updated_at: string
}

export class PublishingService {
  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  // Get user's published sites
  getUserPublishedSites(userId: string): PublishedSite[] {
    const sites = this.getStoredSites()
    return sites
      .filter((s) => s.user_id === userId)
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
  }

  // Get public sites
  getPublicSites(): PublishedSite[] {
    const sites = this.getStoredSites()
    return sites.filter((s) => s.is_public).sort((a, b) => b.views_count - a.views_count)
  }

  // Publish site
  publishSite(site: {
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
  }): PublishedSite {
    const newSite: PublishedSite = {
      id: this.generateId(),
      user_id: site.userId,
      project_id: site.projectId,
      name: site.name,
      description: site.description || null,
      slug: site.slug,
      custom_domain: null,
      is_public: site.isPublic ?? true,
      tags: site.tags || [],
      views_count: 0,
      likes_count: 0,
      comments_count: 0,
      site_content: site.siteContent,
      seo_title: site.seoTitle || null,
      seo_description: site.seoDescription || null,
      seo_image: site.seoImage || null,
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const sites = this.getStoredSites()
    sites.push(newSite)
    this.saveSites(sites)

    return newSite
  }

  // Update published site
  updatePublishedSite(
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
  ): PublishedSite {
    const sites = this.getStoredSites()
    const siteIndex = sites.findIndex((s) => s.id === siteId)

    if (siteIndex === -1) {
      throw new Error("Site not found")
    }

    sites[siteIndex] = {
      ...sites[siteIndex],
      name: updates.name ?? sites[siteIndex].name,
      description: updates.description ?? sites[siteIndex].description,
      is_public: updates.isPublic ?? sites[siteIndex].is_public,
      tags: updates.tags ?? sites[siteIndex].tags,
      site_content: updates.siteContent ?? sites[siteIndex].site_content,
      seo_title: updates.seoTitle ?? sites[siteIndex].seo_title,
      seo_description: updates.seoDescription ?? sites[siteIndex].seo_description,
      seo_image: updates.seoImage ?? sites[siteIndex].seo_image,
      updated_at: new Date().toISOString(),
    }

    this.saveSites(sites)
    return sites[siteIndex]
  }

  // Unpublish site
  unpublishSite(siteId: string): void {
    const sites = this.getStoredSites()
    const filteredSites = sites.filter((s) => s.id !== siteId)
    this.saveSites(filteredSites)
  }

  // Get site by ID
  getSiteById(siteId: string): PublishedSite | null {
    const sites = this.getStoredSites()
    return sites.find((s) => s.id === siteId) || null
  }

  // Get site by slug
  getSiteBySlug(slug: string): PublishedSite | null {
    const sites = this.getStoredSites()
    return sites.find((s) => s.slug === slug) || null
  }

  // Track site view
  trackSiteView(siteId: string, userAgent?: string, referrer?: string): void {
    const sites = this.getStoredSites()
    const siteIndex = sites.findIndex((s) => s.id === siteId)

    if (siteIndex !== -1) {
      sites[siteIndex].views_count += 1
      this.saveSites(sites)
    }

    // Could also track analytics here
    console.log(`Site view tracked: ${siteId}`, { userAgent, referrer })
  }

  // Generate unique slug
  generateUniqueSlug(baseName: string): string {
    const baseSlug = baseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

    let slug = baseSlug
    let counter = 1

    const sites = this.getStoredSites()

    while (sites.find((s) => s.slug === slug)) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    return slug
  }

  // Helper methods
  private getStoredSites(): PublishedSite[] {
    try {
      return JSON.parse(localStorage.getItem("vibescode-published-sites") || "[]")
    } catch {
      return []
    }
  }

  private saveSites(sites: PublishedSite[]): void {
    localStorage.setItem("vibescode-published-sites", JSON.stringify(sites))
  }
}

export const publishingService = new PublishingService()
