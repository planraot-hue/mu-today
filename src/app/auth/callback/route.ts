import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * ปลายทางของลิงก์ยืนยันอีเมลจาก Supabase
 * Supabase จะส่งผู้ใช้กลับมาที่นี่พร้อมพารามิเตอร์ code ให้เราแลกเป็น session
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");

  // ค่า next มาจาก URL จึงต้องกัน open redirect เหมือนฝั่ง Server Action
  const rawNext = searchParams.get("next") ?? "/";
  const next =
    rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/";

  if (!code) {
    return NextResponse.redirect(
      `${origin}/auth/auth-error?reason=missing-code`,
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error(error);
    return NextResponse.redirect(`${origin}/auth/auth-error?reason=exchange`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
