import type { CookieOptions } from "@supabase/ssr";

/**
 * รูปแบบของคุกกี้ที่ Supabase ส่งกลับมาให้เราเขียนลง response
 *
 * ต้องประกาศเองเพราะ TypeScript หา contextual type ของ callback setAll ไม่เจอ
 * พอเปิด strict ไว้จึงฟ้องว่าพารามิเตอร์เป็น implicit any
 */
export type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};
