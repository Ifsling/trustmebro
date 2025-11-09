type Props = { params: { gamename: string } }

export default function GameRuntime({ params }: Props) {
  return (
    <div className="min-h-dvh w-full bg-background p-6 text-foreground">
      <h1 className="text-2xl font-semibold">
        Playing: {decodeURIComponent(params.gamename)}
      </h1>
      <div className="mt-6 h-[70vh] rounded-2xl border border-default-200 bg-content1" />
    </div>
  )
}
