import LandingPage from "@/app/pages/LandingPage" // your existing landing page component
import { createSupabaseServer } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function Home() {
  const supabase = await createSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is already logged in, redirect to dashboard
  if (user) {
    redirect("/profile/dashboard")
  }

  // Otherwise show the landing page
  return <LandingPage />
}
