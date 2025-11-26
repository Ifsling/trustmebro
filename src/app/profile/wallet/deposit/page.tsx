"use client"

import { purchaseTokens } from "@/lib/wallet"
import { Button, Input } from "@heroui/react"
import { useState } from "react"

export default function DepositPage() {
  const [amount, setAmount] = useState(100)
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">Buy Tokens</h1>
      <Input
        label="Amount"
        type="number"
        min={1}
        value={String(amount)}
        onChange={(e) => setAmount(Math.max(1, Number(e.target.value || 0)))}
      />
      <Button
        color="warning"
        isLoading={loading}
        onPress={async () => {
          setLoading(true)
          try {
            const b = await purchaseTokens(amount)
            setBalance(b)
          } finally {
            setLoading(false)
          }
        }}
      >
        Add Tokens (placeholder)
      </Button>
      {balance !== null && (
        <div className="text-sm">New balance: {balance}</div>
      )}
      <div className="text-xs text-foreground/60">
        Payment provider integration pending.
      </div>
    </div>
  )
}
