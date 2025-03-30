import DiscountCode from "@/lib/models/DiscountCodeSchema"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    request: NextRequest,
) {
    try {
        const coupons = await DiscountCode.find({
            user_id: 1,
            used: false,
            access: true,
        }).lean()


        return NextResponse.json({
            success: true,
            coupons,
        })
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        )
    }
}
