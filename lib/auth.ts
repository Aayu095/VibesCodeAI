import { supabase } from "./supabase"
import type { User } from "@supabase/supabase-js"

export interface AuthUser extends User {
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
}

export const authService = {
  // Sign up with email and password
  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) throw error

    // Create user profile
    if (data.user) {
      await this.createUserProfile(data.user.id, email, fullName)
    }

    return data
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  },

  // Sign in with OAuth (Google, GitHub)
  async signInWithOAuth(provider: "google" | "github") {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) throw error
    return data
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get current user
  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // Create user profile in public.users table
  async createUserProfile(userId: string, email: string, fullName?: string) {
    const { error } = await supabase.from("users").insert({
      id: userId,
      email,
      full_name: fullName || null,
    })

    if (error) throw error
  },

  // Update user profile
  async updateUserProfile(
    userId: string,
    updates: {
      full_name?: string
      avatar_url?: string
    },
  ) {
    const { error } = await supabase.from("users").update(updates).eq("id", userId)

    if (error) throw error
  },

  // Get user profile
  async getUserProfile(userId: string) {
    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

    if (error) throw error
    return data
  },
}
