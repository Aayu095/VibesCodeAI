"use client"

import { useState, useEffect } from "react"
import { supabaseAuth } from "@/lib/supabase-auth"
import type { User, Session } from "@supabase/supabase-js"

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabaseAuth.getCurrentSession().then((session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabaseAuth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, fullName?: string) => {
    setLoading(true)
    try {
      const result = await supabaseAuth.signUp(email, password, fullName)
      return result
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const result = await supabaseAuth.signIn(email, password)
      return result
    } finally {
      setLoading(false)
    }
  }

  const signInWithOAuth = async (provider: "google" | "github") => {
    setLoading(true)
    try {
      const result = await supabaseAuth.signInWithOAuth(provider)
      return result
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await supabaseAuth.signOut()
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
  }
}
