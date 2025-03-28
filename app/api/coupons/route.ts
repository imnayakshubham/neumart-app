import DiscountCode from "@/lib/models/DiscountCodeSchema"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    request: NextRequest,
) {
    try {
        const user_id = Number(request.headers.get("x-user-id")) ?? 1
        console.log({ user_id })
        if (!user_id) {
            return NextResponse.json(
                { success: false, message: "User ID is required" },
                { status: 400 }
            )
        }

        const coupons = await DiscountCode.find({
            user_id: user_id,
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
