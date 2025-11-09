import { GAMES } from "@/data/games"
import Image from "next/image"
import Link from "next/link"

export default function ProfileGames() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Games</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((g) => (
          <Link
            key={g.slug}
            href={`/game/${encodeURIComponent(g.slug)}`}
            className="group block overflow-hidden rounded-2xl border border-default-200 bg-content1 shadow-sm transition hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-warning/50"
          >
            <div className="relative aspect-[4/3]">
              {/* Local /public image preferred */}
              <Image
                src={g.thumbnail}
                alt={`${g.title} thumbnail`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
              />
              {/* subtle gradient overlay for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
            </div>

            <div className="p-4">
              <div className="font-medium">{g.title}</div>
              <p className="mt-1 line-clamp-2 text-xs text-foreground/60">
                {g.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
