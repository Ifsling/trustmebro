"use client"

import { HeroUIProvider } from "@heroui/react"
import { ThemeProvider } from "next-themes"
import { Provider } from "react-redux"
import { store } from "../redux/store"

const Providers = ({ children }: { children: any }) => {
  return (
    <ThemeProvider attribute="class" enableSystem themes={["light", "dark"]}>
      <Provider store={store}>
        <HeroUIProvider>{children}</HeroUIProvider>
      </Provider>
    </ThemeProvider>
  )
}

export default Providers
