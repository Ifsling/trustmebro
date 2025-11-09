"use client"

import { Button, Card, CardBody, Chip, Link as UILink } from "@heroui/react"

type Props = {
  userEmail: string
  balanceCents: number
  totalWinsTodayCents: number
}

export default function DashboardClient({
  userEmail,
  balanceCents,
  totalWinsTodayCents,
}: Props) {
  return (
    <main className="p-6 md:p-10">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Chip variant="flat" color="warning">
          {userEmail}
        </Chip>
      </header>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border border-default-200 bg-background/80 backdrop-blur">
          <CardBody className="p-6">
            <div className="text-sm text-foreground/60">Your Balance</div>
            <div className="mt-2 text-4xl font-bold">
              ${(balanceCents / 100).toLocaleString()}
            </div>
            <div className="mt-6">
              <Button
                as={UILink}
                href="/wallet/deposit"
                color="warning"
                radius="lg"
                className="font-medium flex items-center gap-2"
              >
                Load Balance
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                  />
                </svg>
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card className="border border-default-200 bg-background/80 backdrop-blur">
          <CardBody className="p-6">
            <div className="text-sm text-foreground/60">Total Wins Today</div>
            <div className="mt-2 text-4xl font-bold">
              ${(totalWinsTodayCents / 100).toLocaleString()}
            </div>
            <div className="mt-4 text-xs text-foreground/60">
              Aggregates all settled matches for today (UTC).
            </div>
          </CardBody>
        </Card>
      </section>

      <section className="mt-8 rounded-2xl border border-dashed border-default-200 p-6 text-foreground/60">
        Add charts, recent matches, and leaderboards here.
      </section>
    </main>
  )
}
