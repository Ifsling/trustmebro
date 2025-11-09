import { createSupabaseBrowser } from "@/lib/supabase/client"

export async function purchaseTokens(amount: number) {
  const sb = createSupabaseBrowser()
  const { data, error } = await sb.rpc("wallet_purchase", { amount })
  if (error) throw new Error(error.message || "wallet_purchase failed")
  const row = Array.isArray(data) ? data[0] : data
  return Number(row?.balance ?? 0)
}

export async function lockStake(gameSlug: string, stake: number) {
  const sb = createSupabaseBrowser()
  const { data, error } = await sb.rpc("game_lock_for_game", {
    p_game: gameSlug,
    p_stake: stake,
  })
  if (error) throw new Error(error.message)
  const row = Array.isArray(data) ? data[0] : data
  return { sessionId: row.session_id as string, balance: Number(row.balance) }
}

export async function settleClient(sessionId: string, won: boolean, payout: number) {
  const sb = createSupabaseBrowser()
  const { data, error } = await sb.rpc("game_settle_client", {
    p_session: sessionId,
    p_won: won,
    p_payout: payout,
  })
  if (error) throw new Error(error.message)
  const row = Array.isArray(data) ? data[0] : data
  return { status: row.status as "won" | "lost" | "started", balance: Number(row.balance) }
}