import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {

    try {
        request.headers.set("x-user-id", "1")

        return NextResponse.next()
    } catch (error) {
        console.error("Invalid Token:", error)
        return NextResponse.redirect("/login")
    }
}

export const config = {
    matcher: ["/api/:path*"],
}
