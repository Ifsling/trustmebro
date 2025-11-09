"use client"
import { useEffect, useRef, useState } from "react"

type Bullet = { x: number; y: number; vx: number; vy: number; alive: boolean }

export default function BulletDodgeGame({
  onWin,
  onLose,
}: {
  onWin: () => void
  onLose: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const bullets = useRef<Bullet[]>([])
  const player = useRef({ x: 320, y: 180, r: 10 })
  const keys = useRef<Record<string, boolean>>({})
  const [done, setDone] = useState(false)
  const duration = 20_000 // 20s

  useEffect(() => {
    const c = canvasRef.current!,
      ctx = c.getContext("2d")!
    let last = 0,
      raf: number
    const start = performance.now()

    function spawn() {
      if (done) return
      const side = Math.floor(Math.random() * 4)
      let x = 0,
        y = 0
      if (side === 0) {
        x = 0
        y = Math.random() * c.height
      }
      if (side === 1) {
        x = c.width
        y = Math.random() * c.height
      }
      if (side === 2) {
        x = Math.random() * c.width
        y = 0
      }
      if (side === 3) {
        x = Math.random() * c.width
        y = c.height
      }
      const dx = player.current.x - x
      const dy = player.current.y - y
      const len = Math.hypot(dx, dy) || 1
      const speed = 180 + Math.random() * 140
      bullets.current.push({
        x,
        y,
        vx: (dx / len) * speed,
        vy: (dy / len) * speed,
        alive: true,
      })
      setTimeout(spawn, 200 + Math.random() * 400)
    }
    spawn()

    function loop(t: number) {
      if (!last) last = t
      const dt = (t - last) / 1000
      last = t

      // move player
      const v = 220
      if (keys.current["ArrowLeft"] || keys.current["a"])
        player.current.x -= v * dt
      if (keys.current["ArrowRight"] || keys.current["d"])
        player.current.x += v * dt
      if (keys.current["ArrowUp"] || keys.current["w"])
        player.current.y -= v * dt
      if (keys.current["ArrowDown"] || keys.current["s"])
        player.current.y += v * dt
      player.current.x = Math.max(10, Math.min(c.width - 10, player.current.x))
      player.current.y = Math.max(10, Math.min(c.height - 10, player.current.y))

      // bullets
      bullets.current.forEach((b) => {
        if (!b.alive) return
        b.x += b.vx * dt
        b.y += b.vy * dt
        if (b.x < -20 || b.x > c.width + 20 || b.y < -20 || b.y > c.height + 20)
          b.alive = false
        // collide
        const dx = b.x - player.current.x
        const dy = b.y - player.current.y
        if (dx * dx + dy * dy <= (player.current.r + 4) ** 2) {
          setDone(true)
          onLose()
        }
      })

      // draw
      ctx.clearRect(0, 0, c.width, c.height)
      // player
      ctx.beginPath()
      ctx.arc(
        player.current.x,
        player.current.y,
        player.current.r,
        0,
        Math.PI * 2
      )
      ctx.fillStyle = "#0ea5e9"
      ctx.fill()
      // bullets
      ctx.fillStyle = "#ef4444"
      bullets.current.forEach((b) => {
        if (b.alive) ctx.fillRect(b.x - 3, b.y - 3, 6, 6)
      })

      // timer
      const left = Math.max(0, duration - (performance.now() - start))
      ctx.fillStyle = "#6b7280"
      ctx.fillText(`Survive: ${(left / 1000).toFixed(1)}s`, 8, 14)

      if (!done && left <= 0) {
        setDone(true)
        onWin()
        return
      }

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    function kd(e: KeyboardEvent) {
      keys.current[e.key] = true
    }
    function ku(e: KeyboardEvent) {
      keys.current[e.key] = false
    }
    window.addEventListener("keydown", kd)
    window.addEventListener("keyup", ku)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("keydown", kd)
      window.removeEventListener("keyup", ku)
    }
  }, [done, onLose, onWin])

  return (
    <div className="rounded-xl border bg-content1 p-2">
      <canvas
        ref={canvasRef}
        width={640}
        height={360}
        className="h-[70vh] w-full"
      />
      <div className="mt-2 text-center text-xs text-foreground/60">
        WASD/Arrows to move. Survive 20s. Any hit = lose.
      </div>
    </div>
  )
}
