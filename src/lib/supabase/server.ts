import { createServerClient } from "@supabase/ssr";
import type { CookieToSet } from "./cookies";
import { cookies } from "next/headers";
import { cache } from "react";
import { getSupabaseConfig } from "./env";

/**
 * Supabase client สำหรับ Server Component, Server Action และ Route Handler
 * ต้องสร้างใหม่ทุกครั้งที่ใช้ ห้ามเก็บเป็นตัวแปร global เพราะ cookie ของแต่ละ request ไม่เหมือนกัน
 */
export async function createClient() {
  const { url, anonKey } = getSupabaseConfig();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Component เขียน cookie ไม่ได้ — ไม่เป็นไร
          // เพราะ middleware เป็นคนต่ออายุ session cookie ให้อยู่แล้ว
        }
      },
    },
  });
}

/**
 * อ่านผู้ใช้ที่ล็อกอินอยู่ คืน null ถ้ายังไม่ได้ล็อกอิน
 *
 * ห่อด้วย cache() ของ React เพราะทั้ง layout และตัวหน้าเองต่างก็เรียกฟังก์ชันนี้
 * ถ้าไม่ห่อไว้จะยิงไป Supabase สองรอบต่อการโหลดหนึ่งครั้ง
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();

  // ใช้ getUser() ไม่ใช่ getSession() เพราะ getUser() ยืนยัน token กับ Supabase จริง
  // ส่วน getSession() เชื่อ cookie ตรงๆ ซึ่งปลอมได้
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
});
