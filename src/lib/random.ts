/**
 * สุ่มแบบมี seed — ใส่ seed เดิมได้ผลเดิมเสมอ
 *
 * ใช้กับคำทำนายดวงราศี เพื่อให้ "ดวงวันนี้ของราศีเมษ" ออกมาเหมือนกันทุกครั้งที่เปิด
 * และเหมือนกันทั้งฝั่ง server กับ browser (ไม่เกิด hydration mismatch)
 *
 * ส่วนเซียมซีกับไพ่ทาโรต์ใช้ Math.random ตรงๆ เพราะต้องได้ผลใหม่ทุกครั้งที่เสี่ยง
 */

/** FNV-1a — แปลงข้อความเป็นตัวเลข 32 บิต */
function hashString(input: string): number {
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash >>> 0;
}

/** mulberry32 — PRNG เล็กๆ คืนค่า 0 ถึง 1 */
function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Rng = () => number;

export function createRng(seed: string): Rng {
  return mulberry32(hashString(seed));
}

/** หยิบ 1 ชิ้นจาก array */
export function pick<T>(rng: Rng, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)];
}

/** จำนวนเต็มในช่วง min..max (รวมปลายทั้งสองข้าง) */
export function pickInt(rng: Rng, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

/** สลับลำดับแบบ Fisher–Yates (ไม่แก้ array เดิม) */
export function shuffle<T>(rng: Rng, items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** หยิบหลายชิ้นโดยไม่ซ้ำกัน */
export function pickMany<T>(rng: Rng, items: readonly T[], count: number): T[] {
  return shuffle(rng, items).slice(0, count);
}
