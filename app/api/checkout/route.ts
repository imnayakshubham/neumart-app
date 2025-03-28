import { NextResponse } from "next/server"
import { placeOrder } from "@/lib/store"
import type { CartItem } from "@/lib/types"
import { markDiscountAsUsed } from "@/lib/actions"

export async function POST(request: Request) {
  try {
    const { items, discountCode } = await request.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid request: items are required" }, { status: 400 })
    }

    const validItems = items.every((item: CartItem) => {
      return (
        item.id && item.name && typeof item.price === "number" && typeof item.quantity === "number" && item.quantity > 0
      )
    })

    if (!validItems) {
      return NextResponse.json({ success: false, message: "Invalid request: items are malformed" }, { status: 400 })
    }

    const order = await placeOrder(items, discountCode)

    if (!order) {
      return NextResponse.json({
        success: false,
        message: "Failed to place an Order",
      }, { status: 400 })
    }

    if (discountCode && order.discountApplied) {
      await markDiscountAsUsed(discountCode)
    }

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      orderId: order._id,
    })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

