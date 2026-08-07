import { NextResponse } from "next/server";
import { orderService } from "@/server/services/order.service";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const cookieStore = await cookies();
        const session_token = cookieStore.get("session_token")?.value;
        if (!session_token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        const order = await orderService.createOrder(session_token, body);
        return NextResponse.json({
            success: true,
            message: "Order created successfully",
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: "Internal Server Error",
        }, { status: 500 });
    }
}