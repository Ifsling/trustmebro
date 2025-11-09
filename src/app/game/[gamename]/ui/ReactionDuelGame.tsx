"use client"
import { useEffect, useRef, useState } from "react"

export default function ReactionDuelGame({
  onWin,
  onLose,
}: {
  onWin: () => void
  onLose: () => void
}) {
  type Phase = "ready" | "wait" | "go" | "done"
  const [phase, setPhase] = useState<Phase>("ready")
  const [rt, setRt] = useState<number | null>(null)

  const startRef = useRef<number>(0)
  const timeoutRef = useRef<number | null>(null)
  const settledRef = useRef(false)

  useEffect(() => {
    startRound()
    return cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function cleanup() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = null
  }

  function startRound() {
    settledRef.current = false
    setRt(null)
    setPhase("wait")
    cleanup()
    const delay = 800 + Math.random() * 1800
    timeoutRef.current = window.setTimeout(() => {
      setPhase("go")
      startRef.current = performance.now()
    }, delay) as unknown as number
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
    "flex h-[70vh] select-none items-center justify-center rounded-xl border cursor-pointer " +
    (phase === "wait"
      ? "bg-danger/10"
      : phase === "go"
      ? "bg-success/20"
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
                  {rt <= 250
                    ? "Win threshold: ≤ 250 ms"
                    : "Too slow: >250 ms"}
                </div>
              </>
            ) : (
              <div className="text-2xl font-semibold text-danger">
                Too early!
              </div>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                startRound()
              }}
              className="mt-3 rounded-lg bg-warning px-4 py-2 text-sm font-medium text-black"
            >
              Replay
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
