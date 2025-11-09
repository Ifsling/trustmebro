export default function WithdrawPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Withdraw</h1>

      <div className="rounded-2xl border border-default-200 bg-background/80 p-6 backdrop-blur">
        <div className="text-xl">
          Your Balance: <span className="font-semibold">$xx.xx</span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <button className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-default-200 bg-content1 p-10 text-center shadow-sm hover:bg-default-100">
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

          <div className="relative rounded-2xl border border-warning/40 bg-warning/10 p-6 shadow-[0_0_0_2px_rgba(234,179,8,0.25)_inset]">
            <div className="text-lg font-semibold">Limited Boost</div>
            <div className="mt-2 text-sm">
              Make it <span className="font-semibold">($B) × 9.6</span> now
            </div>
            <div className="mt-1 text-xs text-foreground/70">
              Offer ends in: 5 mins
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
