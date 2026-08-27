"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  checkRateLimit,
  isPasswordCorrect,
  recordFailedAttempt,
  resetAttempts,
} from "@/lib/auth";
import { clearSessionCookie, setSessionCookie } from "@/lib/session-cookie";

export type LoginState = { error: string | null };

/**
 * อนุญาตเฉพาะ path ภายในเว็บเท่านั้น
 * กัน open redirect: ค่า next มาจาก query string ซึ่งผู้ใช้แก้ได้
 * ("//evil.com" เป็น protocol-relative URL ที่พาออกนอกเว็บได้ จึงต้องกันด้วย)
 */
function safeNextPath(value: string): string {
  if (!value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

/** อ่าน IP ของผู้เรียก สำหรับใช้เป็น key ของ rate limit */
async function getClientKey(): Promise<string> {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  const nextPath = safeNextPath(String(formData.get("next") ?? "/"));
  const clientKey = await getClientKey();

  const limit = checkRateLimit(clientKey);
  if (!limit.allowed) {
    return {
      error: `พยายามเข้าสู่ระบบบ่อยเกินไป กรุณาลองใหม่ในอีก ${limit.retryAfterSeconds} วินาที`,
    };
  }

  let correct = false;
  try {
    correct = isPasswordCorrect(password);
  } catch (error) {
    console.error(error);
    return { error: "ระบบยังไม่ได้ตั้งค่ารหัสผ่าน (APP_PASSWORD)" };
  }

  if (!correct) {
    recordFailedAttempt(clientKey);
    // ข้อความเดียวกันทุกกรณี ไม่บอกใบ้ว่าผิดตรงไหน
    return { error: "รหัสผ่านไม่ถูกต้อง" };
  }

  resetAttempts(clientKey);

  try {
    await setSessionCookie();
  } catch (error) {
    console.error(error);
    return { error: "ระบบยังไม่ได้ตั้งค่า SESSION_SECRET" };
  }

  // redirect() ทำงานด้วยการ throw — ต้องอยู่นอก try/catch ไม่งั้นจะถูกดักไว้
  redirect(nextPath);
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/login");
}
