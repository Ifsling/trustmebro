"use client"

import BidModal from "@/components/BidModal"
import { createSupabaseBrowser } from "@/lib/supabase/client"
import {
  debitForRound,
  getBalance,
  lockStake,
  settleClient,
} from "@/lib/wallet"
import { Button, Chip, Snippet } from "@heroui/react"
import { JSX, useEffect, useMemo, useState } from "react"

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
  useMemo(createSupabaseBrowser, []) // ensure browser client init once

  const [open, setOpen] = useState(!initialSessionId)
  const [sessionId, setSessionId] = useState<string | null>(
    initialSessionId ?? null
  )
  const [balance, setBalance] = useState<number>(0)
  const [stake, setStake] = useState<number>(0)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    getBalance()
      .then(setBalance)
      .catch(() => setBalance(0))
  }, [])

  async function start(stakeAmount: number) {
    setErr(null)
    if (stakeAmount <= 0) {
      setErr("Stake must be > 0")
      return
    }
    if (stakeAmount > balance) {
      setErr("Insufficient balance")
      return
    }
    try {
      const { sessionId, balance: b } = await lockStake(gameSlug, stakeAmount)
      setSessionId(sessionId)
      setBalance(b)
      setStake(stakeAmount)
    } catch (e: any) {
      setErr(e?.message ?? "Failed to start")
    }
  }

  async function onChargeRound() {
    setErr(null)
    try {
      const b = await debitForRound(stake)
      setBalance(b)
    } catch (e: any) {
      setErr(e?.message ?? "Debit failed")
      throw e
    }
  }

  async function settle(win: boolean) {
    if (!sessionId) return
    const mult = win ? 1.2 + Math.random() * 1.7 : 1
    const payout = win ? Math.ceil(stake * mult) : 0
    try {
      const { balance: b } = await settleClient(sessionId, win, payout)
      setBalance(b)
    } catch (e: any) {
      setErr(e?.message ?? "Settle failed")
    }
  }

  return (
    <div className="min-h-dvh w-full bg-background p-6 text-foreground">
      <header className="mb-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Playing: {gameSlug}</h1>
        <Chip variant="flat" color="default">
          Balance: {balance}
        </Chip>
      </header>

      {err && (
        <div className="mb-3">
          <Snippet hideSymbol color="danger" variant="flat">
            {err}
          </Snippet>
        </div>
      )}

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
        maxStake={balance}
        onConfirm={async (s) => {
          await start(s)
          if (s > 0 && s <= balance) setOpen(false)
        }}
      />
    </div>
  )
}
