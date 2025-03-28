import { deleteDiscountCode } from "@/lib/store"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, context: { params: { code: string } }) {
    try {
        const code = context.params.code

        console.log({ code })

        if (!code) {
            return NextResponse.json({ success: false, message: "Discount code is required" }, { status: 400 })
        }

        const success = await deleteDiscountCode(code)

        if (!success) {
            return NextResponse.json(
                { success: false, message: "Failed to delete discount code. It may not exist or has already been used." },
                { status: 404 },
            )
        }

        return NextResponse.json({
            success: true,
            message: "Discount code deleted successfully",
        })
    } catch (error) {
        console.error("Error deleting discount code:", error)
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
    }
}

