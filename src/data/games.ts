export type GameMeta = {
  slug: string
  title: string
  description: string
  /** Path under /public (preferred) or full URL */
  thumbnail: string
}

export const GAMES: GameMeta[] = [
  {
    slug: "reaction-duel",
    title: "Reaction Duel",
    description: "Tap the instant the screen flashes. >250 ms = lose.",
    thumbnail: "/images/games/reaction-duel.png",
  },
  {
    slug: "stop-the-timer",
    title: "Stop the Timer",
    description: "Freeze the counter at 50.0 (±0.5). Precision or bust.",
    thumbnail: "/images/games/stop-the-timer.png",
  },
  {
    slug: "archery-2d",
    title: "Archery 2D",
    description: "Drag to aim with gravity. Hit the bullseye to win.",
    thumbnail: "/images/games/archery-2d.png",
  },
  {
    slug: "falling-strikes",
    title: "Falling Strikes",
    description: "Click every falling pin before it hits the ground.",
    thumbnail: "/images/games/falling-strikes.png",
  },
  {
    slug: "bullet-dodge",
    title: "Bullet Dodge",
    description: "Survive 20s as bullets spawn from 360°. Any hit = lose.",
    thumbnail: "/images/games/bullet-dodge.png",
  },
  {
    slug: "target-shooter",
    title: "Target Shooter",
    description: "Click disappearing targets before the timer runs out.",
    thumbnail: "/images/games/target-shooter.png",
  },
]
