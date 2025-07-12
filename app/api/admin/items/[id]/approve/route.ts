import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Item from "@/lib/models/Item"
import User from "@/lib/models/User"
import PointsTransaction from "@/lib/models/PointsTransaction"
import { cookies } from "next/headers"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    // Check admin authentication
    const userId = cookies().get("user_session_id")?.value
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const admin = await User.findById(userId)
    if (!admin || (admin.role !== "admin" && admin.role !== "moderator")) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Find and approve item
    const item = await Item.findById(params.id).populate("owner")
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    if (item.status !== "pending") {
      return NextResponse.json({ error: "Item is not pending approval" }, { status: 400 })
    }

    // Update item status
    item.status = "approved"
    item.approvedAt = new Date()
    item.approvedBy = admin._id
    await item.save()

    // Award points to item owner
    const listingPoints = item.points // Use item's calculated points
    await User.findByIdAndUpdate(item.owner._id, {
      $inc: { points: listingPoints },
    })

    // Create points transaction
    const transaction = new PointsTransaction({
      user: item.owner._id,
      type: "earned",
      amount: listingPoints,
      description: `Points earned for approved item: ${item.title}`,
      relatedItem: item._id,
    })
    await transaction.save()

    return NextResponse.json({
      message: "Item approved successfully",
      item: {
        id: item._id,
        title: item.title,
        status: item.status,
        pointsAwarded: listingPoints,
      },
    })
  } catch (error: any) {
    console.error("Approve item error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
