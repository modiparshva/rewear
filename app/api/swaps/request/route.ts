import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import { SwapService } from "@/lib/services/swapService"
import Swap from "@/lib/models/Swap"


export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const userId = request.cookies.get("user_session_id")?.value
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { requestedItem, offeredItem, message } = await request.json()

    if (!requestedItem) {
      return NextResponse.json({ error: "Requested item ID is required" }, { status: 400 })
    }

    // Fetch the requested item to get its owner
    const item = await (await import("@/lib/models/Item")).default.findById(requestedItem)
    if (!item) {
      return NextResponse.json({ error: "Requested item not found" }, { status: 404 })
    }

    if (item.owner.toString() === userId) {
      return NextResponse.json({ error: "Cannot swap with your own item" }, { status: 400 })
    }

    const swapRequest = await SwapService.createSwapRequest({
      requesterId: userId,
      ownerId: item.owner.toString(),
      requestedItemId: requestedItem,
      offeredItemId: offeredItem,
      message,
    })

    return NextResponse.json(
      {
        message: "Swap request sent successfully!",
        swapRequest: {
          id: swapRequest._id,
          status: swapRequest.status,
        },
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("API Swap Request Error:", error)
    return NextResponse.json({ error: error.message || "Failed to send swap request" }, { status: 500 })
  }
}



export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const userId = req.cookies.get("user_session_id")?.value
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    console.log("Fetching swap requests for user:", userId)

    // Fetch all swap requests where current user is the owner of the requested item
    const swaps = await Swap.find()
      .populate("requestedItem")
      .populate("offeredItem")
      .populate("requester", "name avatar")
      .sort({ createdAt: -1 })
      .lean()

    // console.log("Fetched swap requests:", swaps)

    return NextResponse.json({ requests: swaps })
  } catch (error: any) {
    console.error("GET /api/swaps/requests error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
