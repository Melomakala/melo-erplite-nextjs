import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { customerService } from "@/server/services/customer.service"
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 10;
        const query = searchParams.get("query") || undefined;
        const rawStatus = searchParams.get("status");
        const status = rawStatus === "active" || rawStatus === "inactive" ? rawStatus : undefined;

        const cookieStore = await cookies();
        const session_token = cookieStore.get("session_token")?.value;
        if (!session_token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        const customers = await customerService.getCustomer(session_token, { page, limit, query, status });
        return NextResponse.json({
            success: true,
            message: "Customers fetched successfully",
            data: customers,
        }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ success: false, message: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: false, message: "Failed to fetch customers" }, { status: 500 });
    }
}