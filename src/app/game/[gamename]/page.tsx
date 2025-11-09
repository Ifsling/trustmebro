import { use } from "react"
import GameClient from "./runtime"

export default function Page({
  params,
  searchParams,
}: {
  params: Promise<{ gamename: string }>
  searchParams: Promise<{ session?: string }>
}) {
  const { gamename } = use(params)
  const { session } = use(searchParams)
  const slug = decodeURIComponent(gamename || "")
  return <GameClient gameSlug={slug} sessionId={session} />
}
