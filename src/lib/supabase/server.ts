import { createServerClient } from "@supabase/ssr"
import { cookies as nextCookies } from "next/headers"

export async function createSupabaseServer() {
  // Handle both sync and async cookies() return types
  const cookieStore = await Promise.resolve(nextCookies())

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore
            .getAll()
            .map(({ name, value }) => ({ name, value }))
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Ignore immutable headers in server render phase
          }
        },
      },
    }
  )
}
