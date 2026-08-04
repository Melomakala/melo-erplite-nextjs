import { NextResponse } from "next/server";
import { productService } from "@/server/services/product.service";
import { cookies } from "next/headers";

export async function PUT(req: Request) {
    try {
        const cookieStore = await cookies();
        const session_token = cookieStore.get("session_token");
        if (!session_token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        const { product_id, body } = await req.json();
        const result = await productService.updateProduct(session_token.value, { product_id, body });
        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ success: false, message: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: false, message: "Failed to update product" }, { status: 500 });
    }
}