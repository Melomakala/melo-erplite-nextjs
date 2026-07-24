import { NextResponse } from "next/server";
import { productService } from "@/server/services/product.service";
import { cookies } from "next/headers";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 10;
        const query = searchParams.get("query") || undefined;
        const category_id = searchParams.get("category_id") || undefined;
        const rawStatus = searchParams.get("status");
        const status = rawStatus === "active" || rawStatus === "inactive" ? rawStatus : undefined;

        const cookieStore = await cookies();
        const session_token = cookieStore.get("session_token")?.value;
        if (!session_token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        const products = await productService.getProducts(session_token, { page, limit, query, category_id, status });
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
