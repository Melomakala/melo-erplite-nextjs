import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Middleware — ด่านตรวจ Authentication
 *
 * ทำงานก่อน request จะถึง Page หรือ API ทุกครั้ง
 * หน้าที่: ตรวจว่ามี session_token cookie ไหม แล้ว redirect ตามสถานะ
 *
 * ⚠️ middleware แค่เช็คว่า "cookie มีอยู่ไหม"
 *    การ verify ว่า session หมดอายุหรือยัง ต้องทำใน API Route / Server Component
 */

// Path ที่ไม่ต้อง login ก็เข้าได้
// ถ้าเพิ่ม route สาธารณะ ให้เพิ่มที่นี่ เช่น "/register", "/forgot-password"
const PUBLIC_PATHS = ["/login"]

export function proxy(request: NextRequest) {
  // อ่าน session token จาก HttpOnly Cookie
  const token = request.cookies.get("session_token")?.value

  // เช็คว่า path ปัจจุบันอยู่ใน PUBLIC_PATHS ไหม
  // ใช้ startsWith เพื่อให้ครอบคลุม sub-path เช่น /login/callback
  const isPublic = PUBLIC_PATHS.some((p) =>
    request.nextUrl.pathname.startsWith(p)
  )

  // ไม่มี token + พยายามเข้า protected route → บังคับไป login
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // มี token แล้ว + พยายามเข้าหน้า login → redirect กลับ home
  if (token && isPublic) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // ผ่านทุก condition → ปล่อยผ่านตามปกติ
  return NextResponse.next()
}

export const config = {
  /**
   * Matcher — กำหนดว่า middleware จะ run กับ request ไหนบ้าง
   *
   * ข้าม (ไม่ run middleware):
   *  - /api/*           → API routes จัดการ auth เองใน route.ts
   *  - /_next/static/*  → static files (JS, CSS)
   *  - /_next/image/*   → image optimization
   *  - /favicon.ico     → favicon
   *
   * Run middleware กับ path อื่นทั้งหมด เช่น /dashboard, /login, /products
   */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
