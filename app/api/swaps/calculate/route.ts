import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import { SwapService } from "@/lib/services/swapService"

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { requestedItemId, offeredItemId } = await request.json()

    if (!requestedItemId) {
      return NextResponse.json({ error: "Requested item ID is required" }, { status: 400 })
    }

    const calculation = await SwapService.calculateSwapCost(requestedItemId, offeredItemId)

    return NextResponse.json(calculation)
  } catch (error: any) {
    console.error("API Swap Calculate Error:", error)
    return NextResponse.json({ error: error.message || "Failed to calculate swap cost" }, { status: 500 })
  }
}
