import { NextResponse } from "next/server"
import { generateNewDiscountCode, updateOrderThreshold } from "@/lib/store"

export async function POST(request: Request) {
  try {
    const { percentage, orderThreshold } = await request.json()

    if (typeof percentage !== "number" || percentage <= 0 || percentage > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid discount percentage. Must be between 1 and 100.",
        },
        { status: 400 },
      )
    }

    if (typeof orderThreshold === "number" && orderThreshold > 0) {
      updateOrderThreshold(orderThreshold)
    }

    const discountCode = generateNewDiscountCode(percentage)

    return NextResponse.json({
      success: true,
      code: discountCode.code,
      percentage: discountCode.percentage,
    })
  } catch (error) {
    console.error("Error generating discount code:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

