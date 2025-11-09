"use client"

import { lockStake, settleClient } from "@/lib/wallet"
import { Chip } from "@heroui/react"
import { JSX, useState } from "react"
import BidModal from "./BidModal"

export default function GameShell({
  gameSlug,
  renderGame,
}: {
  gameSlug: string
  renderGame: (a: { onWin: () => void; onLose: () => void }) => JSX.Element
}) {
  const [open, setOpen] = useState(true)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [balance, setBalance] = useState<number | null>(null)

  async function start(stake: number) {
    const { sessionId, balance } = await lockStake(gameSlug, stake)
    setSessionId(sessionId)
    setBalance(balance)
    setOpen(false)
  }

  async function finish(win: boolean, stake: number) {
    const multiplier = win ? 1.2 + Math.random() * 1.7 : 1
    const payout = win ? Math.ceil(stake * multiplier) : 0
    const res = await settleClient(sessionId!, win, payout)
    setBalance(res.balance)
  }

  const stakeRef = { current: 0 } // BidModal should set this when user confirms

  return (
    <div className="min-h-dvh p-6">
      <header className="mb-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold">{gameSlug}</h1>
        <Chip variant="flat">Balance: {balance ?? "—"}</Chip>
      </header>

      <div className="rounded-2xl border border-default-200 bg-content1 p-2">
        {sessionId ? (
          renderGame({
            onWin: () => finish(true, stakeRef.current),
            onLose: () => finish(false, stakeRef.current),
          })
        ) : (
          <div className="flex h-[60vh] items-center justify-center text-foreground/60">
            Waiting to start…
          </div>
        )}
      </div>

      <BidModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={async (stake, teaserMult) => {
          stakeRef.current = stake
          await start(stake) // make sure start returns a Promise or wrap: await Promise.resolve(start(stake))
          // teaserMult available if you want to log/telemetry
        }}
      />
    </div>
  )
}
