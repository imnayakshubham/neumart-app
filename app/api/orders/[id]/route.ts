import { NextResponse } from "next/server"
import { getOrderById } from "@/lib/store"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const responseParams = await params
    const orderId = responseParams.id

    if (!orderId) {
      return NextResponse.json({ success: false, message: "Order ID is required" }, { status: 400 })
    }

    const order = getOrderById(orderId)

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
    }


    return NextResponse.json({
      success: true,
      order,
    })
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

