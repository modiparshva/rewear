import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import Item from "@/lib/models/Item"
import User from "@/lib/models/User"
import { cookies } from "next/headers"

// GET - Fetch items with filters
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const condition = searchParams.get("condition")
    const size = searchParams.get("size")
    const search = searchParams.get("search")
    const sortBy = searchParams.get("sortBy") || "newest"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")

    // Build query
    const query: any = { status: "approved" } // Only show approved items

    if (category && category !== "All") {
      query.category = category
    }

    if (condition && condition !== "All") {
      query.condition = condition
    }

    if (size && size !== "All") {
      query.size = size
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ]
    }

    // Build sort
    let sort: any = {}
    switch (sortBy) {
      case "oldest":
        sort = { createdAt: 1 }
        break
      case "points-low":
        sort = { points: 1 }
        break
      case "points-high":
        sort = { points: -1 }
        break
      case "alphabetical":
        sort = { title: 1 }
        break
      default:
        sort = { createdAt: -1 }
    }

    // Execute query
    const items = await Item.find(query)
      .populate("owner", "name avatar rating totalSwaps location")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    const total = await Item.countDocuments(query)

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error("Fetch items error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create new item
export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    // Get user from session cookie
    const cookieStore = request.cookies;
    const userId = cookieStore.get("user_session_id")?.value
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { title, description, category, type, size, condition, tags, images } = await request.json()

    // Validate input
    if (!title || !description || !category || !size || !condition || !images?.length) {
      return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 })
    }

    // Get user location for item
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create new item
    const item = new Item({
      title,
      description,
      category,
      type,
      size,
      condition,
      tags: tags || [],
      images,
      owner: userId,
      location: user.location,
      status: "pending", // Items need admin approval
      points: 1,
    })

    await item.save()

    return NextResponse.json(
      {
        message: "Item submitted for review. It will appear in the marketplace once approved!",
        item: {
          id: item._id,
          title: item.title,
          status: item.status,
          potentialPoints: item.points, // Points based on condition
        },
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Create item error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
