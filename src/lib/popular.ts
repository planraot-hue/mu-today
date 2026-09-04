import { createClient } from "@/lib/supabase/server";
import { getFeature, type Feature } from "@/lib/features";

/**
 * ยอดคลิกของแต่ละฟีเจอร์ เก็บใน Supabase ตาราง feature_clicks
 * สคริปต์สร้างตารางและฟังก์ชันอยู่ที่ docs/supabase.sql
 *
 * ทุกฟังก์ชันในไฟล์นี้ออกแบบให้ "ล้มแล้วเงียบ" — ถ้ายังไม่ได้รันสคริปต์ใน Supabase
 * หรือยังไม่ได้ตั้ง env แท็บมาแรงจะไม่ขึ้นเฉยๆ ไม่ทำให้ทั้งหน้าพัง
 * เพราะยอดคลิกเป็นของประดับ ไม่ใช่เนื้อหาหลักของเว็บ
 */

const TABLE = "feature_clicks";

export type PopularFeature = Feature & { clicks: number };

/**
 * เพิ่มยอดคลิกหนึ่งครั้ง
 *
 * เรียกผ่าน RPC ไม่ใช่ update ตรงๆ เพราะ anon key ไม่มีสิทธิ์เขียนตารางนี้
 * ฟังก์ชันฝั่ง Supabase เป็น security definer และบวกได้ทีละ 1 เท่านั้น
 * คนที่ยิง API ตรงๆ จึงปั่นยอดรวดเดียวไม่ได้
 */
export async function bumpFeatureClick(featureId: string): Promise<void> {
  // กันการเขียน id มั่วลงตาราง — รับเฉพาะฟีเจอร์ที่มีอยู่จริง
  if (!getFeature(featureId)) return;

  try {
    const supabase = await createClient();
    await supabase.rpc("bump_feature_click", { p_feature_id: featureId });
  } catch {
    // ยังไม่ได้ตั้งค่า Supabase หรือยังไม่ได้รันสคริปต์ — ข้ามไป
  }
}

/**
 * ฟีเจอร์ที่คนคลิกดูมากที่สุด
 *
 * `excludeId` ไว้ตัดหน้าที่ผู้ใช้เปิดอยู่ออก จะได้ไม่แนะนำหน้าที่กำลังดูอยู่แล้ว
 * จึงต้องดึงมาสองแถวเสมอ เผื่อแถวแรกเป็นหน้าปัจจุบัน
 */
export async function getMostPopular(
  excludeId?: string | null,
): Promise<PopularFeature | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from(TABLE)
      .select("feature_id, clicks")
      .order("clicks", { ascending: false })
      .limit(2);

    if (error || !data) return null;

    for (const row of data) {
      if (row.feature_id === excludeId) continue;

      const feature = getFeature(row.feature_id);
      // ฟีเจอร์ที่ถูกลบไปแล้วแต่ยังมีแถวค้างอยู่ — ข้าม
      if (!feature) continue;

      return { ...feature, clicks: Number(row.clicks) || 0 };
    }

    return null;
  } catch {
    return null;
  }
}
