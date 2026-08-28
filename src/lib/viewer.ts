import { cookies } from "next/headers";
import { cache } from "react";
import type { User } from "@supabase/supabase-js";
import { getCurrentUser } from "@/lib/supabase/server";

/**
 * ผู้เข้าชมเว็บ มีสองแบบ: สมาชิกที่ล็อกอินแล้ว กับผู้เยี่ยมชม (guest)
 *
 * คุกกี้ guest ไม่ได้เซ็นและปลอมได้ง่าย ซึ่งยอมรับได้เพราะโหมดผู้เยี่ยมชม
 * ไม่ได้ให้สิทธิ์อะไรที่ต้องหวง — ดูดวงได้เหมือนกันทุกอย่าง
 * ถ้าวันหลังมีข้อมูลส่วนตัว (เช่น ประวัติการเสี่ยงเซียมซี) ต้องกันด้วย user จริงเท่านั้น
 */

export const GUEST_COOKIE = "mutoday-guest";
export const GUEST_COOKIE_VALUE = "1";
export const GUEST_MAX_AGE = 60 * 60 * 24 * 30; // 30 วัน

export type Viewer = {
  user: User | null;
  isGuest: boolean;
  /** เข้าดูเนื้อหาได้หรือยัง */
  canView: boolean;
};

export const getViewer = cache(async (): Promise<Viewer> => {
  let user: User | null = null;

  try {
    user = await getCurrentUser();
  } catch {
    // ยังไม่ได้ตั้งค่า Supabase — ให้เข้าแบบผู้เยี่ยมชมได้อยู่
  }

  const cookieStore = await cookies();
  const hasGuestCookie =
    cookieStore.get(GUEST_COOKIE)?.value === GUEST_COOKIE_VALUE;

  return {
    user,
    // ถ้าล็อกอินอยู่แล้วไม่ต้องนับเป็น guest
    isGuest: hasGuestCookie && !user,
    canView: Boolean(user) || hasGuestCookie,
  };
});
