import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { customerService } from "@/server/services/customer.service";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const cookieStore = await cookies();
        const session_token = cookieStore.get("session_token")?.value;
        if (!session_token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        await customerService.createCustomer(session_token, body);
        return NextResponse.json({
            success: true,
            message: "Customer created successfully",
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({
            success: false,
            message
        }, { status: 500 });
    }
} 