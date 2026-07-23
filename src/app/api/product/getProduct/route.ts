import { NextResponse } from "next/server";
import { productService } from "@/server/services/product.service";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const session_token = cookieStore.get("session_token")?.value;
        if (!session_token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        const products = await productService.getProducts(session_token);
        return NextResponse.json({
            success: true,
            message: "Products fetched successfully",
            data: products,
        }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({
            success: false,
            message,
        }, { status: 500 });
    }
}
