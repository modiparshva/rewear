import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Item from "@/lib/models/Item"
import User from "@/lib/models/User"
import { cookies } from "next/headers"

// GET - Fetch pending items for admin review
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    // Check admin authentication
    const userId = request.cookies.get("user_session_id")?.value
    const user = await User.findById(userId)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "pending"

    const items = await Item.find({ status })
      .populate("owner", "name email avatar location")
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({ items })
  } catch (error: any) {
    console.error("Fetch admin items error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
