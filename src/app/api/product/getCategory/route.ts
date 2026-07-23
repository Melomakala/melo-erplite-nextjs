import { NextResponse } from "next/server";
import { productService } from "@/server/services/product.service";
import { cookies } from "next/headers";

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const session_token = cookieStore.get("session_token");
        if (!session_token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        const categories = await productService.getCategory(session_token.value);
        return NextResponse.json({ success: true, data: categories });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ success: false, message: error.message });
        }
        return NextResponse.json({ success: false, message: "Failed to get categories" }, { status: 500 });
    }
}