"use client"

import { createSupabaseBrowser } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function AuthCallback() {
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const doExchange = async () => {
      const code = params.get("code")
      if (!code) {
        router.replace("/")
        return
      }
      const supabase = createSupabaseBrowser()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      router.replace(error ? "/auth?error=1" : "/dashboard")
    }
    doExchange()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
