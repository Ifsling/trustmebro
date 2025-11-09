"use client"

import { Link } from "@heroui/react"

const nav = {
  Product: [
    { label: "Home", href: "/" },
    { label: "Pricing", href: "/" },
    { label: "Docs", href: "/" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy", href: "/" },
    { label: "Terms", href: "/" },
    { label: "Cookies", href: "/" },
  ],
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-default-200">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* top */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* brand */}
          <div className="space-y-3">
            <div className="text-xl font-semibold">TrustMeBro</div>
            <p className="text-foreground/60 text-sm">
              Serious website for serious people by serious people.
            </p>
          </div>

          {/* columns */}
          {Object.entries(nav).map(([title, items]) => (
            <div key={title} className="space-y-3">
              <div className="text-sm font-semibold uppercase tracking-wide text-foreground/80">
                {title}
              </div>
              <ul className="space-y-2">
                {items.map((it) => (
                  <li key={it.label}>
                    <Link
                      href={it.href}
                      className="text-sm text-foreground/70 hover:text-foreground"
                    >
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* divider */}
        <div className="my-8 h-px w-full bg-default-200" />

        {/* bottom */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-foreground/60">
            © {year} TrustMeBro. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="https://x.com/"
              aria-label="X"
              className="text-foreground/60 hover:text-foreground"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M18.244 2H21l-6.486 7.41L22 22h-5.873l-4.59-6.002L5.95 22H3.2l6.93-7.92L2 2h6.02l4.17 5.54L18.244 2Zm-1.03 18h1.71L7.87 4H6.07L17.214 20Z" />
              </svg>
            </Link>
            <Link
              href="https://youtube.com/"
              aria-label="YouTube"
              className="text-foreground/60 hover:text-foreground"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M23.5 7.2a4.8 4.8 0 0 0-3.38-3.39C18.3 3.2 12 3.2 12 3.2s-6.3 0-8.12.61A4.8 4.8 0 0 0 .5 7.2 49 49 0 0 0 0 12a49 49 0 0 0 .5 4.8 4.8 4.8 0 0 0 3.38 3.39C5.7 20.8 12 20.8 12 20.8s6.3 0 8.12-.61a4.8 4.8 0 0 0 3.38-3.39A49 49 0 0 0 24 12a49 49 0 0 0-.5-4.8ZM9.6 15.52V8.48L15.82 12 9.6 15.52Z" />
              </svg>
            </Link>
            <Link
              href="mailto:support@trustmebro.fake"
              className="text-foreground/60 hover:text-foreground text-xs"
            >
              support@trustmebro.com
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
