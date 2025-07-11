export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          subscription_tier: "free" | "pro" | "enterprise"
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: "free" | "pro" | "enterprise"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: "free" | "pro" | "enterprise"
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          files: any[]
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
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          files: any[]
          is_template?: boolean
          is_public?: boolean
          template_category?: string | null
          template_tags?: string[]
          template_difficulty?: "Beginner" | "Intermediate" | "Advanced" | null
          downloads_count?: number
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          files?: any[]
          is_template?: boolean
          is_public?: boolean
          template_category?: string | null
          template_tags?: string[]
          template_difficulty?: "Beginner" | "Intermediate" | "Advanced" | null
          downloads_count?: number
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      published_sites: {
        Row: {
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
        Insert: {
          id?: string
          user_id: string
          project_id: string
          name: string
          description?: string | null
          slug: string
          custom_domain?: string | null
          is_public?: boolean
          tags?: string[]
          views_count?: number
          likes_count?: number
          comments_count?: number
          site_content: string
          seo_title?: string | null
          seo_description?: string | null
          seo_image?: string | null
          published_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          name?: string
          description?: string | null
          slug?: string
          custom_domain?: string | null
          is_public?: boolean
          tags?: string[]
          views_count?: number
          likes_count?: number
          comments_count?: number
          site_content?: string
          seo_title?: string | null
          seo_description?: string | null
          seo_image?: string | null
          published_at?: string
          updated_at?: string
        }
      }
      project_likes: {
        Row: {
          id: string
          user_id: string
          project_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          created_at?: string
        }
      }
      site_analytics: {
        Row: {
          id: string
          site_id: string
          event_type: "view" | "like" | "share" | "comment"
          user_id: string | null
          ip_address: string | null
          user_agent: string | null
          referrer: string | null
          country: string | null
          city: string | null
          created_at: string
        }
        Insert: {
          id?: string
          site_id: string
          event_type: "view" | "like" | "share" | "comment"
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
          country?: string | null
          city?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          site_id?: string
          event_type?: "view" | "like" | "share" | "comment"
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
          country?: string | null
          city?: string | null
          created_at?: string
        }
      }
    }
  }
}
