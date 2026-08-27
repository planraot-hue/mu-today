import { cookies } from "next/headers";
import type { JWTPayload } from "jose";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  verifySessionToken,
} from "@/lib/session";

/**
 * ส่วนที่แตะ cookie โดยตรง — ใช้ได้เฉพาะใน Server Component และ Server Action
 * (middleware ใช้ไฟล์นี้ไม่ได้ เพราะ `next/headers` ทำงานบน Edge runtime ไม่ได้)
 */

/** ออก session ใหม่แล้วเขียนลง cookie */
export async function setSessionCookie(): Promise<void> {
  const token = await createSessionToken();
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true, // JavaScript ฝั่ง browser อ่านไม่ได้
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

/** ลบ session cookie (ออกจากระบบ) */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * อ่าน session ปัจจุบัน — ใช้ในหน้าที่ต้องล็อกอิน เพื่อตรวจซ้ำอีกชั้น
 * ไม่พึ่ง middleware อย่างเดียว
 */
export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}
