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

      <Footer />
    </section>
  )
}
