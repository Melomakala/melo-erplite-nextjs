import { NextResponse } from "next/server";
import { orderService } from "@/server/services/order.service";
import { cookies } from "next/headers";

export async function DELETE(request: Request) {
    try {
        const cookieStore = await cookies();
        const session_token = cookieStore.get("session_token");
        if (!session_token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        const body = await request.json();
        const { order_id } = body;
        if (!order_id) {
            return NextResponse.json({ success: false, message: "Missing order_id" }, { status: 400 });
        }
        await orderService.deleteOrder(session_token.value, order_id);
        return NextResponse.json({
            success: true,
            message: "Order deleted successfully"
        },
            { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ success: false, message: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: false, message: "Failed to delete order" }, { status: 500 });
    }
}