import { NextResponse } from "next/server";
import { profileService } from "@/server/services/profile.service";
import { cookies } from "next/headers";

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("session_token")?.value;

        if (!sessionToken) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized",
            }, { status: 401 });
        }
        const result = await profileService.getProfile(sessionToken);
        return NextResponse.json({
            success: true,
            message: "Profile fetched successfully",
            data: result,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error";
        const response = NextResponse.json({ success: false, message }, { status: 401 });

        // เคลียร์ Cookie ลบทิ้งออกจากเบราว์เซอร์
        response.cookies.set("session_token", "", { expires: new Date(0), path: "/" });
        return response;
    }
}
