import { FC } from "react"
import HeroPage from "../components/HeroPage"
import NavbarSection from "../components/Navbar"

const LandingPage: FC = () => {
  return (
    <>
      <NavbarSection />
      <HeroPage />
    </>
  )
}

export default LandingPage
