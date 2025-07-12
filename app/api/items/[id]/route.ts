import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Item from "@/lib/models/Item"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const item = await Item.findById(params.id).populate("owner", "name avatar rating totalSwaps location").lean()

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    // Increment view count
    await Item.findByIdAndUpdate(params.id, { $inc: { views: 1 } })

    return NextResponse.json({ item })
  } catch (error: any) {
    console.error("Fetch item error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
