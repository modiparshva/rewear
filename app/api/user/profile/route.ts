import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Extract cookie from request
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => {
        const [key, ...v] = c.split("=");
        return [key, decodeURIComponent(v.join("="))];
      })
    );
    const userId = cookies["user_session_id"];

    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar || "/placeholder.svg",
      points: user.points,
      rating: user.rating || 4.5,
      totalRatings: user.totalRatings || 0,
      totalSwaps: user.totalSwaps || 0,
      location: user.location || { city: "N/A", state: "", country: "" },
      joinDate: user.createdAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      }),
      role: user.role,
    };

    return NextResponse.json({ user: userResponse }, { status: 200 });
  } catch (err) {
    console.error("Profile fetch error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}