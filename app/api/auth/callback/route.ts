import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Create user profile if it doesn't exist
      const { error: profileError } = await supabase.from("users").upsert({
        id: data.user.id,
        email: data.user.email!,
        full_name: data.user.user_metadata?.full_name || null,
        avatar_url: data.user.user_metadata?.avatar_url || null,
      })

      if (profileError) {
        console.error("Error creating user profile:", profileError)
      }
    }
  }

  // Redirect to the builder or home page
  return NextResponse.redirect(new URL("/", requestUrl.origin))
}
