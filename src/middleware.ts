import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  /**
   * ยกเว้นไฟล์ภายในของ Next.js และไฟล์ static ไม่ต้องผ่านการตรวจ session
   *
   * ที่ต้องยกเว้นเพิ่มสำหรับ PWA:
   * - sw.js และ manifest.webmanifest เบราว์เซอร์ต้องโหลดได้โดยไม่มีคุกกี้
   *   ถ้าโดน redirect ไปหน้า login จะติดตั้งแอปไม่ได้เลย
   * - icon / apple-icon เป็นไอคอนที่ Next.js สร้างให้ ต้องเปิดสาธารณะเช่นกัน
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sw\.js|manifest\.webmanifest|icon|apple-icon|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
