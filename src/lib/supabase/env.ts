/**
 * ค่าเชื่อมต่อ Supabase
 *
 * ทั้งสองค่านี้เป็น NEXT_PUBLIC ได้อย่างปลอดภัย — anon key ถูกออกแบบมาให้เปิดเผยต่อ
 * browser อยู่แล้ว ความปลอดภัยจริงมาจาก Row Level Security ที่ตั้งไว้ฝั่ง Supabase
 * ห้ามเอา service_role key มาใส่ตรงนี้เด็ดขาด เพราะ key นั้นข้าม RLS ได้ทั้งหมด
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** อ่านค่าแบบการันตีว่ามีจริง ถ้าไม่ได้ตั้งจะ throw พร้อมบอกว่าต้องตั้งอะไร */
export function getSupabaseConfig(): { url: string; anonKey: string } {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      "ยังไม่ได้ตั้งค่า NEXT_PUBLIC_SUPABASE_URL หรือ NEXT_PUBLIC_SUPABASE_ANON_KEY — " +
        "ตั้งใน .env.local สำหรับรันในเครื่อง และใน Vercel > Settings > Environment Variables ก่อน deploy",
    );
  }
  return { url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY };
}

/** ใช้เช็คแบบไม่ throw เพื่อแสดงข้อความบอกผู้ใช้แทนหน้า error */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
