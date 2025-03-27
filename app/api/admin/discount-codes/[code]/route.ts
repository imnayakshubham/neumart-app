import { NextResponse } from "next/server"
import { deleteDiscountCode } from "@/lib/store"

export async function DELETE(request: Request, { params }: { params: { code: string } }) {
    try {
        const newParams = await params
        const code = newParams.code

        if (!code) {
            return NextResponse.json({ success: false, message: "Discount code is required" }, { status: 400 })
        }

        const success = deleteDiscountCode(code)

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

