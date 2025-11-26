"use client"

import { createSupabaseBrowser } from "@/lib/supabase/client"
import { Button } from "@heroui/react"
import type { User } from "@supabase/supabase-js" // adjust import if needed
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ProfileSettings() {
  const [user, setUser] = useState<User | null>(null)
  const [fullName, setFullName] = useState("")
  const router = useRouter()
  const supabase = createSupabaseBrowser() // make sure this is sync

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/auth")
        return
      }
      setUser(data.user)
      const nameFromMeta =
        (data.user.user_metadata as { full_name?: string } | null)?.full_name ??
        ""
      setFullName(nameFromMeta)
    })
  }, [supabase, router])

  if (!user) return null

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Profile &amp; Settings</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-default-200 bg-background/80 p-6 backdrop-blur">
          <div className="text-sm text-foreground/60">Avatar</div>
          <div className="mt-3 flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-default-200" />
            <button className="rounded-lg border px-3 py-1.5 text-sm">
              Change
            </button>
          </div>
        </div>

        <form
          className="rounded-2xl border border-default-200 bg-background/80 p-6 backdrop-blur lg:col-span-2"
          onSubmit={async (e) => {
            e.preventDefault()
            await supabase.auth.updateUser({
              data: { full_name: fullName },
            })
          }}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block text-foreground/70">Full Name</span>
              <input
                className="w-full rounded-lg border bg-transparent px-3 py-2"
                name="full_name"
                placeholder="Your name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-foreground/70">Email</span>
              <input
                className="w-full cursor-not-allowed rounded-lg border bg-default-100 px-3 py-2"
                defaultValue={user.email ?? ""}
                disabled
              />
            </label>
          </div>
          <div className="mt-4 flex gap-3">
            <button className="rounded-lg bg-warning px-4 py-2 text-sm font-medium text-black">
              Save Changes
            </button>
            <Button
              className="text-sm"
              variant="bordered"
              onPress={async () => {
                await supabase.auth.signOut()
                router.push("/")
              }}
            >
              Sign out
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
