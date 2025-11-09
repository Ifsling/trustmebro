"use client"

import logoFullDark from "@/public/images/logo-full-dark.png"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo, useState } from "react"

type Item = { href: string; label: string }

const NAV: Item[] = [
  { href: "/profile/dashboard", label: "Dashboard" },
  { href: "/profile/games", label: "Games" },
  { href: "/profile/withdraw", label: "Withdraw" },
]

export default function ProfileSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const activeIdx = useMemo(() => {
    const idx = NAV.findIndex((i) => pathname.startsWith(i.href))
    return idx === -1 ? 0 : idx
  }, [pathname])

  return (
    <>
      {/* mobile top bar */}
      <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-default-200 bg-background px-4 md:hidden">
        <button
          onClick={() => setOpen(true)}
          className="rounded-md border border-default-200 px-3 py-1 text-sm"
        >
          Menu
        </button>
        <Link href="/profile/dashboard" className="ml-auto">
          <Image
            src={logoFullDark}
            alt="logo"
            width={140}
            height={60}
            className="h-7 w-auto"
          />
        </Link>
      </div>

      {/* sidebar rail */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-default-200 bg-background transition-transform duration-200 md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        <div className="flex h-16 items-center gap-2 px-4">
          <Link href="/profile/dashboard" className="flex items-center gap-2">
            <Image
              src={logoFullDark}
              alt="logo"
              width={200}
              height={88}
              className="h-8 w-auto"
            />
          </Link>
          <button
            className="ml-auto rounded-md border px-2 py-1 text-xs md:hidden"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>

        <nav className="mt-2 flex flex-col">
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "mx-3 my-1 rounded-lg px-3 py-2 text-sm transition-colors",
                i === activeIdx
                  ? "bg-warning/20 text-foreground"
                  : "text-foreground/80 hover:bg-default-100",
              ].join(" ")}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-auto" />
        </nav>

        {/* bottom profile button */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-default-200 p-4">
          <Link
            href="/profile/settings"
            className={[
              "block rounded-lg px-3 py-2 text-sm",
              pathname.startsWith("/profile/settings")
                ? "bg-warning/20"
                : "hover:bg-default-100",
            ].join(" ")}
            onClick={() => setOpen(false)}
          >
            Profile & Settings
          </Link>
        </div>
      </aside>

      {/* mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  )
}
