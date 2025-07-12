"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Recycle, User, LogOut, LayoutDashboard, Shield, Settings, LogIn } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface User {
  name: string
  avatar?: string
  role: "user" | "admin"
}

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile", { credentials: "include" })
        if (!res.ok) throw new Error("Not authenticated")
        const data = await res.json()
        setUser(data.user)
      } catch {
        setUser(null)
      }
    }

    fetchProfile()
  }, [])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    location.reload() // Reload to update UI
  }

  const isActive = (href: string) => pathname.startsWith(href)

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Recycle className="h-8 w-8 text-green-600" />
          <span className="text-2xl font-bold text-gray-900">ReWear</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/browse" className={cn("hover:text-gray-900", isActive("/browse") ? "text-green-600 font-medium" : "text-gray-600")}>
            Browse
          </Link>
          <Link href="/items/new" className={cn("hover:text-gray-900", isActive("/items/new") ? "text-green-600 font-medium" : "text-gray-600")}>
            List Item
          </Link>
          <Link href="/dashboard" className={cn("hover:text-gray-900", isActive("/dashboard") ? "text-green-600 font-medium" : "text-gray-600")}>
            Dashboard
          </Link>
        </nav>

        {/* Auth/User */}
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link href="/login" className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
                <LogIn className="w-4 h-4" />
                Login
              </Link>
              <Link href="/signup" className="text-green-600 font-semibold border px-3 py-1 rounded hover:bg-green-100">
                Sign Up
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatar || ""} />
                  <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>
                  <User className="w-4 h-4 mr-2" />
                  {user.name}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem onClick={() => router.push("/admin")}>
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
