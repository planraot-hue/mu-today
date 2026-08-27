import { SignJWT, jwtVerify, type JWTPayload } from "jose";

/**
 * ฟังก์ชันในไฟล์นี้ต้องทำงานได้ทั้งบน Node runtime (Server Action) และ Edge runtime
 * (middleware) จึงใช้ได้เฉพาะ jose กับ Web API เท่านั้น — ห้าม import `next/headers`
 * หรือ `node:crypto` ที่นี่ (ดู session-cookie.ts สำหรับส่วนที่แตะ cookie)
 */

export const SESSION_COOKIE_NAME = "session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 วัน

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET ไม่ได้ตั้งค่า หรือสั้นกว่า 32 ตัวอักษร — ตั้งค่าใน .env.local และใน Vercel",
    );
  }
  return new TextEncoder().encode(secret);
}

/** สร้าง JWT สำหรับ session ใหม่ */
export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: "owner" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

/**
 * ตรวจลายเซ็นและวันหมดอายุของ token
 * คืน payload ถ้าใช้ได้ / คืน null ทุกกรณีที่ใช้ไม่ได้ (รวมถึงกรณีที่ยังไม่ได้ตั้ง
 * SESSION_SECRET) เพื่อให้ middleware เด้งไปหน้า login แทนที่จะพัง 500
 */
export async function verifySessionToken(
  token: string | undefined,
): Promise<JWTPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}
