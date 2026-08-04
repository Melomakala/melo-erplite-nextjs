import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { customerService } from "@/server/services/customer.service";

export async function PUT(request: Request) {
    try {
        const cookieStore = await cookies();
        const session_token = cookieStore.get("session_token")?.value;
        if (!session_token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        const { customer_id, body } = await request.json();
        const result = await customerService.updateCustomer(session_token, { customer_id, body });
        return NextResponse.json({ success: true, data: result, message: "Customer updated successfully" });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ success: false, message: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: false, message: "Failed to update customer" }, { status: 500 });
    }
}
