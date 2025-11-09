"use client"

import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Input,
  Link,
  Tab,
  Tabs,
} from "@heroui/react"
import Image from "next/image"
import { useRouter } from "next/navigation"

// BG image (must exist)
import heroImage from "@/public/images/login-background.png"

// Light/Dark logos (use your existing files)
import logoFullDark from "@/public/images/logo-full-dark.png"

export default function AuthPage() {
  const router = useRouter()

  return (
    <section className="relative min-h-dvh w-dvw overflow-hidden">
      {/* FULLSCREEN BG (always covers viewport) */}
      <div className="fixed inset-0">
        <Image
          src={heroImage}
          alt="Background"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* THEME GRADIENT OVERLAY (left→right reveal) */}
      <div
        aria-hidden
        className="
          pointer-events-none fixed inset-0 z-10
          bg-linear-to-r
          from-black/85 via-black/55 to-transparent
        "
      />

      {/* CLICKABLE LOGO (top-left) */}
      <Image
        src={logoFullDark}
        alt="TrustMeBro"
        width={200}
        height={88}
        onClick={() => router.push("/")}
        className="absolute left-20 top-4 z-20 h-13 w-auto cursor-pointer"
        priority
      />

      {/* LEFT-SIDE AUTH BOX (vertically centered) */}
      <div className="relative z-10 flex min-h-dvh items-center">
        <div className="px-6 sm:px-10">
          <Card className="w-full max-w-md border border-default-200/70 bg-background/90 backdrop-blur">
            <CardBody className="p-6 sm:p-7">
              <Tabs
                aria-label="Auth Tabs"
                color="warning"
                variant="underlined"
                fullWidth
                classNames={{ tabContent: "font-semibold" }}
              >
                <Tab key="login" title="Login">
                  <form
                    className="mt-6 space-y-5"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <Input
                      label="Email"
                      type="email"
                      variant="bordered"
                      required
                    />
                    <Input
                      label="Password"
                      type="password"
                      variant="bordered"
                      required
                    />
                    <div className="flex items-center justify-between">
                      <Checkbox size="sm">Remember me</Checkbox>
                      <Link href="/reset" className="text-sm">
                        Forgot password?
                      </Link>
                    </div>
                    <Button
                      color="warning"
                      radius="lg"
                      className="w-full font-medium"
                    >
                      Login
                    </Button>
                  </form>
                </Tab>

                <Tab key="signup" title="Sign Up">
                  <form
                    className="mt-6 space-y-5"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <Input label="Full Name" variant="bordered" required />
                    <Input
                      label="Email"
                      type="email"
                      variant="bordered"
                      required
                    />
                    <Input
                      label="Password"
                      type="password"
                      variant="bordered"
                      required
                    />
                    <Checkbox size="sm" required>
                      I acknowledge this platform involves real money and I
                      agree to the Terms.
                    </Checkbox>
                    <Button
                      color="warning"
                      radius="lg"
                      className="w-full font-medium"
                    >
                      Create Account
                    </Button>
                  </form>
                </Tab>
              </Tabs>

              <div className="mt-5 rounded-lg border border-warning/30 bg-warning-50/25 p-3 text-xs text-foreground/80 dark:bg-warning/10">
                Warning: Games include monetary stakes. Play only if you
                understand the risks. Use spending limits.
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  )
}
