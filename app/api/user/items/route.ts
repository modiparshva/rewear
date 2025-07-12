import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Item from "@/lib/models/Item"

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const cookieStore = req.cookies
    const userId = cookieStore.get("user_session_id")?.value

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const items = await Item.find({ owner: userId }).sort({ createdAt: -1 }).lean()

    return NextResponse.json({ items })
  } catch (error) {
    console.error("Fetch user items error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
