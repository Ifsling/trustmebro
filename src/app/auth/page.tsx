"use client"

import { createSupabaseBrowser } from "@/lib/supabase/client"
import heroImage from "@/public/images/login-background.png"
import logoFullDark from "@/public/images/logo-full-dark.png"
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
import { useState } from "react"

export default function AuthPage() {
  const router = useRouter()
  const supabase = createSupabaseBrowser()

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // --- LOGIN ---
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setError(null)
    const form = new FormData(e.currentTarget)
    const email = String(form.get("email") || "")
    const password = String(form.get("password") || "")

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)

    if (error) return setError(error.message)
    router.replace("/profile/dashboard")
  }

  // --- SIGNUP ---
  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setError(null)
    const form = new FormData(e.currentTarget)
    const email = String(form.get("email") || "")
    const password = String(form.get("password") || "")

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    setLoading(false)

    if (error) return setError(error.message)
    setMessage(
      "Verification email sent. Check your inbox to confirm your account."
    )
  }

  return (
    <section className="relative min-h-dvh w-dvw overflow-hidden">
      {/* Fullscreen BG */}
      <div className="fixed inset-0 pointer-events-none select-none">
        <Image
          src={heroImage}
          alt="Background"
          fill
          priority
          className="object-cover pointer-events-none select-none"
        />
      </div>

      {/* Gradient overlay (light/dark aware) */}
      <div
        aria-hidden
        className=" select-none pointer-events-none fixed inset-0 z-10 bg-linear-to-r from-black/80 via-black/50 to-transparent dark:from-black/85 dark:via-black/55"
      />

      {/* Clickable logo */}

      <div
        onClick={() => router.push("/")}
        className="absolute left-6 top-6 z-30 cursor-pointer select-none"
      >
        <Image
          src={logoFullDark}
          alt="TrustMeBro"
          width={200}
          height={88}
          className="h-10 w-auto"
          priority
        />
      </div>

      {/* Auth box */}
      <div className="relative z-20 flex min-h-dvh items-center">
        <div className="px-6 sm:px-10">
          <Card className="w-full max-w-md border border-default-200/70 bg-background/90 backdrop-blur-md">
            <CardBody className="p-6 sm:p-7">
              <Tabs
                aria-label="Auth Tabs"
                color="warning"
                variant="underlined"
                fullWidth
                classNames={{ tabContent: "font-semibold" }}
              >
                {/* LOGIN TAB */}
                <Tab key="login" title="Login">
                  <form className="mt-6 space-y-5" onSubmit={handleLogin}>
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      variant="bordered"
                      required
                    />
                    <Input
                      label="Password"
                      name="password"
                      type="password"
                      variant="bordered"
                      required
                    />
                    <div className="flex items-center justify-between">
                      <Checkbox size="sm">Remember me</Checkbox>
                      <Link href="#" className="text-sm">
                        Forgot password?
                      </Link>
                    </div>
                    <Button
                      color="warning"
                      radius="lg"
                      className="w-full font-medium"
                      type="submit"
                      isLoading={loading}
                    >
                      Login
                    </Button>
                  </form>
                </Tab>

                {/* SIGNUP TAB */}
                <Tab key="signup" title="Sign Up">
                  <form className="mt-6 space-y-5" onSubmit={handleSignup}>
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      variant="bordered"
                      required
                    />
                    <Input
                      label="Password"
                      name="password"
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
                      type="submit"
                      isLoading={loading}
                    >
                      Create Account
                    </Button>
                  </form>
                </Tab>
              </Tabs>

              {/* Info/Warning */}
              {(message || error) && (
                <div
                  className={`mt-5 rounded-lg border p-3 text-sm ${
                    error
                      ? "border-danger/40 bg-danger/10 text-danger"
                      : "border-success/40 bg-success/10 text-success"
                  }`}
                >
                  {error || message}
                </div>
              )}

              <div className="mt-5 rounded-lg border border-warning/30 bg-warning-50/25 p-3 text-xs text-foreground/80 dark:bg-warning/10">
                Warning: Games include monetary stakes. Play only if you
                understand the risks.
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  )
}
