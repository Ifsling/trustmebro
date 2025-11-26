"use client"

import * as Phaser from "phaser"
import { useEffect, useRef } from "react"

// confetti on win
async function burstConfetti() {
  const confetti = (await import("canvas-confetti")).default
  const end = Date.now() + 1000
  ;(function frame() {
    confetti({
      particleCount: 60,
      spread: 70,
      startVelocity: 45,
      origin: { x: Math.random(), y: 0.25 },
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

type Handlers = {
  onWin: () => void
  onLose: () => void
  onChargeRound?: () => Promise<void> // optional debit on replay
}

/**
 * Target Shooter (Phaser)
 * - One target at a time
 * - 3 lives; miss a target (let its lifetime end) → lose 1 life
 * - Hit TARGET_COUNT total to win
 * - Lifetime starts ~2000ms and ramps shorter each target (down to ~800ms)
 * - Nice bullseye, with a circular lifetime ring that shrinks
 * - Canvas fills parent via RESIZE
 * - Result modal; no auto-restart; Replay button only
 */
export default function TargetShooterGame({
  onWin,
  onLose,
  onChargeRound,
}: Handlers) {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const gameRef = useRef<Phaser.Game | null>(null)

  // keep latest handlers without re-init
  const onWinRef = useRef(onWin)
  const onLoseRef = useRef(onLose)
  const onChargeRoundRef = useRef(onChargeRound)
  onWinRef.current = onWin
  onLoseRef.current = onLose
  onChargeRoundRef.current = onChargeRound

  useEffect(() => {
    if (!mountRef.current) return

    // tuning
    const BASE_W = 980
    const BASE_H = 560
    const TARGET_COUNT = 35
    const LIVES_MAX = 3

    const TTL_START = 2000 // ms
    const TTL_END = 800 // ms at last target
    const R_START = 40 // px radius starts larger
    const R_END = 26 // px radius at last target
    const MARGIN = 60 // keep off the edges

    class Scene extends Phaser.Scene {
      g!: Phaser.GameObjects.Graphics
      hudHits!: Phaser.GameObjects.Text
      hudLives!: Phaser.GameObjects.Text

      ended = false
      winFlag = false
      showingModal = false

      hits = 0
      lives = LIVES_MAX

      // target state
      tx = 0
      ty = 0
      tr = R_START
      ttl = TTL_START
      ttlLeft = TTL_START
      alive = false

      // timestamps
      spawnedAt = 0

      create() {
        this.g = this.add.graphics()
        this.cameras.main.setBackgroundColor("#0b0f14")

        this.hudHits = this.add
          .text(12, 12, "", { fontSize: "14px", color: "#e2e8f0" })
          .setDepth(10)
        this.hudLives = this.add
          .text(12, 34, "", { fontSize: "14px", color: "#e2e8f0" })
          .setDepth(10)

        this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
          if (!this.alive || this.ended || this.showingModal) return
          const dx = p.x - this.tx
          const dy = p.y - this.ty
          if (dx * dx + dy * dy <= this.tr * this.tr) {
            this.hits++
            this.alive = false
            if (this.hits >= TARGET_COUNT) {
              this.finish(true)
            } else {
              this.spawnNext(180)
            }
          }
        })

        this.spawnNext(0)

        this.scale.on("resize", () => void 0)
      }

      // difficulty ramp helpers
      currentTTL(): number {
        // linear ramp from start to end across [0, TARGET_COUNT-1]
        const t = this.hits / Math.max(1, TARGET_COUNT - 1)
        return Phaser.Math.Linear(TTL_START, TTL_END, t)
      }
      currentRadius(): number {
        const t = this.hits / Math.max(1, TARGET_COUNT - 1)
        return Phaser.Math.Linear(R_START, R_END, t)
      }

      spawnNext(delayMs: number) {
        if (this.ended) return
        this.time.delayedCall(delayMs, () => {
          if (this.ended) return
          const W = this.scale.width
          const H = this.scale.height
          const r = this.currentRadius()
          this.tx = Phaser.Math.Between(MARGIN + r, W - MARGIN - r)
          this.ty = Phaser.Math.Between(MARGIN + r + 20, H - MARGIN - r)
          this.tr = r
          this.ttl = this.currentTTL()
          this.ttlLeft = this.ttl
          this.spawnedAt = performance.now()
          this.alive = true
        })
      }

      update(_t: number, dms: number) {
        // HUD
        this.hudHits.setText(`Hit: ${this.hits} / ${TARGET_COUNT}`)
        this.hudLives.setText(
          `Lives: ${"❤".repeat(this.lives)}${"·".repeat(
            Math.max(0, LIVES_MAX - this.lives)
          )}`
        )

        // advance lifetime
        if (!this.ended && this.alive) {
          this.ttlLeft -= dms
          if (this.ttlLeft <= 0) {
            // miss
            this.alive = false
            this.lives--
            if (this.lives <= 0) {
              this.finish(false)
            } else {
              this.spawnNext(220)
            }
          }
        }

        this.draw()
      }

      draw() {
        const g = this.g
        g.clear()

        const W = this.scale.width
        const H = this.scale.height

        // background subtle
        g.fillStyle(0x0b0f14, 1)
        g.fillRect(0, 0, W, H)

        // center vignette
        g.fillStyle(0x0f172a, 0.5)
        const cx = W / 2
        const cy = H / 2
        g.fillCircle(cx, cy, Math.min(W, H) * 0.55)

        // target
        if (this.alive) {
          this.drawBullseye(this.tx, this.ty, this.tr)

          // lifetime ring
          const pct = Phaser.Math.Clamp(this.ttlLeft / this.ttl, 0, 1)
          const start = -Math.PI / 2
          const end = start + pct * Math.PI * 2
          g.lineStyle(5, 0xf59e0b, 1)
          g.beginPath()
          g.arc(this.tx, this.ty, this.tr + 10, start, end, false)
          g.strokePath()
        }

        // top strip
        g.fillStyle(0x1f2937, 1)
        g.fillRect(0, 0, W, 8)
      }

      drawBullseye(x: number, y: number, r: number) {
        const g = this.g
        // shadow
        g.fillStyle(0x000000, 0.35)
        g.fillCircle(x + 2, y + 3, r + 10)

        // rings
        const colors = [0xffffff, 0xef4444, 0xf59e0b, 0x22c55e, 0x3b82f6]
        const steps = colors.length
        for (let i = steps - 1; i >= 0; i--) {
          const rr = r * ((i + 1) / steps)
          g.fillStyle(colors[i], 1)
          g.fillCircle(x, y, rr)
          g.lineStyle(1.2, 0x0f172a, 0.6)
          g.strokeCircle(x, y, rr)
        }
        // bullseye highlight
        g.lineStyle(2, 0x111827, 0.9)
        g.strokeCircle(x, y, r / steps)
      }

      finish(win: boolean) {
        if (this.ended) return
        this.ended = true
        this.alive = false
        this.showResult(win)
        if (win) {
          burstConfetti().catch(() => {})
          onWinRef.current()
        } else {
          onLoseRef.current()
        }
      }

      showResult(win: boolean) {
        if (this.showingModal) return
        this.showingModal = true

        const cx = this.scale.width / 2
        const cy = 140
        const bg = this.add
          .rectangle(cx, cy, 460, 150, 0x000000, 0.5)
          .setStrokeStyle(1, 0xffffff, 0.12)
        const title = this.add
          .text(
            cx,
            cy - 28,
            win ? "You hit them all!" : "You ran out of lives",
            {
              fontSize: "20px",
              color: "#ffffff",
            }
          )
          .setOrigin(0.5)
        const sub = this.add
          .text(
            cx,
            cy + 0,
            `Hits: ${this.hits}/${TARGET_COUNT}  •  Lives: ${this.lives}/${LIVES_MAX}`,
            {
              fontSize: "14px",
              color: "#cbd5e1",
            }
          )
          .setOrigin(0.5)

        const replay = this.add
          .text(cx, cy + 42, "Replay (costs tokens)", {
            fontSize: "13px",
            color: "#111827",
            backgroundColor: "#f59e0b",
            padding: { x: 12, y: 6 },
          })
          .setOrigin(0.5)
          .setInteractive({ useHandCursor: true })

        replay.on("pointerup", async () => {
          if (onChargeRoundRef.current) await onChargeRoundRef.current()
          // reset run
          this.ended = false
          this.winFlag = false
          this.showingModal = false
          this.hits = 0
          this.lives = LIVES_MAX
          this.alive = false
          this.spawnNext(200)
          container.destroy()
        })

        const container = this.add.container(0, 0, [bg, title, sub, replay])
      }
    }

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: mountRef.current,
      backgroundColor: "#0b0f14",
      scene: [Scene],
      scale: {
        mode: Phaser.Scale.RESIZE, // fill the container
        autoCenter: Phaser.Scale.NO_CENTER,
        width: BASE_W,
        height: BASE_H,
      },
      fps: { target: 60, forceSetTimeOut: true },
    })
    gameRef.current = game

    return () => {
      game.destroy(true)
      gameRef.current = null
    }
  }, [])

  return (
    <div className="rounded-2xl border border-default-200 bg-content1">
      <div ref={mountRef} className="h-[70vh] w-full overflow-hidden" />
      <div className="px-2 pb-2 pt-2 text-center text-xs text-foreground/60">
        Hit the target before the ring disappears. Miss = lose a life. 3 lives.
        Hit all to win.
      </div>
    </div>
  )
}
