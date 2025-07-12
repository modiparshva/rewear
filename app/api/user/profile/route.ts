import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import User from "@/lib/models/User"

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const userId = req.cookies.get("user_session_id")?.value

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await User.findById(userId).lean()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userResponse = {
      id: user?._id.toString(),
      name: user?.name,
      email: user?.email,
      avatar: user?.avatar,
      points: user?.points,
      rating: user?.rating || 4.5,
      totalRatings: user?.totalRatings || 10,
      totalSwaps: user?.totalSwaps || 0,
      location: user?.location || { city: "N/A", state: "", country: "" },
      joinDate: user?.createdAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      }),
      role: user?.role,
    }

    return NextResponse.json({ user: userResponse }, { status: 200 })
  } catch (err) {
    console.error("Profile fetch error:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}