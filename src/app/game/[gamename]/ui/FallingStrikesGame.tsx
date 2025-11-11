"use client"

import * as Phaser from "phaser"
import { useEffect, useRef } from "react"

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
  onChargeRound?: () => Promise<void>
}

export default function FallingStrikesGame({
  onWin,
  onLose,
  onChargeRound,
}: Handlers) {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const gameRef = useRef<Phaser.Game | null>(null)

  // Keep latest handlers without re-running the effect
  const onWinRef = useRef(onWin)
  const onLoseRef = useRef(onLose)
  const onChargeRoundRef = useRef(onChargeRound)
  onWinRef.current = onWin
  onLoseRef.current = onLose
  onChargeRoundRef.current = onChargeRound

  useEffect(() => {
    if (!mountRef.current) return

    const TOTAL = 10
    const BASE_W = 980
    const BASE_H = 560
    const GROUND_PAD = 80
    const FALL_SPEED = 1050

    const PIN_W = 30
    const PIN_H = 64
    const HEAD_R = 12

    class Scene extends Phaser.Scene {
      g!: Phaser.GameObjects.Graphics
      ui?: Phaser.GameObjects.Container

      successes = 0
      active = false // game running gate
      ended = false // hard stop; prevents any further spawns
      resultShown = false

      pinX = 0
      pinY = -PIN_H / 2
      pinAlive = false

      spawnTimer?: number

      get groundY() {
        return this.scale.height - GROUND_PAD
      }

      create() {
        this.g = this.add.graphics()
        this.cameras.main.setBackgroundColor("#0b0f14")

        this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
          if (!this.active || !this.pinAlive || this.ended) return
          const x = p.x,
            y = p.y
          if (this.hitPin(x, y)) {
            this.pinAlive = false
            this.successes++

            if (this.successes >= TOTAL) {
              this.finish(true)
              return
            }
            this.queueNext()
          }
        })

        this.startSeries()
        this.scale.on("resize", () => void 0)
      }

      startSeries() {
        this.clearUI()
        this.clearSpawnTimer()
        this.successes = 0
        this.resultShown = false
        this.ended = false
        this.active = true
        this.pinAlive = false
        this.queueNext(350)
      }

      finish(win: boolean) {
        // one-way stop
        this.pinAlive = false
        this.active = false
        this.ended = true
        this.clearSpawnTimer()

        this.showResult(win)
        if (win) {
          burstConfetti().catch(() => {})
          onWinRef.current()
        } else {
          onLoseRef.current()
        }
      }

      queueNext(minDelay = 250) {
        if (this.ended) return
        this.clearSpawnTimer()
        const delay = Phaser.Math.Between(minDelay, 1400)
        this.spawnTimer = window.setTimeout(() => this.spawnOne(), delay)
      }

      clearSpawnTimer() {
        if (this.spawnTimer) {
          clearTimeout(this.spawnTimer)
          this.spawnTimer = undefined
        }
      }

      spawnOne() {
        if (!this.active || this.ended) return
        const w = this.scale.width
        const margin = 70
        this.pinX = Phaser.Math.Between(margin, w - margin)
        this.pinY = -PIN_H / 2
        this.pinAlive = true
      }

      update(_t: number, dms: number) {
        if (!this.active || this.ended) {
          this.draw()
          return
        }

        if (this.pinAlive) {
          this.pinY += (FALL_SPEED * dms) / 1000
          if (this.pinY + PIN_H / 2 >= this.groundY) {
            // miss → immediate lose
            this.finish(false)
          }
        }

        this.draw()
      }

      draw() {
        const g = this.g
        g.clear()

        const W = this.scale.width
        const H = this.scale.height
        const GY = this.groundY

        // ground
        g.fillStyle(0x0f172a, 1)
        g.fillRect(0, GY, W, H - GY)
        g.lineStyle(2, 0x334155, 1)
        g.strokeLineShape(new Phaser.Geom.Line(0, GY, W, GY))

        // top bar
        g.fillStyle(0x94a3b8, 1)
        g.fillRect(0, 0, W, 34)
        g.fillStyle(0x0b0f14, 1)
        g.fillRect(0, 34, W, 1)

        // HUD
        this.drawHudText(W / 2, 18, `Hit: ${this.successes} / ${TOTAL}`)

        // pin
        if (this.pinAlive) this.drawPin(this.pinX, this.pinY)
      }

      drawHudText(x: number, y: number, s: string) {
        const g = this.g as any
        if (!g.ctx) return
        g.save()
        g.ctx.font = `600 14px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto`
        g.ctx.textBaseline = "middle"
        g.ctx.textAlign = "center"
        g.ctx.fillStyle = "#0b0f14"
        g.ctx.fillText(s, x + 1, y + 1)
        g.ctx.fillStyle = "#ffffff"
        g.ctx.fillText(s, x, y)
        g.restore()
      }

      drawPin(cx: number, cy: number) {
        const g = this.g
        const bodyTop = cy - PIN_H / 2 + HEAD_R

        // body
        g.fillStyle(0xffffff, 1)
        g.fillRoundedRect(cx - PIN_W / 2, bodyTop, PIN_W, PIN_H - HEAD_R, 8)

        // head
        const headCx = cx
        const headCy = cy - PIN_H / 2 + HEAD_R
        g.fillCircle(headCx, headCy, HEAD_R)

        // stripes
        g.fillStyle(0xef4444, 1)
        g.fillRect(cx - PIN_W / 2 + 2, bodyTop + 4, PIN_W - 4, 6)
        g.fillRect(cx - PIN_W / 2 + 2, bodyTop + 14, PIN_W - 4, 5)

        // yellow patch
        g.fillStyle(0xf59e0b, 1)
        g.fillCircle(cx + PIN_W * 0.2, bodyTop + (PIN_H - HEAD_R) * 0.55, 4)

        // outline
        g.lineStyle(1.5, 0x0f172a, 0.7)
        g.strokeRoundedRect(cx - PIN_W / 2, bodyTop, PIN_W, PIN_H - HEAD_R, 8)
        g.strokeCircle(headCx, headCy, HEAD_R)
      }

      hitPin(mx: number, my: number) {
        const bx = this.pinX - PIN_W / 2
        const by = this.pinY - PIN_H / 2 + HEAD_R
        const bw = PIN_W
        const bh = PIN_H - HEAD_R
        const inBody = mx >= bx && mx <= bx + bw && my >= by && my <= by + bh
        const cx = this.pinX
        const cy = this.pinY - PIN_H / 2 + HEAD_R
        const inHead = (mx - cx) ** 2 + (my - cy) ** 2 <= HEAD_R ** 2
        return inBody || inHead
      }

      showResult(win: boolean) {
        if (this.resultShown) return
        this.resultShown = true
        this.clearSpawnTimer()

        const cx = this.scale.width / 2
        const cy = 120
        const bg = this.add
          .rectangle(cx, cy, 420, 130, 0x000000, 0.5)
          .setStrokeStyle(1, 0xffffff, 0.12)
        const title = this.add
          .text(
            cx,
            cy - 24,
            win ? "You cleared all strikes!" : "You missed a strike",
            { fontSize: "20px", color: "#ffffff" }
          )
          .setOrigin(0.5)
        const sub = this.add
          .text(cx, cy + 2, `Hit: ${this.successes} / ${TOTAL}`, {
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
          this.resultShown = false
          this.startSeries()
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
  }, []) // <-- no handler deps; re-init only on mount

  return (
    <div className="rounded-2xl border border-default-200 bg-content1">
      <div ref={mountRef} className="h-[70vh] w-full overflow-hidden" />
      <div className="px-2 pb-2 pt-2 text-center text-xs text-foreground/60">
        One pin at a time. Click before it hits the line. Miss any → lose.
        Total: 10.
      </div>
    </div>
  )
}
