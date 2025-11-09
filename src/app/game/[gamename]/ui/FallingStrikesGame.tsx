"use client"
import { useEffect, useRef, useState } from "react"

type Pin = { x: number; y: number; vy: number; alive: boolean }

export default function FallingStrikesGame({
  onWin,
  onLose,
}: {
  onWin: () => void
  onLose: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const pins = useRef<Pin[]>([])
  const [done, setDone] = useState(false)
  const total = 12
  const floorY = 320

  useEffect(() => {
    const c = canvasRef.current!,
      ctx = c.getContext("2d")!
    let last = 0,
      raf: number
    let spawned = 0,
      missed = 0,
      cleared = 0

    function spawn() {
      if (spawned >= total) return
      spawned++
      pins.current.push({
        x: 40 + Math.random() * (c.width - 80),
        y: -20,
        vy: 180 + Math.random() * 160,
        alive: true,
      })
      // random burst cadence
      setTimeout(spawn, 200 + Math.random() * 500)
    }
    spawn()

    function loop(t: number) {
      if (!last) last = t
      const dt = (t - last) / 1000
      last = t

      // update
      pins.current.forEach((p) => {
        if (!p.alive) return
        p.y += p.vy * dt
        if (p.y >= floorY) {
          p.alive = false
          missed++
        }
      })

      // draw
      ctx.clearRect(0, 0, c.width, c.height)
      ctx.fillStyle = "#e5e7eb"
      ctx.fillRect(0, floorY, c.width, 4)

      pins.current.forEach((p) => {
        if (!p.alive) return
        ctx.fillStyle = "#111827"
        ctx.fillRect(p.x - 8, p.y - 20, 16, 40) // simple pin block
        ctx.fillStyle = "#f59e0b"
        ctx.fillRect(p.x - 8, p.y - 20, 16, 6)
      })

      ctx.fillStyle = "#6b7280"
      ctx.fillText(`Hit: ${cleared} / ${total}`, 8, 14)

      if (!done && (missed > 0 || cleared === total)) {
        setDone(true)
        if (missed > 0) onLose()
        else onWin()
        cancelAnimationFrame(raf)
        return
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [done, onLose, onWin])

  function onClick(e: React.MouseEvent) {
    if (done) return
    const rect = canvasRef.current!.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    let clearedLocal = 0
    pins.current.forEach((p) => {
      if (!p.alive) return
      if (Math.abs(mx - p.x) <= 12 && Math.abs(my - p.y) <= 24) {
        p.alive = false
        clearedLocal++
      }
    })
    // count live cleared
    const still = pins.current.filter((p) => p.alive).length
    const clearedTotal = pins.current.length - still
    // crude store in state via ref text draw; result checked in loop by comparing totals
  }

  return (
    <div className="rounded-xl border bg-content1 p-2">
      <canvas
        ref={canvasRef}
        width={640}
        height={360}
        className="h-[70vh] w-full"
        onClick={onClick}
      />
      <div className="mt-2 text-center text-xs text-foreground/60">
        Click every falling pin before it hits the line. Miss any → lose.
      </div>
    </div>
  )
}
