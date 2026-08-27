import { createHash, timingSafeEqual } from "node:crypto";

/** ไฟล์นี้รันบน Node runtime เท่านั้น (Server Action) — ห้าม import จาก middleware */

/**
 * เทียบรหัสผ่านที่ผู้ใช้กรอกกับค่าใน APP_PASSWORD
 *
 * เทียบบน SHA-256 digest แทนที่จะเทียบสตริงตรงๆ เพราะ digest ยาว 32 ไบต์เสมอ
 * ทำให้ timingSafeEqual ใช้ได้โดยไม่หลุดข้อมูล "ความยาวรหัส" ออกไปทาง timing
 * และเวลาที่ใช้เปรียบเทียบไม่ขึ้นกับว่าตรงกันกี่ตัวอักษร
 *
 * throw ถ้ายังไม่ได้ตั้ง APP_PASSWORD — ตั้งใจให้พังชัดๆ ดีกว่าปล่อยรหัสว่างผ่าน
 */
export function isPasswordCorrect(input: string): boolean {
  const expected = process.env.APP_PASSWORD;
  if (!expected) {
    throw new Error(
      "APP_PASSWORD ไม่ได้ตั้งค่า — ตั้งค่าใน .env.local และใน Vercel ก่อนใช้งาน",
    );
  }

  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

/* ------------------------------------------------------------------ */
/* Rate limit                                                          */
/* ------------------------------------------------------------------ */

/**
 * ตัวนับความพยายามล็อกอินแบบเก็บในหน่วยความจำ
 *
 * ข้อจำกัดที่ยอมรับ: บน Vercel แต่ละ serverless instance มีหน่วยความจำของตัวเอง
 * ตัวนับจึงไม่ถูกแชร์ข้าม instance และหายไปเมื่อ instance ถูกรีไซเคิล
 * มันจึงเป็นแค่การ "หน่วง" คนที่นั่งเดารหัสรัวๆ ไม่ใช่การกันแบบเด็ดขาด
 *
 * ถ้าวันหลังต้องการของจริง ให้เปลี่ยนมาใช้ Upstash Redis โดยแก้แค่ 3 ฟังก์ชันข้างล่างนี้
 * ส่วนที่เรียกใช้ใน actions.ts ไม่ต้องแก้เลย
 */
type Bucket = { count: number; resetAt: number };

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 5 * 60 * 1000; // 5 นาที
const MAX_TRACKED_KEYS = 10_000; // กันหน่วยความจำบวมถ้าโดนยิงจากหลาย IP

const attempts = new Map<string, Bucket>();

function sweepExpired(now: number): void {
  for (const [key, bucket] of attempts) {
    if (now > bucket.resetAt) attempts.delete(key);
  }
}

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const bucket = attempts.get(key);

  if (!bucket || now > bucket.resetAt) return { allowed: true };
  if (bucket.count < MAX_ATTEMPTS) return { allowed: true };

  return {
    allowed: false,
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  };
}

export function recordFailedAttempt(key: string): void {
  const now = Date.now();

  if (attempts.size > MAX_TRACKED_KEYS) sweepExpired(now);

  const bucket = attempts.get(key);
  if (!bucket || now > bucket.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  bucket.count += 1;
}

/** ล็อกอินสำเร็จแล้วล้างตัวนับของ IP นั้น */
export function resetAttempts(key: string): void {
  attempts.delete(key);
}
