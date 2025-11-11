"use client"
import { useCallback, useEffect, useRef, useState } from "react"


// Optional helper: lightweight confetti without bundling on server
async function burstConfetti() {
  const confetti = (await import("canvas-confetti")).default
  const duration = 1200
  const end = Date.now() + duration

  ;(function frame() {
    confetti({
      particleCount: 40,
      spread: 70,
      startVelocity: 45,
      ticks: 200,
      origin: { x: Math.random(), y: Math.random() * 0.3 + 0.1 },
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

type Phase = "running" | "stopped"

export default function StopTimerGame({
  onWin,
  onLose,
  payoutText, // e.g. "$91" (optional). If not provided, show generic text.
}: {
  onWin: () => void
  onLose: () => void
  payoutText?: string
}) {
  const TARGET = 50.0
  const TOL = 2

  const [phase, setPhase] = useState<Phase>("running")
  const [value, setValue] = useState(0) // live 0..100
  const [locked, setLocked] = useState<number | null>(null)
  const [won, setWon] = useState(false)

  const rafRef = useRef<number | null>(null)
  const lastRef = useRef<number>(0)

  const loop = useCallback((t: number) => {
    if (!lastRef.current) lastRef.current = t
    const dt = (t - lastRef.current) / 1000
    lastRef.current = t
    setValue((v) => (v + dt * 60) % 100) // ~60 units/sec cycling 0..100
    rafRef.current = requestAnimationFrame(loop)
  }, [])

  // start animation
  useEffect(() => {
    if (phase !== "running") return
    lastRef.current = 0
    rafRef.current = requestAnimationFrame(loop)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [phase, loop])

  function stop() {
    if (phase !== "running") return
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    setPhase("stopped")
    const lockedVal = Number(value.toFixed(1))
    setLocked(lockedVal)
    const isWin = Math.abs(lockedVal - TARGET) <= TOL
    setWon(isWin)
    if (isWin) {
      burstConfetti().catch(() => {})
      onWin()
    } else {
      onLose()
    }
  }

  function restart() {
    setLocked(null)
    setWon(false)
    setValue(0)
    setPhase("running")
  }

  const near = Math.abs(value - TARGET) <= TOL
  const bg =
    phase === "running"
      ? near
        ? "bg-green-500/15"
        : "bg-content1"
      : "bg-content1"

  return (
    <div
      className={`relative flex h-[70vh] items-center justify-center rounded-xl border ${bg}`}
    >
      {/* WIN BANNER */}
      {phase === "stopped" && won && (
        <div className="pointer-events-none absolute -top-90 inset-0 flex items-center justify-center">
          <div className="rounded-2xl bg-black/40 px-6 py-4 text-center backdrop-blur">
            <div className="text-xl font-semibold text-white">You have WON</div>
            <div className="mt-1 text-4xl font-extrabold tabular-nums text-warning">
              {payoutText ?? "🎉"}
            </div>
          </div>
        </div>
      )}

      <div className="text-center space-y-4">
        <div className="text-xs text-foreground/60">Hit 50.0 ± 2 to win</div>

        <div className="text-6xl font-semibold tabular-nums">
          {(locked ?? value).toFixed(1)}
        </div>

        {phase === "running" ? (
          <button
            onClick={stop}
            className="rounded-lg bg-warning px-6 py-2 text-sm font-medium text-black"
          >
            STOP
          </button>
        ) : (
          <div className="space-y-2">
            <div className="text-sm text-foreground/70">
              You stopped at{" "}
              <span className="font-semibold">{locked?.toFixed(1)}</span>
            </div>
            <button
              onClick={restart}
              className="rounded-lg bg-default-200 px-5 py-2 text-sm font-medium hover:bg-default-300"
            >
              Restart
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
