import { NextResponse } from "next/server";
import { authService } from "@/server/services/auth.service";
import { loginSchema } from "@/server/validations/auth.validation";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsed = loginSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: parsed.error.issues[0].message
                },
                { status: 400 });
        }
        const result = await authService.login(parsed.data);
        const response = NextResponse.json({
            success: true,
            message: "Login successful",
            data: result
        }, { status: 200 });
        response.cookies.set("session_token", result.session_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });
        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({
            success: false,
            message
        }, { status: 500 });
    }
}