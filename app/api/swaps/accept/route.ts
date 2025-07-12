import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import { SwapService } from "@/lib/services/swapService"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const userId = request.cookies.get("user_session_id")?.value
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { swapRequestId } = await request.json()

    if (!swapRequestId) {
      return NextResponse.json({ error: "Swap request ID is required" }, { status: 400 })
    }

    const acceptedSwap = await SwapService.acceptSwapRequest(swapRequestId, userId)

    return NextResponse.json(
      {
        message: "Swap request accepted and completed!",
        swap: {
          id: acceptedSwap._id,
          status: acceptedSwap.status,
        },
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("API Swap Accept Error:", error)
    return NextResponse.json({ error: error.message || "Failed to accept swap request" }, { status: 500 })
  }
}
