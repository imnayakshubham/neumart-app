import { NextResponse } from "next/server"
import { getAdminStats } from "@/lib/store"

export async function GET() {
  try {
    const stats = await getAdminStats()

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

