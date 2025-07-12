import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Item from "@/lib/models/Item"
import User from "@/lib/models/User"
import { cookies } from "next/headers"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    // Check admin authentication
    const userId = request.cookies.get("user_session_id")?.value
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const admin = await User.findById(userId)
    if (!admin || (admin.role !== "admin" && admin.role !== "moderator")) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { reason } = await request.json()

    // Find and reject item
    const item = await Item.findById(params.id)
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    if (item.status !== "pending") {
      return NextResponse.json({ error: "Item is not pending approval" }, { status: 400 })
    }

    // Update item status
    item.status = "rejected"
    item.rejectionReason = reason || "Item does not meet quality standards"
    await item.save()

    return NextResponse.json({
      message: "Item rejected successfully",
      item: {
        id: item._id,
        title: item.title,
        status: item.status,
        rejectionReason: item.rejectionReason,
      },
    })
  } catch (error: any) {
    console.error("Reject item error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
