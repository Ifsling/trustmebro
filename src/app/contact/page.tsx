"use client"

import contactUsImage from "@/public/images/contact-us.png"
import { Button, Input, Textarea } from "@heroui/react"
import { motion } from "framer-motion"
import Image from "next/image"
import Footer from "../../components/Footer"
import NavbarSection from "../../components/Navbar"

export default function ContactPage() {
  return (
    <>
      <NavbarSection />
      <section className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-5xl font-bold text-center mb-10"
          >
            Contact Us
          </motion.h1>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Contact form */}
            <motion.form
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                label="Full Name"
                placeholder="John Doe"
                variant="bordered"
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                variant="bordered"
                required
              />
              <Textarea
                label="Message"
                placeholder="Write your message here..."
                variant="bordered"
                minRows={5}
                required
              />
              <Button color="warning" size="lg" radius="lg" className="px-6">
                Send Message
              </Button>
            </motion.form>

            {/* Info section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-semibold">Get in Touch</h3>
              <p className="text-foreground/70">
                Have questions about how the system works, partnership
                opportunities, or reporting issues? Reach us anytime.
              </p>

              <div className="space-y-2 text-sm text-foreground/70">
                <p>
                  <strong>Email:</strong> support@trustmebro.com
                </p>
                <p>
                  <strong>Business Hours:</strong> Mon–Fri, 9 AM – 6 PM
                </p>
                <p></p>
              </div>

              <div className="bg-default-100 border border-default-200 rounded-xl flex items-center justify-center text-foreground/40 text-sm">
                <Image
                  src={contactUsImage}
                  alt="Contact Us"
                  className="object-contain h-full w-full rounded-xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
