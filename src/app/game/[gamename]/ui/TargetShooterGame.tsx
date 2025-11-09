"use client"
import { useEffect, useRef, useState } from "react"

type Target = { x: number; y: number; r: number; alive: boolean; ttl: number }

export default function TargetShooterGame({
  onWin,
  onLose,
}: {
  onWin: () => void
  onLose: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const targets = useRef<Target[]>([])
  const [done, setDone] = useState(false)
  const need = 15
  const lifetime = 1400 // ms per target
  let hitCount = 0
  let missed = 0

  useEffect(() => {
    const c = canvasRef.current!,
      ctx = c.getContext("2d")!
    let last = 0,
      raf: number

    function spawn() {
      if (targets.current.length >= need) return
      targets.current.push({
        x: 40 + Math.random() * (c.width - 80),
        y: 40 + Math.random() * (c.height - 80),
        r: 16,
        alive: true,
        ttl: lifetime,
      })
      setTimeout(spawn, 500)
    }
    spawn()

    function loop(t: number) {
      if (!last) last = t
      const dt = t - last
      last = t

      // update TTLs
      targets.current.forEach((tr) => {
        if (!tr.alive) return
        tr.ttl -= dt
        if (tr.ttl <= 0) {
          tr.alive = false
          missed++
        }
      })

      // draw
      ctx.clearRect(0, 0, c.width, c.height)
      targets.current.forEach((tr) => {
        if (!tr.alive) return
        ctx.beginPath()
        ctx.arc(tr.x, tr.y, tr.r, 0, Math.PI * 2)
        ctx.fillStyle = "#22c55e"
        ctx.fill()
        ctx.lineWidth = 2
        ctx.strokeStyle = "#065f46"
        ctx.stroke()
      })
      ctx.fillStyle = "#6b7280"
      ctx.fillText(`Hit: ${hitCount} / ${need}`, 8, 14)

      const allResolved = hitCount + missed === need
      if (!done && (missed > 0 || allResolved)) {
        setDone(true)
        if (missed > 0) onLose()
        else onWin()
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
    for (const tr of targets.current) {
      if (!tr.alive) continue
      if ((mx - tr.x) ** 2 + (my - tr.y) ** 2 <= tr.r ** 2) {
        tr.alive = false
        hitCount++
        break
      }
    }
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
        Click every target before it disappears. Miss any → lose.
      </div>
    </div>
  )
}
