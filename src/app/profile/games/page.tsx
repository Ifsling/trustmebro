export default function ProfileGames() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Games</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <a
            key={i}
            href={`/game/game-${i + 1}`}
            className="group block overflow-hidden rounded-2xl border border-default-200 bg-content1 shadow-sm transition hover:shadow-lg"
          >
            <div className="aspect-[4/3] bg-default-100" />
            <div className="p-4">
              <div className="font-medium">Game {i + 1}</div>
              <div className="mt-1 text-xs text-foreground/60">
                Skill-based. Click to play.
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
