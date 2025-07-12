import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import User from "@/lib/models/User"
import PointsTransaction from "@/lib/models/PointsTransaction"

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { firstName, lastName, email, password } = await request.json()

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 400 })
    }

    // Create new user
    const user = new User({
      name: `${firstName} ${lastName}`,
      email,
      password,
      points: 100, // Welcome bonus
    })

    await user.save()

    // Create welcome bonus transaction
    const transaction = new PointsTransaction({
      user: user._id,
      type: "bonus",
      amount: 100,
      description: "Welcome bonus for new user",
    })

    await transaction.save()

    // Remove password from response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      points: user.points,
      role: user.role,
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        user: userResponse,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
