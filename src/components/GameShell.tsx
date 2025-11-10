"use client"

import BidModal from "@/components/BidModal"
import { createSupabaseBrowser } from "@/lib/supabase/client"
import { debitForRound, lockStake, settleClient } from "@/lib/wallet"
import { Button, Chip } from "@heroui/react"
import { JSX, useMemo, useState } from "react"

type RenderArgs = {
  onWin: () => void
  onLose: () => void
  onChargeRound: () => Promise<void>
}

export default function GameShell({
  gameSlug,
  sessionId: initialSessionId,
  renderGame,
}: {
  gameSlug: string
  sessionId?: string
  renderGame: (a: RenderArgs) => JSX.Element
}) {
  const sb = useMemo(createSupabaseBrowser, [])
  const [open, setOpen] = useState(!initialSessionId)
  const [sessionId, setSessionId] = useState<string | null>(
    initialSessionId ?? null
  )
  const [balance, setBalance] = useState<number | null>(null)
  const [stake, setStake] = useState<number>(0)

  async function start(stakeAmount: number) {
    const { sessionId, balance } = await lockStake(gameSlug, stakeAmount)
    setSessionId(sessionId)
    setBalance(balance)
    setStake(stakeAmount)
  }

  async function onChargeRound() {
    // charge the same stake for each replay
    const b = await debitForRound(stake)
    setBalance(b)
  }

  async function settle(win: boolean) {
    if (!sessionId) return
    const mult = win ? 1.2 + Math.random() * 1.7 : 1
    const payout = win ? Math.ceil(stake * mult) : 0
    const { balance } = await settleClient(sessionId, win, payout)
    setBalance(balance)
  }

  return (
    <div className="min-h-dvh w-full bg-background p-6 text-foreground">
      <header className="mb-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Playing: {gameSlug}</h1>
        <Chip variant="flat" color="default">
          Balance: {balance ?? "—"}
        </Chip>
      </header>

      <div className="rounded-2xl border border-default-200 bg-content1 p-2">
        {sessionId ? (
          renderGame({
            onWin: () => settle(true),
            onLose: () => settle(false),
            onChargeRound,
          })
        ) : (
          <div className="flex h-[70vh] items-center justify-center text-foreground/60">
            Waiting to start…
          </div>
        )}
      </div>

      {/* Dev helpers; remove later */}
      {sessionId && (
        <div className="mt-3 flex gap-3">
          <Button size="sm" onPress={() => settle(false)}>
            Force Lose
          </Button>
          <Button size="sm" color="success" onPress={() => settle(true)}>
            Force Win
          </Button>
        </div>
      )}

      <BidModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={async (s) => {
          await start(s)
          setOpen(false)
        }}
      />
    </div>
  )
}
