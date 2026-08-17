import { NextResponse } from "next/server";
import { orderService } from "@/server/services/order.service";
import { cookies } from "next/headers";

export async function PUT(request: Request) {
    try {
        const cookieStore = await cookies();
        const session_token = cookieStore.get("session_token")?.value;
        if (!session_token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        const { order_id, body } = await request.json();
        const result = await orderService.updateOrder(session_token, order_id, body);
        return NextResponse.json({ success: true, result, message: "Order updated successfully" }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ success: false, message: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: false, message: "Failed to update order" }, { status: 500 });
    }
}