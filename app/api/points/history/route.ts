import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import { SwapService } from "@/lib/services/swapService"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const userId = request.cookies.get("user_session_id")?.value
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const history = await SwapService.getPointsHistory(userId, limit, offset)

    return NextResponse.json({ history })
  } catch (error: any) {
    console.error("API Points History Error:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch points history" }, { status: 500 })
  }
}
