"use client"
import { useEffect, useRef, useState } from "react"

export default function Archery2DGame({
  onWin,
  onLose,
}: {
  onWin: () => void
  onLose: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [fired, setFired] = useState(false)
  const drag = useRef<{
    sx: number
    sy: number
    ex: number
    ey: number
    dragging: boolean
  }>({ sx: 0, sy: 0, ex: 0, ey: 0, dragging: false })
  const arrow = useRef<{
    x: number
    y: number
    vx: number
    vy: number
    live: boolean
  }>({ x: 60, y: 260, vx: 0, vy: 0, live: false })
  const target = { x: 560, y: 220, r: 28 }
  const g = 600 // px/s^2

  useEffect(() => {
    const c = canvasRef.current!
    const ctx = c.getContext("2d")!
    let last = 0,
      raf: number

    function loop(t: number) {
      if (!last) last = t
      const dt = (t - last) / 1000
      last = t

      // update
      if (arrow.current.live) {
        arrow.current.vy += g * dt
        arrow.current.x += arrow.current.vx * dt
        arrow.current.y += arrow.current.vy * dt
        // hit?
        const dx = arrow.current.x - target.x
        const dy = arrow.current.y - target.y
        if (Math.hypot(dx, dy) <= target.r) {
          arrow.current.live = false
          onWin()
        }
        // out of bounds
        if (
          arrow.current.x > c.width ||
          arrow.current.y > c.height ||
          arrow.current.y < 0
        ) {
          arrow.current.live = false
          onLose()
        }
      }

      // draw
      ctx.clearRect(0, 0, c.width, c.height)
      // ground
      ctx.fillStyle = "#e5e7eb"
      ctx.fillRect(0, c.height - 40, c.width, 40)
      // target
      ctx.beginPath()
      ctx.arc(target.x, target.y, target.r, 0, Math.PI * 2)
      ctx.fillStyle = "#ef4444"
      ctx.fill()
      ctx.strokeStyle = "#111827"
      ctx.stroke()

      // archer
      ctx.fillStyle = "#111827"
      ctx.fillRect(40, 240, 10, 60)

      // aim line
      if (!arrow.current.live && drag.current.dragging) {
        ctx.beginPath()
        ctx.moveTo(drag.current.sx, drag.current.sy)
        ctx.lineTo(drag.current.ex, drag.current.ey)
        ctx.strokeStyle = "#f59e0b"
        ctx.lineWidth = 2
        ctx.stroke()
      }

      // arrow
      ctx.fillStyle = "#374151"
      ctx.fillRect(arrow.current.x - 8, arrow.current.y - 2, 16, 4)

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [onLose, onWin])

  function onDown(e: React.MouseEvent) {
    if (fired) return
    const rect = canvasRef.current!.getBoundingClientRect()
    drag.current.sx = 60
    drag.current.sy = 260
    drag.current.ex = e.clientX - rect.left
    drag.current.ey = e.clientY - rect.top
    drag.current.dragging = true
  }
  function onMove(e: React.MouseEvent) {
    if (!drag.current.dragging) return
    const rect = canvasRef.current!.getBoundingClientRect()
    drag.current.ex = e.clientX - rect.left
    drag.current.ey = e.clientY - rect.top
  }
  function onUp() {
    if (!drag.current.dragging || fired) return
    drag.current.dragging = false
    setFired(true)
    const dx = drag.current.sx - drag.current.ex
    const dy = drag.current.sy - drag.current.ey
    // power scale
    const px = Math.min(500, Math.hypot(dx, dy))
    const ang = Math.atan2(dy, dx)
    const speed = 4 + px * 2 // px/s
    arrow.current = {
      x: 60,
      y: 260,
      vx: Math.cos(ang) * speed,
      vy: Math.sin(ang) * speed,
      live: true,
    }
  }

  return (
    <div className="rounded-xl border bg-content1 p-2">
      <canvas
        ref={canvasRef}
        width={640}
        height={360}
        className="h-[70vh] w-full"
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
      />
      <div className="mt-2 text-center text-xs text-foreground/60">
        Drag from the archer to aim, release to shoot. Hit the red target to
        win.
      </div>
    </div>
  )
}
