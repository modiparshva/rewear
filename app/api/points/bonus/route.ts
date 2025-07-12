import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import { SwapService } from "@/lib/services/swapService"
import { cookies } from "next/headers"
import User from "@/lib/models/User"

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const userId = request.cookies.get("user_session_id")?.value
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // For demonstration, only admins can award bonus points
    const user = await User.findById(userId)
    if (!user || (user.role !== "admin" && user.role !== "moderator")) {
      return NextResponse.json({ error: "Admin access required to award bonus points" }, { status: 403 })
    }

    const { targetUserId, amount, description, relatedItemId } = await request.json()

    if (!targetUserId || !amount || !description) {
      return NextResponse.json({ error: "Target user ID, amount, and description are required" }, { status: 400 })
    }

    const { user: updatedUser, transaction } = await SwapService.awardBonusPoints(
      targetUserId,
      amount,
      description,
      relatedItemId,
    )

    return NextResponse.json(
      {
        message: `Successfully awarded ${amount} points to ${updatedUser.name}`,
        transaction,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("API Bonus Points Error:", error)
    return NextResponse.json({ error: error.message || "Failed to award bonus points" }, { status: 500 })
  }
}
