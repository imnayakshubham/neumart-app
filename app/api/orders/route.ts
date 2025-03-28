import { NextResponse } from "next/server"
import { getOrders } from "@/lib/store"

export async function GET() {
  try {
    const orders = await getOrders()

    return NextResponse.json({
      success: true,
      orders,
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

