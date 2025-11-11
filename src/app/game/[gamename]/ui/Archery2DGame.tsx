"use client"

import * as Phaser from "phaser"
import { useEffect, useRef } from "react"

// bullseye confetti
async function burstConfetti() {
  const confetti = (await import("canvas-confetti")).default
  const end = Date.now() + 900
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
  onChargeRound?: () => Promise<void> // debit on replay
}

export default function Archery2DGame({
  onWin,
  onLose,
  onChargeRound,
}: Handlers) {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // logical base size; Phaser will RESIZE to the container
    const BASE_W = 980
    const BASE_H = 560
    const GROUND_PAD = 90
    const GRAV = 1500 // a bit lighter so shots travel farther

    class Scene extends Phaser.Scene {
      g!: Phaser.GameObjects.Graphics

      // computed each frame from current canvas size
      get groundY() {
        return this.scale.height - GROUND_PAD
      }
      get bow() {
        return { x: 150 * (this.scale.width / BASE_W), y: this.groundY - 70 }
      }

      dragging = false
      dragStart = new Phaser.Math.Vector2(0, 0)
      dragEnd = new Phaser.Math.Vector2(0, 0)

      arrow?: {
        pos: Phaser.Math.Vector2
        vel: Phaser.Math.Vector2
        live: boolean
        angle: number
      }

      target = {
        c: new Phaser.Math.Vector2(0, 0),
        R: 84,
        thetaDeg: 0,
        n: new Phaser.Math.Vector2(0, 1), // flat-edge normal
        t: new Phaser.Math.Vector2(1, 0), // tangent basis
      }

      resultUI?: Phaser.GameObjects.Container

      create() {
        this.g = this.add.graphics()
        this.cameras.main.setBackgroundColor("#0b0f14")

        // inputs
        this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
          if (this.arrow?.live) return
          const BOW = this.bow
          if (Phaser.Math.Distance.Between(p.x, p.y, BOW.x, BOW.y) > 100) return
          this.dragging = true
          this.dragStart.set(BOW.x, BOW.y)
          this.dragEnd.set(p.x, p.y)
        })
        this.input.on("pointermove", (p: Phaser.Input.Pointer) => {
          if (this.dragging) this.dragEnd.set(p.x, p.y)
        })
        this.input.on("pointerup", () => {
          if (!this.dragging) return
          this.dragging = false
          const BOW = this.bow

          // pull = start - end (drag-left => +x pull => shoot-right). Do NOT negate.
          const pull = new Phaser.Math.Vector2(
            this.dragStart.x - this.dragEnd.x,
            this.dragStart.y - this.dragEnd.y
          )
          const power = Phaser.Math.Clamp(pull.length(), 12, 360) // allow bigger pull
          const dir = pull.clone().normalize()

          // stronger scaling so full pull can reach far right
          const speed = 7.0 * power

          this.arrow = {
            pos: new Phaser.Math.Vector2(BOW.x, BOW.y),
            vel: dir.scale(speed),
            live: true,
            angle: 0,
          }
          this.hideResult()
        })

        this.randomizeTarget()
        this.scale.on("resize", () => this.positionTarget())
        this.positionTarget()
      }

      positionTarget() {
        // keep target on ground, random distance
        const cw = this.scale.width
        const BOW = this.bow
        const minX = Math.max(BOW.x + 300, cw * 0.48)
        const maxX = cw - 120
        this.target.c.set(Phaser.Math.Between(minX | 0, maxX | 0), this.groundY)
      }

      // 180° flip requested: invert both n and t after computing from θ
      setTargetOrientation(thetaDeg: number) {
        this.target.thetaDeg = thetaDeg
        const rad = Phaser.Math.DegToRad(thetaDeg)
        // base orientation
        const nx = -Math.sin(rad)
        const ny = Math.cos(rad)
        let n = new Phaser.Math.Vector2(nx, ny).normalize()
        let t = new Phaser.Math.Vector2(-ny, nx).normalize()
        // flip 180°
        n = n.negate()
        t = t.negate()
        this.target.n.copy(n)
        this.target.t.copy(t)
      }

      randomizeTarget() {
        this.setTargetOrientation(Phaser.Math.Between(90, 180))
        this.target.R = Phaser.Math.Between(72, 92)
      }

      showResult(score: number) {
        if (this.resultUI) this.resultUI.destroy()

        const bg = this.add
          .rectangle(this.scale.width / 2, 120, 380, 112, 0x000000, 0.45)
          .setStrokeStyle(1, 0xffffff, 0.12)
        const title = this.add
          .text(this.scale.width / 2, 96, `Score: ${score}`, {
            fontSize: "28px",
            color: "#ffffff",
            fontFamily: "ui-sans-serif, system-ui, Arial",
          })
          .setOrigin(0.5)
        const desc =
          score === 10
            ? "Bullseye!"
            : score === 9
            ? "Break-even hit"
            : score > 0
            ? "You missed profit"
            : "Miss"
        const sub = this.add
          .text(this.scale.width / 2, 132, desc, {
            fontSize: "14px",
            color: "#cbd5e1",
          })
          .setOrigin(0.5)

        const replay = this.add
          .text(this.scale.width / 2, 168, "Replay (costs tokens)", {
            fontSize: "13px",
            color: "#111827",
            backgroundColor: "#f59e0b",
            padding: { x: 12, y: 6 },
          })
          .setOrigin(0.5)
          .setInteractive({ useHandCursor: true })

        replay.on("pointerup", async () => {
          if (onChargeRound) {
            await onChargeRound() // ensures balance decreases on replay
          }
          this.arrow = undefined
          this.hideResult()
          this.randomizeTarget()
          this.positionTarget()
        })

        this.resultUI = this.add.container(0, 0, [bg, title, sub, replay])
      }

      hideResult() {
        if (this.resultUI) {
          this.resultUI.destroy()
          this.resultUI = undefined
        }
      }

      // inside oriented semicircle: ||v||<=R and v·n >= 0
      insideSemi(p: Phaser.Math.Vector2) {
        const v = new Phaser.Math.Vector2(
          p.x - this.target.c.x,
          p.y - this.target.c.y
        )
        if (v.lengthSq() > this.target.R * this.target.R) return false
        return v.dot(this.target.n) >= 0
      }

      // ring score (10,9,7,5,3) using (n,t) basis; 9+ -> win; 10 -> confetti
      scoreAt(p: Phaser.Math.Vector2) {
        const v = new Phaser.Math.Vector2(
          p.x - this.target.c.x,
          p.y - this.target.c.y
        )
        const rn = v.dot(this.target.n)
        const rt = v.dot(this.target.t)
        if (rn < 0) return 0
        const r = Math.hypot(rn, rt)
        if (r > this.target.R) return 0
        const w = this.target.R / 5
        if (r <= w) return 10
        if (r <= 2 * w) return 9
        if (r <= 3 * w) return 7
        if (r <= 4 * w) return 5
        return 3
      }

      update(_t: number, dms: number) {
        const dt = dms / 1000

        if (this.arrow?.live) {
          const a = this.arrow
          a.vel.y += GRAV * dt
          a.pos.x += a.vel.x * dt
          a.pos.y += a.vel.y * dt
          a.angle = Math.atan2(a.vel.y, a.vel.x)

          if (this.insideSemi(a.pos)) {
            a.live = false
            const score = this.scoreAt(a.pos)
            if (score >= 9) {
              if (score === 10) burstConfetti().catch(() => {})
              onWin()
            } else {
              onLose()
            }
            this.showResult(score)
          }

          // miss: OOB
          if (
            a.pos.y > this.scale.height + 60 ||
            a.pos.x < -80 ||
            a.pos.x > this.scale.width + 80
          ) {
            a.live = false
            onLose()
            this.showResult(0)
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
        const BOW = this.bow

        // ground
        g.fillStyle(0x0f172a, 1)
        g.fillRect(0, GY, W, H - GY)

        // bow base
        g.lineStyle(2, 0xe5e7eb, 1)
        g.strokeCircle(BOW.x, BOW.y, 36)

        // bow faux-curve (segmented)
        g.lineStyle(3, 0xf59e0b, 1)
        const topY = BOW.y - 40
        const botY = BOW.y + 40
        const steps = 14
        g.beginPath()
        for (let i = 0; i <= steps; i++) {
          const t = i / steps
          const y = Phaser.Math.Linear(topY, botY, t)
          const x = BOW.x - 24 * Math.sin(Math.PI * t)
          if (i === 0) g.moveTo(x, y)
          else g.lineTo(x, y)
        }
        g.strokePath()

        // string (no trajectory)
        g.lineStyle(2, 0xffffff, 0.75)
        const str = this.dragging
          ? this.dragEnd
          : new Phaser.Math.Vector2(BOW.x, BOW.y)
        g.beginPath()
        g.moveTo(BOW.x, BOW.y - 40)
        g.lineTo(str.x, str.y)
        g.lineTo(BOW.x, BOW.y + 40)
        g.strokePath()

        // target semicircle rings
        this.drawTarget()
        // arrow
        if (this.arrow) this.drawArrow(this.arrow)
      }

      drawArrow(a: { pos: Phaser.Math.Vector2; angle: number }) {
        const g = this.g
        const len = 46
        const hw = 3
        // @ts-ignore Phaser Graphics has canvas transform helpers at runtime
        g.save()
        // @ts-ignore
        g.translateCanvas(a.pos.x, a.pos.y)
        // @ts-ignore
        g.rotateCanvas(a.angle)
        g.fillStyle(0x94a3b8, 1)
        g.fillRect(-8, -hw, len, hw * 2)
        g.fillStyle(0xe5e7eb, 1)
        g.fillTriangle(len - 8, 0, len - 18, -6, len - 18, 6)
        g.fillStyle(0x0ea5e9, 1)
        g.fillTriangle(-8, 0, -18, -6, -18, 6)
        // @ts-ignore
        g.restore()
      }

      drawTarget() {
        const g = this.g
        const { c, R, n, t } = this.target

        const rim = (phi: number, r: number) => {
          const nn = r * Math.cos(phi)
          const tt = r * Math.sin(phi)
          return new Phaser.Math.Vector2(
            c.x + n.x * nn + t.x * tt,
            c.y + n.y * nn + t.y * tt
          )
        }

        const colors = [0xff0000, 0xffffff, 0x0057b7, 0xffffff, 0xff0000]

        for (let band = 5; band >= 1; band--) {
          const r = (R * band) / 5
          const col = colors[(5 - band) % colors.length]
          g.fillStyle(col, 1)
          g.beginPath()
          const steps = 44
          for (let i = 0; i <= steps; i++) {
            const phi = -Math.PI / 2 + (i * Math.PI) / steps // semicircle
            const p = rim(phi, r)
            if (i === 0) g.moveTo(p.x, p.y)
            else g.lineTo(p.x, p.y)
          }
          const pStart = rim(-Math.PI / 2, r)
          g.lineTo(pStart.x, pStart.y)
          g.closePath()
          g.fillPath()
        }

        // outer outline
        g.lineStyle(2, 0x111827, 0.5)
        g.beginPath()
        const steps = 48
        for (let i = 0; i <= steps; i++) {
          const phi = -Math.PI / 2 + (i * Math.PI) / steps
          const p = rim(phi, R)
          if (i === 0) g.moveTo(p.x, p.y)
          else g.lineTo(p.x, p.y)
        }
        g.strokePath()
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
        width: BASE_W, // logical base; ignored in RESIZE
        height: BASE_H,
      },
      fps: { target: 60, forceSetTimeOut: true },
    })
    gameRef.current = game

    return () => {
      game.destroy(true)
      gameRef.current = null
    }
  }, [onWin, onLose, onChargeRound])

  return (
    <div className="rounded-2xl border border-default-200 bg-content1">
      {/* Phaser will resize to fill this box */}
      <div ref={mountRef} className="h-[70vh] w-full overflow-hidden" />
      <div className="px-2 pb-2 pt-2 text-center text-xs text-foreground/60">
        Drag left to shoot right. Semicircle rotates 0°–90° (flat edge: up at
        0°, faces bow at 90°). 10=bullseye, 9=break-even.
      </div>
    </div>
  )
}
