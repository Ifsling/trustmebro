"use client"

import { createSupabaseBrowser } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

function BoostClock() {
  const [totalRotation, setTotalRotation] = useState(0)

  useEffect(() => {
    let frameId: number
    let lastTime = performance.now()
    const fullRotationMs = 5000 // minute hand: 5s per full rotation

    const loop = (now: number) => {
      const delta = now - lastTime
      lastTime = now

      setTotalRotation((prev) => prev + (360 * delta) / fullRotationMs)

      frameId = requestAnimationFrame(loop)
    }

    frameId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frameId)
  }, [])

  const minuteAngle = totalRotation % 360
  const hourStep = Math.floor(totalRotation / 360) % 4 // 0,1,2,3
  const hourAngle = hourStep * 90 // 0,90,180,270 → 12,3,6,9

  return (
    <div className="relative h-10 w-10 shrink-0">
      <div className="absolute inset-0 rounded-full border border-warning/60 bg-warning/5" />
      {/* center pivot */}
      <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-warning" />
      {/* hour hand (jumps 12→3→6→9 but animates between) */}
      <div
        className="absolute left-1/2 top-1/2 h-3 w-[2px] origin-bottom bg-warning/70 transition-transform duration-500 ease-out"
        style={{
          transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`,
        }}
      />
      {/* minute hand (continuous) */}
      <div
        className="absolute left-1/2 top-1/2 h-4 w-[2px] origin-bottom bg-warning"
        style={{
          transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)`,
        }}
      />
    </div>
  )
}

export default function WithdrawPage() {
  const [balance, setBalance] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<"error" | "success">("success")
  const router = useRouter()

  const displayBalance = balance / 10
  const minWithdraw = 500

  useEffect(() => {
    const fetchBalance = async () => {
      const supabase = createSupabaseBrowser()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data } = await supabase
        .from("wallets")
        .select("balance")
        .eq("user_id", user.id)
        .single()

      setBalance(data?.balance ?? 0)
    }

    fetchBalance()
  }, [])

  const handleWithdrawClick = () => {
    if (displayBalance < minWithdraw) {
      setModalType("error")
      setShowModal(true)
      return
    }

    // Here you would trigger the real withdraw flow.
    setModalType("success")
    setShowModal(true)
  }

  return (
    <>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm rounded-2xl border border-default-200 bg-background p-6 shadow-xl">
            {modalType === "error" ? (
              <>
                <div className="text-lg font-semibold text-danger">
                  Withdrawal blocked
                </div>
                <p className="mt-2 text-sm text-foreground/80">
                  Minimum withdrawable balance is ${minWithdraw.toFixed(2)}.
                  Your current balance is ${displayBalance.toFixed(2)}.
                </p>
              </>
            ) : (
              <>
                <div className="text-lg font-semibold text-success">
                  Withdrawal requested
                </div>
                <p className="mt-2 text-sm text-foreground/80">
                  Your balance of ${displayBalance.toFixed(2)} has been marked
                  for withdrawal to your bank.
                </p>
              </>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8">
        <h1 className="text-2xl font-semibold">Withdraw</h1>

        <div className="rounded-2xl border border-default-200 bg-background/80 p-6 backdrop-blur">
          <div className="text-xl">
            Your Balance:{" "}
            <span className="font-semibold">${displayBalance.toFixed(2)}</span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div
              className="relative flex cursor-pointer items-center justify-between rounded-2xl border border-warning/40 bg-warning/10 p-6 shadow-[0_0_0_2px_rgba(234,179,8,0.25)_inset]"
              onClick={() => {
                router.push("/profile/games")
              }}
            >
              <div>
                <div className="text-lg font-semibold">Limited Boost</div>
                <div className="mt-2 text-3xl">
                  Make it{" "}
                  <span className="text-4xl font-semibold text-warning">
                    ${(displayBalance * 6.9).toFixed(2)}
                  </span>{" "}
                  now
                </div>
                <div className="mt-1 text-xs text-foreground/70">
                  Offer ends in: 5 mins
                </div>
              </div>

              <BoostClock />
            </div>

            <button
              type="button"
              onClick={handleWithdrawClick}
              className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-default-200 bg-content1 p-10 text-center shadow-sm hover:bg-default-100"
            >
              <div className="rounded-xl border border-default-200 p-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-10 w-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m0-15L7.5 9m4.5-4.5L16.5 9"
                  />
                </svg>
              </div>
              <div className="text-sm">Withdraw to Bank</div>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
