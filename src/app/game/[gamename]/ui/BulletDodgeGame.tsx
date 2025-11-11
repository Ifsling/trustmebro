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
  onChargeRound?: () => Promise<void> // optional: debit on replay to match your wallet flow
}

/**
 * Bullet Dodge (Phaser) — with result modal, frozen timer on lose,
 * and bullet intensity ramp (count & speed) over time.
 */
export default function BulletDodgeGame({
  onWin,
  onLose,
  onChargeRound,
}: Handlers) {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const gameRef = useRef<Phaser.Game | null>(null)

  // keep latest handlers
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
    const DURATION_MS = 40_000

    const BASE_MAX_BULLETS = 2 // starts with at most 2
    const MAX_MAX_BULLETS = 13 // ramps up to this over time
    const BULLET_SPEED_MIN = 220
    const BULLET_SPEED_MAX = 450
    const PLAYER_SPEED = 320
    const PLAYER_R = 14
    const BULLET_R = 8

    class Scene extends Phaser.Scene {
      g!: Phaser.GameObjects.Graphics
      ui?: Phaser.GameObjects.Container

      cursors!: Phaser.Types.Input.Keyboard.CursorKeys
      wasd!: {
        up: Phaser.Input.Keyboard.Key
        left: Phaser.Input.Keyboard.Key
        down: Phaser.Input.Keyboard.Key
        right: Phaser.Input.Keyboard.Key
      }

      startedAt = 0
      ended = false
      winFlag = false
      frozenProgress = 0 // freeze timer bar when lose

      player = { x: 0, y: 0, r: PLAYER_R }
      bullets: {
        x: number
        y: number
        vx: number
        vy: number
        alive: boolean
      }[] = []

      spawnTimer?: number

      create() {
        this.g = this.add.graphics()
        this.cameras.main.setBackgroundColor("#0b0f14")

        // input
        this.cursors = this.input.keyboard!.createCursorKeys()
        this.wasd = {
          up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
          left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
          down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
          right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        }

        // player center
        this.player.x = this.scale.width / 2
        this.player.y = this.scale.height / 2

        this.startedAt = performance.now()
        this.ended = false
        this.winFlag = false
        this.frozenProgress = 0
        this.clearUI()

        // maintain dynamic target bullet count based on progress
        const tick = () => {
          if (this.ended) return
          const progress = this.progress() // 0..1
          const targetCount =
            BASE_MAX_BULLETS +
            Math.min(
              MAX_MAX_BULLETS - BASE_MAX_BULLETS,
              Math.floor(progress * (MAX_MAX_BULLETS - BASE_MAX_BULLETS + 1))
            )
          const alive = this.bullets.filter((b) => b.alive).length
          if (alive < targetCount) {
            this.spawnOne(progress)
          }
          const next = Phaser.Math.Between(160, 400)
          this.spawnTimer = window.setTimeout(tick, next)
        }
        tick()

        this.scale.on("resize", () => {
          this.player.x = Phaser.Math.Clamp(
            this.player.x,
            PLAYER_R,
            this.scale.width - PLAYER_R
          )
          this.player.y = Phaser.Math.Clamp(
            this.player.y,
            PLAYER_R,
            this.scale.height - PLAYER_R
          )
        })
      }

      shutdown() {
        if (this.spawnTimer) clearTimeout(this.spawnTimer)
        this.spawnTimer = undefined
      }

      progress() {
        return Phaser.Math.Clamp(
          (performance.now() - this.startedAt) / DURATION_MS,
          0,
          1
        )
      }

      spawnOne(progress: number) {
        const W = this.scale.width
        const H = this.scale.height

        // choose edge
        const side = Phaser.Math.Between(0, 3)
        let x = 0,
          y = 0
        if (side === 0) {
          x = -BULLET_R
          y = Phaser.Math.Between(0, H)
        } // left
        if (side === 1) {
          x = W + BULLET_R
          y = Phaser.Math.Between(0, H)
        } // right
        if (side === 2) {
          x = Phaser.Math.Between(0, W)
          y = -BULLET_R
        } // top
        if (side === 3) {
          x = Phaser.Math.Between(0, W)
          y = H + BULLET_R
        } // bottom

        // aim toward current player
        const dx = this.player.x - x
        const dy = this.player.y - y
        const len = Math.hypot(dx, dy) || 1

        // ramp speed slightly over time (up to +60%)
        const rampMul = 1 + 0.6 * progress
        const base = Phaser.Math.Between(BULLET_SPEED_MIN, BULLET_SPEED_MAX)
        const speed = base * rampMul

        const vx = (dx / len) * speed
        const vy = (dy / len) * speed
        this.bullets.push({ x, y, vx, vy, alive: true })
      }

      update(_t: number, dms: number) {
        const dt = dms / 1000

        if (!this.ended) {
          // move
          let ax = 0,
            ay = 0
          if (this.cursors.left.isDown || this.wasd.left.isDown) ax -= 1
          if (this.cursors.right.isDown || this.wasd.right.isDown) ax += 1
          if (this.cursors.up.isDown || this.wasd.up.isDown) ay -= 1
          if (this.cursors.down.isDown || this.wasd.down.isDown) ay += 1
          if (ax || ay) {
            const inv = 1 / Math.hypot(ax, ay)
            ax *= inv
            ay *= inv
          }
          this.player.x += ax * PLAYER_SPEED * dt
          this.player.y += ay * PLAYER_SPEED * dt
          const W = this.scale.width,
            H = this.scale.height
          this.player.x = Phaser.Math.Clamp(
            this.player.x,
            PLAYER_R,
            W - PLAYER_R
          )
          this.player.y = Phaser.Math.Clamp(
            this.player.y,
            PLAYER_R,
            H - PLAYER_R
          )

          // bullets
          for (const b of this.bullets) {
            if (!b.alive) continue
            b.x += b.vx * dt
            b.y += b.vy * dt
            if (b.x < -60 || b.x > W + 60 || b.y < -60 || b.y > H + 60) {
              b.alive = false
              continue
            }
            // collision (circle vs circle)
            const dx = b.x - this.player.x
            const dy = b.y - this.player.y
            if (dx * dx + dy * dy <= (PLAYER_R + BULLET_R) ** 2) {
              this.end(false)
              break
            }
          }

          // win by time
          if (
            !this.ended &&
            performance.now() - this.startedAt >= DURATION_MS
          ) {
            this.end(true)
          }
        }

        this.draw()
      }

      end(win: boolean) {
        this.ended = true
        this.winFlag = win
        this.frozenProgress = this.progress()
        this.shutdown()

        this.showResult(win)
        if (win) {
          burstConfetti().catch(() => {})
          onWinRef.current()
        } else {
          onLoseRef.current()
        }
      }

      draw() {
        const g = this.g
        g.clear()
        const W = this.scale.width
        const H = this.scale.height

        // bg
        g.fillStyle(0x0b0f14, 1)
        g.fillRect(0, 0, W, H)

        // timer bar (freeze on lose)
        const progress = this.ended ? this.frozenProgress : this.progress()
        g.fillStyle(0x1f2937, 1)
        g.fillRect(0, 0, W, 10)
        g.fillStyle(0xf59e0b, 1)
        g.fillRect(0, 0, (1 - progress) * W, 10)

        // player
        g.fillStyle(0x0ea5e9, 1)
        g.fillCircle(this.player.x, this.player.y, PLAYER_R)
        g.lineStyle(2, 0xffffff, 0.6)
        g.strokeCircle(this.player.x, this.player.y, PLAYER_R + 2)

        // bullets
        for (const b of this.bullets) {
          if (!b.alive) continue
          g.fillStyle(0xef4444, 1)
          g.fillCircle(b.x, b.y, BULLET_R)
          g.lineStyle(1.5, 0x111827, 0.85)
          g.strokeCircle(b.x, b.y, BULLET_R)
        }

        // HUD
        const ctx = (g as any).ctx as CanvasRenderingContext2D | undefined
        if (ctx) {
          ctx.save()
          ctx.font =
            "600 13px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto"
          ctx.textBaseline = "top"
          ctx.fillStyle = "#94a3b8"
          ctx.fillText(
            "Move: WASD / Arrow Keys • Survive: 20s • Any hit = lose",
            10,
            14
          )
          ctx.restore()
        }
      }

      showResult(win: boolean) {
        this.clearUI()

        const cx = this.scale.width / 2
        const cy = 120
        const bg = this.add
          .rectangle(cx, cy, 420, 130, 0x000000, 0.5)
          .setStrokeStyle(1, 0xffffff, 0.12)
        const title = this.add
          .text(cx, cy - 24, win ? "You survived!" : "You were hit", {
            fontSize: "20px",
            color: "#ffffff",
          })
          .setOrigin(0.5)
        const sub = this.add
          .text(cx, cy + 2, win ? "Great dodging." : "Better luck next time.", {
            fontSize: "14px",
            color: "#cbd5e1",
          })
          .setOrigin(0.5)

        const replay = this.add
          .text(cx, cy + 38, "Replay (costs tokens)", {
            fontSize: "13px",
            color: "#111827",
            backgroundColor: "#f59e0b",
            padding: { x: 12, y: 6 },
          })
          .setOrigin(0.5)
          .setInteractive({ useHandCursor: true })

        replay.on("pointerup", async () => {
          if (onChargeRoundRef.current) await onChargeRoundRef.current()
          // reset state
          this.ended = false
          this.winFlag = false
          this.frozenProgress = 0
          this.bullets.length = 0
          this.startedAt = performance.now()
          this.clearUI()
          // re-arm spawner
          const tick = () => {
            if (this.ended) return
            const progress = this.progress()
            const targetCount =
              BASE_MAX_BULLETS +
              Math.min(
                MAX_MAX_BULLETS - BASE_MAX_BULLETS,
                Math.floor(progress * (MAX_MAX_BULLETS - BASE_MAX_BULLETS + 1))
              )
            const alive = this.bullets.filter((b) => b.alive).length
            if (alive < targetCount) this.spawnOne(progress)
            const next = Phaser.Math.Between(160, 400)
            this.spawnTimer = window.setTimeout(tick, next)
          }
          tick()
        })

        this.ui = this.add.container(0, 0, [bg, title, sub, replay])
      }

      clearUI() {
        if (this.ui) {
          this.ui.destroy()
          this.ui = undefined
        }
      }
    }

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: mountRef.current,
      backgroundColor: "#0b0f14",
      scene: [Scene],
      scale: {
        mode: Phaser.Scale.RESIZE,
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
        Move with WASD or Arrow Keys. Survive 20 seconds. Getting hit ends the
        game.
      </div>
    </div>
  )
}
