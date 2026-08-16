import { NextResponse } from "next/server";
import { orderService } from "@/server/services/order.service";
import { cookies } from "next/headers";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = Number(searchParams.get("page") || "1");
        const limit = Number(searchParams.get("limit") || "10");
        const query = searchParams.get("query") || undefined;
        const rawStatus = searchParams.get("status");
        const status = rawStatus === "PENDING" || rawStatus === "PAID" || rawStatus === "SHIPPED" || rawStatus === "COMPLETED" || rawStatus === "CANCELLED" ? rawStatus : undefined;

        const cookieStore = await cookies();
        const session_token = cookieStore.get("session_token")?.value;
        if (!session_token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        const order = await orderService.getOrder(session_token, { page, limit, query, status });
        return NextResponse.json({
            success: true,
            message: "Order fetched successfully",
            data: order,
        }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ success: false, message: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: false, message: "Failed to fetch customers" }, { status: 500 });
    }
}