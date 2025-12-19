"use client"

import { createSupabaseBrowser } from "@/lib/supabase/client"
import { Button } from "@heroui/react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export default function SettingsPage() {
  const supabase = createSupabaseBrowser()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  // Form State
  const [fullName, setFullName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // 1. Fetch initial profile data
  useEffect(() => {
    const getProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/login")
          return
        }

        setUserId(user.id)

        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", user.id)
          .single()

        if (error && error.code !== "PGRST116") {
          throw error
        }

        if (data) {
          setFullName(data.full_name || "")
          setAvatarUrl(data.avatar_url)
        }
      } catch (error) {
        console.error("Error loading user data!", error)
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [supabase, router])

  // 2. Handle Image Selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return
    }
    const file = event.target.files[0]
    setAvatarFile(file)
    setPreviewUrl(URL.createObjectURL(file)) // Immediate local preview
  }

  // 3. Save Changes
  const updateProfile = async () => {
    try {
      setUpdating(true)
      if (!userId) throw new Error("No user")

      let finalAvatarUrl = avatarUrl

      // A. If a new file was selected, upload it
      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop()
        const fileName = `${userId}-${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile)

        if (uploadError) throw uploadError

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(filePath)

        finalAvatarUrl = publicUrl
      }

      // B. Update Profile Table
      const updates = {
        id: userId,
        full_name: fullName,
        avatar_url: finalAvatarUrl,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from("profiles").upsert(updates)

      if (error) throw error

      alert("Profile updated successfully!")
      router.refresh() // Refresh server components if needed
    } catch (error) {
      alert("Error updating the data!")
      console.error(error)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <div className="p-8">Loading settings...</div>

  return (
    <div className="mx-auto max-w-2xl p-4 md:p-8">
      <h1 className="mb-8 text-2xl font-bold">Profile & Settings</h1>

      <div className="rounded-xl border border-default-200 bg-background p-6 shadow-sm">
        {/* Avatar Section */}
        <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border border-default-200 bg-default-100">
            {previewUrl || avatarUrl ? (
              <Image
                src={previewUrl || avatarUrl || ""}
                alt="Avatar"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl text-default-400">
                {(fullName?.[0] || "U").toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-medium">Profile Photo</h3>
            <div className="text-xs text-default-500">
              Recommended: Square JPG, PNG. Max 2MB.
            </div>
            <div>
              <input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="rounded-md border border-default-300 px-3 py-1.5 text-sm font-medium hover:bg-default-100"
              >
                Upload New Photo
              </button>
            </div>
          </div>
        </div>

        {/* Name Section */}
        <div className="mb-6">
          <label htmlFor="fullName" className="mb-2 block text-sm font-medium">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName || ""}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg border border-default-300 bg-transparent px-4 py-2 text-foreground focus:border-warning focus:outline-none focus:ring-1 focus:ring-warning"
            placeholder="Enter your name"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={updateProfile}
            disabled={updating}
            className="rounded-lg bg-warning px-6 py-2.5 text-sm font-semibold text-black hover:bg-warning/90 disabled:opacity-50"
          >
            {updating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-danger-200 bg-background p-6 shadow-lg shadow-danger-200 mt-10">
        <h1 className="font-bold">DANGER ZONE</h1>

        <Button
          className="w-full mt-3"
          onPress={() => {
            supabase.auth.signOut()
            router.push("/")
          }}
          color="danger"
          variant="ghost"
        >
          Log Out
        </Button>
      </div>
    </div>
  )
}
