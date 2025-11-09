"use client"

import aboutUsImage from "@/public/images/about-us.png"
import { Button, Card, CardBody } from "@heroui/react"
import { motion } from "framer-motion"
import Image from "next/image"
import Footer from "../../components/Footer"
import NavbarSection from "../../components/Navbar"

export default function AboutPage() {
  return (
    <>
      <NavbarSection />

      <section className="relative bg-background text-foreground">
        {/* soft backdrop */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-1/3 left-1/2 h-[52rem] w-[52rem] -translate-x-1/2 rounded-full bg-warning/10 blur-3xl" />
          <div className="absolute -bottom-1/3 right-1/4 h-[40rem] w-[40rem] rounded-full bg-danger/10 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center">
          {/* LEFT: big claim + copy */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="text-5xl font-bold leading-tight tracking-tight md:text-6xl"
            >
              <span className="bg-gradient-to-r from-warning to-foreground bg-clip-text text-transparent">
                100%*
              </span>{" "}
              Success Rate
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="mt-6 text-base leading-relaxed text-foreground/80"
            >
              We run real, skill-based games with transparent entry fees, live
              prize pools, and auditable results. Users can bid, compete, and
              earn. Before access, every entrant acknowledges the monetary
              nature of play. Responsible gaming tools—spend caps, cool-offs,
              and identity verification—are built in.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="mt-8 grid grid-cols-3 gap-4"
            >
              <Card className="border border-default-200 bg-background/70 backdrop-blur">
                <CardBody className="items-center p-5">
                  <div className="text-3xl font-bold">32K+</div>
                  <div className="text-xs text-foreground/60">
                    Payouts processed
                  </div>
                </CardBody>
              </Card>
              <Card className="border border-default-200 bg-background/70 backdrop-blur">
                <CardBody className="items-center p-5">
                  <div className="text-3xl font-bold">$4.7M</div>
                  <div className="text-xs text-foreground/60">
                    Total prize pools
                  </div>
                </CardBody>
              </Card>
              <Card className="border border-default-200 bg-background/70 backdrop-blur">
                <CardBody className="items-center p-5">
                  <div className="text-3xl font-bold">99.99%</div>
                  <div className="text-xs text-foreground/60">
                    Uptime verified
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="mt-6 text-[5px] text-foreground/60"
            >
              * Success rate refers to tournament integrity (match start → prize
              settlement) under monitored conditions.
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-8"
            >
              <Button
                as={"a"}
                href="/faq"
                color="warning"
                radius="lg"
                className="px-6 font-medium"
              >
                Read FAQs
              </Button>
            </motion.div>
          </div>

          {/* RIGHT: image panel from provided path */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-2xl border border-default-200 bg-content1 shadow-2xl">
              <Image
                src={aboutUsImage}
                alt="About our platform"
                fill
                className="object-cover"
                priority
              />
              <div className="pointer-events-none absolute right-4 top-4 rounded-full border border-white/20 bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                Our Platform
              </div>
            </div>
          </motion.div>
        </div>

        {/* lower claim row from sketch: “We have made thousands of people millionaire” */}
        <div className="mx-auto max-w-7xl px-6 pb-20">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-default-200 bg-background/70 p-6 text-center shadow-sm backdrop-blur"
            >
              <p className="text-4xl font-semibold bg-linear-to-r from-warning via-danger to-warning bg-clip-text text-transparent">
                We've made <strong>THOUSANDS</strong> of people millionaires^
              </p>
              <p className="mt-2 text-sm text-foreground/60">
                Transparent brackets. Anti-cheat. Instant settlement after
                verification.
              </p>
            </motion.div>
          </div>
          <div className="flex justify-start text-[5px] mt-3">
            <p>^ = from billionaires</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
