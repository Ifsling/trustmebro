"use client"

import { Accordion, AccordionItem } from "@heroui/react"
import { motion } from "framer-motion"
import Footer from "../../components/Footer"
import NavbarSection from "../../components/Navbar"

export default function FAQPage() {
  return (
    <>
      <NavbarSection />
      <section className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-5xl font-bold text-center mb-10"
          >
            Frequently Asked Questions
          </motion.h1>

          <Accordion variant="bordered">
            <AccordionItem key="1" title="Is this platform legitimate?">
              Yes. Our platform is operated under verified compliance standards
              with secure payment gateways and verified transaction handling.
            </AccordionItem>

            <AccordionItem key="2" title="Can I really earn money by playing?">
              Absolutely. Players earn through skill-based challenges and
              tournaments. Each match has a transparent entry fee and prize
              pool. The outcome is entirely skill-driven.
            </AccordionItem>

            <AccordionItem key="3" title="How do I withdraw my winnings?">
              Withdrawals can be made directly to your verified account or
              supported e-wallets. We maintain strict anti-fraud systems to
              ensure safe transfers.
            </AccordionItem>

            <AccordionItem key="4" title="Is this gambling?">
              No. It’s a skill-based earning platform. While players can place
              bids, outcomes depend purely on skill and reaction — not chance.
            </AccordionItem>

            <AccordionItem key="5" title="Is there an age restriction?">
              Yes. Users must be at least 18 years old to register and
              participate.
            </AccordionItem>
          </Accordion>
        </div>
      </section>
      <Footer />
    </>
  )
}
