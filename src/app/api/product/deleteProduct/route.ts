import { NextResponse } from "next/server";
import { productService } from "@/server/services/product.service";
import { cookies } from "next/headers";

export async function DELETE(request: Request) {
    try {
        const cookieStore = await cookies();
        const session_token = cookieStore.get("session_token")?.value;
        if (!session_token) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized"
            }, { status: 401 });
        }
        const body = await request.json();
        const { product_id } = body;
        if (!product_id) {
            return NextResponse.json({
                success: false,
                message: "Product ID is required"
            }, { status: 400 });
        }
        await productService.deleteProduct(session_token, product_id);
        return NextResponse.json({
            success: true,
            message: "Product deleted successfully"
        }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ success: false, message: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: false, message: "Failed to delete product" }, { status: 500 });
    }
}