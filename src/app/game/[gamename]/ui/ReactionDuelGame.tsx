"use client"

import { useEffect, useRef, useState } from "react"

type Phase = "ready" | "wait" | "go" | "done"

export default function ReactionDuelGame({
  onWin,
  onLose,
  onChargeRound,
}: {
  onWin: () => void
  onLose: () => void
  onChargeRound: () => Promise<void>
}) {
  const [phase, setPhase] = useState<Phase>("ready")
  const [rt, setRt] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const startRef = useRef<number>(0)
  const timeoutRef = useRef<number | null>(null)
  const settledRef = useRef(false)

  useEffect(() => {
    startRound()
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function scheduleGo() {
    const delay = 800 + Math.random() * 1800
    timeoutRef.current = window.setTimeout(() => {
      setPhase("go")
      startRef.current = performance.now()
    }, delay) as unknown as number
  }

  function startRound() {
    settledRef.current = false
    setRt(null)
    setErr(null)
    setPhase("wait")
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    scheduleGo()
  }

  async function replay() {
    setLoading(true)
    setErr(null)
    try {
      await onChargeRound() // debit tokens for this round
      startRound()
    } catch (e: any) {
      setErr(e?.message ?? "Unable to debit for round")
    } finally {
      setLoading(false)
    }
  }

  function finish(win: boolean, reaction?: number) {
    if (settledRef.current) return
    settledRef.current = true
    setPhase("done")
    if (typeof reaction === "number") setRt(reaction)
    if (win) onWin()
    else onLose()
  }

  function handleClick() {
    if (phase === "wait") {
      finish(false)
      return
    }
    if (phase === "go") {
      const reaction = performance.now() - startRef.current
      finish(reaction <= 250, reaction)
    }
  }

  const containerCls =
    "flex h-[70vh] select-none items-center justify-center rounded-xl border cursor-pointer transition-colors " +
    (phase === "wait"
      ? "bg-red-500/10"
      : phase === "go"
      ? "bg-green-500/20"
      : "bg-content1")

  return (
    <div className={containerCls} onClick={handleClick}>
      <div className="text-center space-y-3">
        {phase === "wait" && <div className="text-xl">Wait for GREEN</div>}
        {phase === "go" && <div className="text-2xl font-bold">TAP!</div>}
        {phase === "ready" && <div>Ready…</div>}

        {phase === "done" && (
          <div className="space-y-2">
            {rt != null ? (
              <>
                <div className="text-sm text-foreground/60">Reaction time</div>
                <div className="text-4xl font-bold tabular-nums">
                  {Math.round(rt)} ms
                </div>
                <div className="text-xs text-foreground/60">
                  {rt <= 250 ? "Win threshold: ≤ 250 ms" : "Too slow: > 250 ms"}
                </div>
              </>
            ) : (
              <div className="text-2xl font-semibold text-danger">
                Too early!
              </div>
            )}

            {err && <div className="text-xs text-danger">{err}</div>}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                replay()
              }}
              disabled={loading}
              className="mt-3 rounded-lg bg-warning px-4 py-2 text-sm font-medium text-black disabled:opacity-60"
            >
              {loading ? "Debiting…" : "Replay (costs tokens)"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
