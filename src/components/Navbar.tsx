"use client"

import logoFullDark from "@/public/images/logo-full-dark.png"
import logoFullLight from "@/public/images/logo-full-light.png"
import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function NavbarSection() {
  const router = useRouter()

  return (
    <Navbar
      maxWidth="xl"
      className="backdrop-blur bg-background/70 border-b border-default-200 shadow-sm"
    >
      <NavbarBrand onClick={() => router.push("/")} className="cursor-pointer">
        <Image
          src={logoFullLight}
          alt="TrustMeBro"
          width={200}
          height={88}
          className="w-28 dark:hidden h-auto"
          priority
        />
        <Image
          src={logoFullDark}
          alt="TrustMeBro"
          width={200}
          height={88}
          className="hidden dark:block w-28 h-auto"
          priority
        />
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-8" justify="center">
        <NavbarItem>
          <Link href="/" color="foreground">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/about" color="foreground">
            About
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/faq" color="foreground">
            FAQ
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/contact" color="foreground">
            Contact
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end" className="items-center gap-2">
        <NavbarItem className="hidden sm:flex">
          <Link
            href="/auth"
            className="text-sm text-foreground/80 hover:text-foreground"
          >
            Login
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Button
            as={Link}
            href="/auth"
            color="warning"
            variant="shadow"
            radius="lg"
            className="font-medium"
          >
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}
