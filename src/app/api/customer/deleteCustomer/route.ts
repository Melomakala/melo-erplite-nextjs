import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { customerService } from "@/server/services/customer.service";

export async function DELETE(request: Request) {
    try {
        const cookieStore = await cookies();
        const session_token = cookieStore.get("session_token")?.value;
        if (!session_token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        const body = await request.json();
        const { customer_id } = body;
        if (!customer_id) {
            return NextResponse.json({
                success: false,
                message: "Customer ID is required"
            }, { status: 400 });
        }
        await customerService.deleteCustomer(session_token, customer_id);
        return NextResponse.json({
            success: true,
            message: "Customer deleted successfully",
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({
            success: false,
            message
        }, { status: 500 });
    }
}