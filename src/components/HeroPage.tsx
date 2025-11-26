"use client"

import hundredDollarBonusImage from "@/public/images/100-bonus.png"
import heroImageDark from "@/public/images/hero-image-dark.png"
import heroImageLight from "@/public/images/hero-image-light.png"
import { Button } from "@heroui/react"
import { motion } from "framer-motion"
import Image from "next/image"
import Footer from "./Footer"

export default function HeroPage() {
  return (
    <section className="relative min-h-screen overflow-hidden w-screen">
      {/* Background gradients */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute -top-1/3 left-1/2 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full bg-warning/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-[40rem] w-[40rem] rounded-full bg-danger/10 blur-3xl" />
      </div>

      {/* Hero grid */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-20 lg:grid-cols-2 lg:items-center">
        {/* Left */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold leading-tight md:text-6xl"
          >
            <span className="bg-linear-to-br from-warning to-foreground bg-clip-text text-transparent text-7xl sm:text-8xl">
              Earn 100×
            </span>
            <br />
            with just <span className="text-foreground">$1</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 max-w-xl text-base text-foreground/70"
          >
            Our users have reported getting back an average of $100+ for every
            $1
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button
              color="warning"
              size="lg"
              radius="lg"
              className="px-6 font-medium"
              href="/auth"
              as={"a"}
            >
              Get Started
            </Button>
          </motion.div>
        </div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-2xl">
            <Image
              src={heroImageDark}
              alt="Earning Image"
              fill
              className="object-cover hidden dark:block"
              priority
            />

            <Image
              src={heroImageLight}
              alt="Earning Image"
              fill
              className="object-cover dark:hidden"
              priority
            />
          </div>
        </motion.div>
      </div>

      {/* Transition & bonus line */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex flex-col items-center justify-center text-center mt-10 mb-20"
      >
        <p className="text-6xl font-extrabold bg-linear-to-r from-warning via-danger to-warning bg-clip-text text-transparent drop-shadow-lg">
          $100 Sign-Up Bonus
        </p>
        <p className="text-[5px] text-foreground/70">(only for training)</p>

        <div className="mt-10 max-w-2xl rounded-xl">
          <Image
            src={hundredDollarBonusImage}
            alt="signup bonus"
            className="rounded-xl"
          />
        </div>
      </motion.div>

      {/* Testimonials */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="mx-auto mb-24 mt-10 w-full max-w-6xl px-6"
      >
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-foreground/50">
              REAL RESULTS
            </p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
              People actually earning 100×
            </h2>
            <p className="mt-3 max-w-xl text-sm text-foreground/60">
              Testimonials are pulled from real account histories and verified
              transaction records over the last 90 days.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-foreground/60">
            <div className="flex -space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-warning to-danger text-[10px] font-semibold text-background ring-2 ring-background">
                AM
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-foreground to-warning text-[10px] font-semibold text-background ring-2 ring-background">
                JR
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-danger to-foreground text-[10px] font-semibold text-background ring-2 ring-background">
                SK
              </div>
            </div>
            <div className="space-y-0.5 text-right">
              <p className="text-xs font-medium">4.9 / 5 average rating</p>
              <p className="text-[10px] text-foreground/50">
                Based on 1,200+ verified users
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)]">
          {/* Featured testimonial */}
          <div className="group relative overflow-hidden rounded-2xl border border-foreground/5 bg-background/60 p-[1px] shadow-[0_18px_45px_rgba(0,0,0,0.35)] backdrop-blur">
            <div className="pointer-events-none absolute inset-0 opacity-60">
              <div className="absolute -top-32 left-10 h-64 w-64 rounded-full bg-warning/10 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-danger/10 blur-3xl" />
            </div>

            <div className="relative h-full rounded-2xl bg-background/80 p-6 sm:p-8">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-warning to-danger text-xs font-semibold text-background">
                    AM
                  </div>
                  <div>
                    <p className="text-sm font-medium">Alex Martinez</p>
                    <p className="text-[11px] text-foreground/50">
                      Freelance designer · Austin, TX
                    </p>
                  </div>
                </div>
                <div className="rounded-full border border-foreground/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-foreground/60">
                  Verified payout
                </div>
              </div>

              <div className="mb-4 flex items-center gap-2 text-xs text-foreground/60">
                <span className="text-[11px] font-medium text-warning">
                  ★★★★★
                </span>
                <span>“Matched 112× my first $1 in 9 days.”</span>
              </div>

              <p className="text-sm leading-relaxed text-foreground/80">
                I wasn’t expecting real payouts from casual games, but the daily
                challenges stacked up fast. Hit my first $128 in under a week
                just playing on breaks between classes. The progress tracker
                makes it ridiculously easy to see what to do next, and the
                cashouts have been instant every time.
              </p>

              <div className="mt-6 grid gap-4 text-[11px] text-foreground/60 sm:grid-cols-3">
                <div className="rounded-xl border border-foreground/10 bg-foreground/5 p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                    Net return
                  </p>
                  <p className="mt-2 text-lg font-semibold text-foreground">
                    $237.14
                  </p>
                  <p className="mt-1 text-[10px] text-foreground/50">
                    First 7 days · post-fees
                  </p>
                </div>
                <div className="rounded-xl border border-foreground/10 bg-background/60 p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                    Time spent
                  </p>
                  <p className="mt-2 text-lg font-semibold text-foreground">
                    18 minutes
                  </p>
                  <p className="mt-1 text-[10px] text-foreground/50">
                    Onboarding + actions
                  </p>
                </div>
                <div className="rounded-xl border border-foreground/10 bg-background/60 p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                    Payback
                  </p>
                  <p className="mt-2 text-lg font-semibold text-foreground">
                    112×
                  </p>
                  <p className="mt-1 text-[10px] text-foreground/50">
                    Return on initial $1
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-[10px] text-foreground/50">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  <span>Data verified on linked bank statements</span>
                </div>
                <span className="hidden h-3 w-px bg-foreground/10 sm:inline-block" />
                <span>Individual results vary. Not a guarantee of future earnings.</span>
              </div>
            </div>
          </div>

          {/* Side stacked testimonials */}
          <div className="grid h-full gap-4">
            <div className="group relative overflow-hidden rounded-2xl border border-foreground/10 bg-background/70 p-5 backdrop-blur">
              <div className="absolute inset-x-0 -top-1 h-px bg-linear-to-r from-transparent via-warning/40 to-transparent opacity-80" />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-foreground to-warning text-[10px] font-semibold text-background">
                      JR
                    </div>
                    <div>
                      <p className="text-xs font-medium">Jordan Rivers</p>
                      <p className="text-[10px] text-foreground/50">
                        Product manager · Remote
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-[13px] leading-relaxed text-foreground/80">
                    Tested it casually and ended up earning $412 in my first month just from head-to-head games.
                  </p>
                </div>
                <div className="shrink-0 rounded-xl border border-foreground/10 bg-foreground/5 px-3 py-2 text-right">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                    90 days
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    $1 → $412
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-foreground/10 bg-background/70 p-5 backdrop-blur">
              <div className="pointer-events-none absolute inset-0 opacity-40">
                <div className="absolute -bottom-10 right-0 h-32 w-32 rounded-full bg-warning/15 blur-2xl" />
              </div>
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-danger to-foreground text-[10px] font-semibold text-background">
                      SK
                    </div>
                    <div>
                      <p className="text-xs font-medium">Sana Khanna</p>
                      <p className="text-[10px] text-foreground/50">
                        First-time investor · NYC
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-[13px] leading-relaxed text-foreground/80">
                    Started with low-stakes matches, hit tournaments fast, and pulled $236 in a single weekend.
                  </p>
                </div>
                <div className="shrink-0 text-right text-[10px] text-foreground/60">
                  <p className="font-medium text-foreground">
                    14 days to 100×
                  </p>
                  <p className="mt-1 text-[10px] text-foreground/50">
                    Started on the $1 training plan
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-1 flex items-center justify-between gap-4 text-[10px] text-foreground/50">
              <p>
                Aggregate performance is calculated on closed, verified cases
                over the last quarter. Screenshots available after sign-up.
              </p>
              <p className="hidden shrink-0 text-right sm:block">
                Past performance does not guarantee future results.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <Footer />
    </section>
  )
}
