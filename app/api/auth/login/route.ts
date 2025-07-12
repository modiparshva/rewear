import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import User from "@/lib/models/User"

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    if (user.status !== "active") {
      return NextResponse.json({ error: "Account is suspended or banned" }, { status: 403 })
    }

    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      points: user.points,
      role: user.role,
      avatar: user.avatar,
    }

    // Create the response
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: userResponse,
      },
      { status: 200 }
    )

    // Set cookie on response
    response.cookies.set("user_session_id", user._id.toString(), {
      maxAge: 7 * 24 * 60 * 60, // 7 days
      httpOnly: true,
      path: "/",
    })

    return response
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}