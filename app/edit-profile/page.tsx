"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  bio: z.string().max(300).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof formSchema>

export default function EditProfilePage() {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
  })

  // Load current user info
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/user/profile")
        const { user } = await res.json()
        if (user) {
          setValue("name", user.name)
          setValue("email", user.email)
          setValue("bio", user.bio || "")
          setValue("city", user.location?.city || "")
          setValue("state", user.location?.state || "")
          setValue("country", user.location?.country || "")
          setAvatarPreview(user.avatar || null)
        }
      } catch {
        toast.error("Failed to load profile")
      }
    }
    loadProfile()
  }, [setValue])

  const onSubmit = async (data: ProfileFormValues) => {
    setLoading(true)
    try {
      const payload = {
        name: data.name,
        email: data.email,
        bio: data.bio || "",
        location: {
          city: data.city || "",
          state: data.state || "",
          country: data.country || "",
        },
      }

      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || "Update failed")

      toast.success("Profile updated successfully")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarPreview || "/placeholder.svg"} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>

            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" {...register("email")} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" rows={3} {...register("bio")} />
              {errors.bio && <p className="text-red-500 text-sm">{errors.bio.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" {...register("city")} />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" {...register("state")} />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" {...register("country")} />
              </div>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
