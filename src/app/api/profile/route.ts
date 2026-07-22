import { NextResponse } from "next/server";
import { profileService } from "@/server/services/profile.service";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const user_id = searchParams.get("user_id");
        if (!user_id) {
            return NextResponse.json({
                success: false,
                message: "User ID is required",
            }, { status: 400 });
        }
        const profile = await profileService.getProfile(user_id);
        return NextResponse.json({
            success: true,
            data: profile,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({
            success: false,
            message,
        }, { status: 500 });
    }
}
