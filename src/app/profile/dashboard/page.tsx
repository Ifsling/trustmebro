import { createSupabaseServer } from "@/lib/supabase/server"
import Link from "next/link"
import { redirect } from "next/navigation"

function seededInt(seed: number) {
  let x = seed ^ 0x9e3779b9
  x ^= x << 13
  x ^= x >> 17
  x ^= x << 5
  return Math.abs(x)
}

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

  const now = new Date()
  const todaySeed = Number(
    `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}`
  )

  const winsTodayCents = (() => {
    const x = seededInt(todaySeed)
    return x % 100000000000000 // stable pseudo-random cents for the day
  })()

  const dayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short" })

  const last7Days = Array.from({ length: 7 }, (_, idx) => {
    const d = new Date(now)
    d.setDate(d.getDate() - idx)
    const seed = Number(`${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}`)
    const raw = seededInt(seed) % 500000 // up to 50,000 "cents" units
    return {
      label: dayFormatter.format(d),
      cents: raw,
      games: (seededInt(seed + 17) % 40) + 5,
    }
  }).reverse()

  const maxDayCents =
    last7Days.reduce((max, d) => (d.cents > max ? d.cents : max), 0) || 1

  const total7DaysCents = last7Days.reduce((sum, d) => sum + d.cents, 0)

  // UPDATED: Now generates a value between 93 and 99
  const winRate = 93 + (seededInt(todaySeed + 99) % 7)

  const avgStakeCents =
    last7Days.length > 0
      ? Math.floor(
          last7Days.reduce((sum, d) => sum + d.cents / (d.games || 1), 0) /
            last7Days.length
        )
      : 0

  const gamesToday = (seededInt(todaySeed + 7) % 35) + 3
  const activeBoosts = (seededInt(todaySeed + 1234) % 3) + 1

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Top row: balance + today wins */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-default-200 bg-background/80 p-6 backdrop-blur">
          <div className="text-sm text-foreground/60">Your Balance</div>
          <div className="mt-2 text-4xl font-bold">
            ${(balanceCents / 10).toLocaleString()}
          </div>
          <div className="mt-3 flex gap-4 text-xs text-foreground/60">
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em]">
                7-day earnings
              </div>
              <div className="mt-1 text-sm font-semibold text-foreground">
                ${(total7DaysCents / 10).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em]">
                Games today
              </div>
              <div className="mt-1 text-sm font-semibold text-foreground">
                {gamesToday}
              </div>
            </div>
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
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-foreground/60">
                Total Wins Today (UTC)
              </div>
              <div className="mt-2 text-4xl font-bold">
                ${(winsTodayCents / 10).toLocaleString()}
              </div>
            </div>
            <div className="rounded-xl border border-success/30 bg-success/10 px-3 py-2 text-right">
              <div className="text-[11px] uppercase tracking-[0.16em] text-success/80">
                Win Rate
              </div>
              <div className="mt-1 text-xl font-semibold text-success">
                {winRate}%
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-xs text-foreground/70">
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em]">
                Avg stake
              </div>
              <div className="mt-1 text-sm font-semibold text-foreground">
                ${(avgStakeCents / 10).toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em]">
                Games today
              </div>
              <div className="mt-1 text-sm font-semibold text-foreground">
                {gamesToday}
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em]">
                Active boosts
              </div>
              <div className="mt-1 text-sm font-semibold text-foreground">
                {activeBoosts}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle row: earnings chart + breakdown */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Earnings last 7 days (bar graph) */}
        <div className="xl:col-span-2 rounded-2xl border border-default-200 bg-background/80 p-6 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Earnings last 7 days</div>
              <div className="mt-1 text-xs text-foreground/60">
                Bars scaled to your highest day.
              </div>
            </div>
          </div>

          <div className="mt-6 flex h-40 items-end gap-3">
            {last7Days.map((d) => {
              const ratio = d.cents / maxDayCents
              const height = Math.max(ratio * 100, 8) // min 8%
              return (
                <div
                  key={d.label}
                  className="flex flex-1 flex-col items-center justify-end gap-1"
                >
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-emerald-500/70 to-emerald-400/90 shadow-sm"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-foreground/60">
                    {d.label}
                  </div>
                  <div className="text-[10px] text-foreground/50">
                    ${(d.cents / 10).toFixed(0)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Breakdown card */}
        <div className="rounded-2xl border border-default-200 bg-background/80 p-6 backdrop-blur">
          <div className="text-sm font-medium">Session breakdown</div>
          <div className="mt-1 text-xs text-foreground/60">
            High-level summary of how you&apos;re earning.
          </div>

          <div className="mt-4 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">Skill games</div>
                <div className="text-[11px] text-foreground/60">
                  Head-to-head, tournaments, streaks
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">
                  {Math.round((total7DaysCents / 10) * 0.62).toLocaleString()}
                </div>
                <div className="text-[11px] text-foreground/60">≈62%</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">Daily boosts</div>
                <div className="text-[11px] text-foreground/60">
                  Time-limited multipliers
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">
                  {Math.round((total7DaysCents / 10) * 0.23).toLocaleString()}
                </div>
                <div className="text-[11px] text-foreground/60">≈23%</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">
                  Referral games
                </div>
                <div className="text-[11px] text-foreground/60">
                  Friends completing matches
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">
                  {Math.round((total7DaysCents / 10) * 0.15).toLocaleString()}
                </div>
                <div className="text-[11px] text-foreground/60">≈15%</div>
              </div>
            </div>
          </div>

          <div className="mt-5 h-px bg-gradient-to-r from-transparent via-default-200 to-transparent" />

          <div className="mt-4 flex items-center justify-between text-xs">
            <div className="text-foreground/60">7-day total</div>
            <div className="text-sm font-semibold">
              ${(total7DaysCents / 10).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: activity + meta stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-default-200 bg-background/80 p-6 backdrop-blur">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Recent activity</div>
            <Link
              href="/profile/games"
              className="text-xs text-foreground/60 hover:text-foreground"
            >
              View all games →
            </Link>
          </div>

          <div className="mt-4 space-y-3 text-xs">
            <div className="flex items-center justify-between rounded-lg bg-content1 px-3 py-2">
              <div>
                <div className="font-medium">Head-to-head match</div>
                <div className="text-[11px] text-foreground/60">
                  Skill Arena · Won by points
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-success">+$4.80</div>
                <div className="text-[11px] text-foreground/60">12 min ago</div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-content1 px-3 py-2">
              <div>
                <div className="font-medium">Daily streak bonus</div>
                <div className="text-[11px] text-foreground/60">
                  7 days played in a row
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-success">
                  +$12.00
                </div>
                <div className="text-[11px] text-foreground/60">1 hr ago</div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-content1 px-3 py-2">
              <div>
                <div className="font-medium">Tournament finish</div>
                <div className="text-[11px] text-foreground/60">
                  Top 10% · Arcade Rush
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-success">
                  +$28.40
                </div>
                <div className="text-[11px] text-foreground/60">3 hrs ago</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-default-200 bg-background/80 p-6 backdrop-blur">
          <div className="text-sm font-medium">Consistency & streaks</div>
          <div className="mt-1 text-xs text-foreground/60">
            Lightweight overview of how regularly you play.
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
            <div className="rounded-xl bg-content1 p-3">
              <div className="text-[11px] uppercase tracking-[0.16em] text-foreground/60">
                Active days
              </div>
              <div className="mt-2 text-xl font-semibold">
                {5 + (seededInt(todaySeed + 333) % 3)}/7
              </div>
              <div className="mt-1 text-[11px] text-foreground/60">
                Last 7 days
              </div>
            </div>
            <div className="rounded-xl bg-content1 p-3">
              <div className="text-[11px] uppercase tracking-[0.16em] text-foreground/60">
                Best streak
              </div>
              <div className="mt-2 text-xl font-semibold">
                {7 + (seededInt(todaySeed + 777) % 5)} days
              </div>
              <div className="mt-1 text-[11px] text-foreground/60">
                All time
              </div>
            </div>
            <div className="rounded-xl bg-content1 p-3">
              <div className="text-[11px] uppercase tracking-[0.16em] text-foreground/60">
                Avg session
              </div>
              <div className="mt-2 text-xl font-semibold">
                {15 + (seededInt(todaySeed + 222) % 10)} min
              </div>
              <div className="mt-1 text-[11px] text-foreground/60">
                Per play
              </div>
            </div>
          </div>

          <div className="mt-5 text-xs text-foreground/60">
            Numbers shown here are illustrative and based on synthetic
            aggregates. Wire them to your real game + transaction tables when
            ready.
          </div>
        </div>
      </div>
    </div>
  )
}
