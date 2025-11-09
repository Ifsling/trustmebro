import { createSupabaseServer } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function ProfileSettings() {
  const supabase = await createSupabaseServer()
  const { data } = await supabase.auth.getUser()
  if (!data.user) redirect("/auth")

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Profile & Settings</h1>

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

        <form className="rounded-2xl border border-default-200 bg-background/80 p-6 backdrop-blur lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block text-foreground/70">Full Name</span>
              <input
                className="w-full rounded-lg border bg-transparent px-3 py-2"
                name="full_name"
                placeholder="Your name"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-foreground/70">Email</span>
              <input
                className="w-full cursor-not-allowed rounded-lg border bg-default-100 px-3 py-2"
                defaultValue={data.user.email ?? ""}
                disabled
              />
            </label>
          </div>
          <div className="mt-4 flex gap-3">
            <button className="rounded-lg bg-warning px-4 py-2 text-sm font-medium text-black">
              Save Changes
            </button>
            <a href="/auth" className="rounded-lg border px-4 py-2 text-sm">
              Sign Out
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
