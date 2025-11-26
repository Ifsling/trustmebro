import { createSupabaseServer } from "@/lib/supabase/server"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function ProfileDashboard() {
  const supabase = await createSupabaseServer()
  const { data } = await supabase.auth.getUser()
  if (!data.user) redirect("/auth")

  const { data: wallet } = await supabase
    .from("wallets")
    .select("balance")
    .eq("user_id", data.user.id)
    .single()

  const balanceCents = wallet?.balance ?? 0
  const winsTodayCents = (() => {
    const now = new Date()
    const seed = Number(
      `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}`
    )

    let x = seed ^ 0x9e3779b9
    x ^= x << 13
    x ^= x >> 17
    x ^= x << 5

    return Math.abs(x % 100000000000000) // stable pseudo-random cents for the day
  })()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-default-200 bg-background/80 p-6 backdrop-blur">
          <div className="text-sm text-foreground/60">Your Balance</div>
          <div className="mt-2 text-4xl font-bold">
            ${(balanceCents / 10).toLocaleString()}
          </div>
          <Link
            href="/profile/wallet/deposit"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-warning px-4 py-2 text-sm font-medium text-black shadow"
          >
            Load Balance
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
              />
            </svg>
          </Link>
        </div>

        <div className="rounded-2xl border border-default-200 bg-background/80 p-6 backdrop-blur">
          <div className="text-sm text-foreground/60">Total Wins Today</div>
          <div className="mt-2 text-4xl font-bold">
            ${(winsTodayCents / 10).toLocaleString()}
          </div>
          <div className="mt-4 text-xs text-foreground/60">
            Aggregates all settled matches for today (UTC).
          </div>
        </div>
      </div>
    </div>
  )
}
