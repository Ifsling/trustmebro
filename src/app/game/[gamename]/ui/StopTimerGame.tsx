"use client"
import { useEffect, useRef, useState } from "react"

export default function StopTimerGame({
  onWin,
  onLose,
}: {
  onWin: () => void
  onLose: () => void
}) {
  const [value, setValue] = useState(0)
  const [stopped, setStopped] = useState(false)
  const rafRef = useRef<number | null>(null)
  const lastRef = useRef<number>(0)

  useEffect(() => {
    function loop(t: number) {
      if (!lastRef.current) lastRef.current = t
      const dt = (t - lastRef.current) / 1000
      lastRef.current = t
      setValue((v) => (v + dt * 60) % 100) // 0..100 cycles
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  function stop() {
    if (stopped) return
    setStopped(true)
    const diff = Math.abs(value - 50)
    if (diff <= 0.5) onWin()
    else onLose()
  }

  return (
    <div className="flex h-[70vh] items-center justify-center rounded-xl border bg-content1">
      <div className="text-center space-y-4">
        <div className="text-5xl font-semibold tabular-nums">
          {value.toFixed(1)}
        </div>
        <button
          onClick={stop}
          className="rounded-lg bg-warning px-6 py-2 text-sm font-medium text-black"
        >
          STOP
        </button>
        <div className="text-xs text-foreground/60">Hit 50.0 ± 0.5 to win</div>
      </div>
    </div>
  )
}
