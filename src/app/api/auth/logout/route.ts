import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authService } from "@/server/services/auth.service";

export async function POST() {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("session_token")?.value;

        if (sessionToken) {
            await authService.logout(sessionToken);
        }

        const response = NextResponse.json({
            success: true,
            message: "Logged out successfully",
        });

        response.cookies.set("session_token", "", {
            httpOnly: true,
            expires: new Date(0),
            path: "/",
        });

        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({
            success: false,
            message,
        }, { status: 500 });
    }
}
