import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ message: "Logged out successfully" })

  // Clear the session cookie by setting it with an expired date
  response.cookies.set("user_session_id", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
  })

  return response
}
