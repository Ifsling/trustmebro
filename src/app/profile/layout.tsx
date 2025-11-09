import type { ReactNode } from "react"
import ProfileSidebar from "../../components/ProfileSidebar"

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh w-full bg-background text-foreground">
      {/* sidebar (client) */}
      <ProfileSidebar />
      {/* content column */}
      <div className="md:pl-64">
        <main className="p-6 md:p-10">{children}</main>
      </div>
    </div>
  )
}
