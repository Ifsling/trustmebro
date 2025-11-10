"use client"

import GameShell from "@/components/GameShell"
import Archery2DGame from "./ui/Archery2DGame"
import BulletDodgeGame from "./ui/BulletDodgeGame"
import FallingStrikesGame from "./ui/FallingStrikesGame"
import ReactionDuelGame from "./ui/ReactionDuelGame"
import StopTimerGame from "./ui/StopTimerGame"
import TargetShooterGame from "./ui/TargetShooterGame"

export default function GameClient({
  gameSlug,
  sessionId,
}: {
  gameSlug: string
  sessionId?: string
}) {
  return (
    <GameShell
      gameSlug={gameSlug}
      sessionId={sessionId}
      renderGame={({ onWin, onLose, onChargeRound }) => {
        switch (gameSlug) {
          case "reaction-duel":
            return (
              <ReactionDuelGame
                onWin={onWin}
                onLose={onLose}
                onChargeRound={onChargeRound}
              />
            )
          case "stop-the-timer":
            return (
              <StopTimerGame
                onWin={onWin}
                onLose={onLose}
                // onChargeRound={onChargeRound}
              />
            )
          case "archery-2d":
            return (
              <Archery2DGame
                onWin={onWin}
                onLose={onLose}
                // onChargeRound={onChargeRound}
              />
            )
          case "falling-strikes":
            return (
              <FallingStrikesGame
                onWin={onWin}
                onLose={onLose}
                // onChargeRound={onChargeRound}
              />
            )
          case "bullet-dodge":
            return (
              <BulletDodgeGame
                onWin={onWin}
                onLose={onLose}
                // onChargeRound={onChargeRound}
              />
            )
          case "target-shooter":
            return (
              <TargetShooterGame
                onWin={onWin}
                onLose={onLose}
                // onChargeRound={onChargeRound}
              />
            )
          default:
            return (
              <div className="flex h-[70vh] items-center justify-center">
                Unknown game
              </div>
            )
        }
      }}
    />
  )
}
