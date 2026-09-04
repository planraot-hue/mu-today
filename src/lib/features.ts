/**
 * รายการฟีเจอร์ดูดวงทั้งหมดของเว็บ
 *
 * ที่แยกออกมาเป็นไฟล์กลาง เพราะตอนนี้มีสองที่ที่ต้องรู้จักรายการนี้:
 * แถบเมนูใน SiteHeader กับแท็บ "มาแรง" ที่นับยอดคลิก
 * ถ้าปล่อยให้ต่างคนต่างถือรายการของตัวเอง วันหนึ่งจะเพิ่มหน้าใหม่แล้วลืมอีกที่
 *
 * id ใช้เป็นคีย์ในตาราง feature_clicks ของ Supabase ด้วย
 * **เปลี่ยน id แล้วยอดคลิกเดิมจะกลายเป็นแถวกำพร้า** ถ้าจำเป็นต้องเปลี่ยนจริงๆ
 * ต้อง UPDATE แถวเดิมใน Supabase ตามไปด้วย
 *
 * tint = สีพื้นตอนที่ยังไม่ถูกเลือก · grad = สีไล่ระดับตอนถูกเลือก
 */

export type Feature = {
  id: string;
  href: string;
  label: string;
  emoji: string;
  grad: string;
  tint: string;
  /** ประโยคสั้นๆ ใช้ในแท็บมาแรง บอกว่าหน้านี้ทำอะไรได้ */
  blurb: string;
};

export const FEATURES: Feature[] = [
  {
    id: "home",
    href: "/",
    label: "สีมงคล",
    emoji: "🎨",
    grad: "grad-violet",
    tint: "bg-lilac/45",
    blurb: "สีมงคลวันนี้ พร้อมลุคแต่งตัว 3 สไตล์",
  },
  {
    id: "birth",
    href: "/birth",
    label: "วันเกิด",
    emoji: "🎂",
    grad: "grad-gold",
    tint: "bg-gold/55",
    blurb: "ผูกดวงทักษาปกรณ์จากวันเดือนปีเกิด",
  },
  {
    id: "horoscope",
    href: "/horoscope",
    label: "ราศี",
    emoji: "🔮",
    grad: "grad-violet",
    tint: "bg-lilac/50",
    blurb: "ดวงรายวัน รายสัปดาห์ รายเดือน ตามราศี",
  },
  {
    id: "chinese",
    href: "/chinese",
    label: "ดวงจีน",
    emoji: "🧧",
    grad: "grad-gold",
    tint: "bg-gold/55",
    blurb: "นักษัตรจีน ปีชง และปีสามฮะ",
  },
  {
    id: "love",
    href: "/love",
    label: "สมพงศ์",
    emoji: "💞",
    grad: "grad-violet",
    tint: "bg-lilac/45",
    blurb: "ดูความเข้ากันของคู่รักตามตำราสมพงศ์",
  },
  {
    id: "siamsi",
    href: "/siamsi",
    label: "เซียมซี",
    emoji: "🥢",
    grad: "grad-gold",
    tint: "bg-gold/55",
    blurb: "เขย่ากระบอกเสี่ยงเซียมซีวัดดัง 4 ภาค",
  },
  {
    id: "tarot",
    href: "/tarot",
    label: "ทาโรต์",
    emoji: "🃏",
    grad: "grad-violet",
    tint: "bg-lilac/55",
    blurb: "เปิดไพ่ทาโรต์จากสำรับเต็ม 78 ใบ",
  },
  {
    id: "phrom-yan",
    href: "/phrom-yan",
    label: "พรหมญาณ",
    emoji: "🔯",
    grad: "grad-violet",
    tint: "bg-lilac/50",
    blurb: "เปิดไพ่พรหมญาณถามเรื่องที่ค้างใจ",
  },
];

/** แปลง pathname เป็น id ของฟีเจอร์ คืน null ถ้าไม่ใช่หน้าฟีเจอร์ (เช่น /login /sources) */
export function featureIdOf(pathname: string): string | null {
  if (pathname === "/") return "home";

  const match = FEATURES.find(
    (feature) => feature.href !== "/" && pathname.startsWith(feature.href),
  );

  return match ? match.id : null;
}

export function getFeature(id: string): Feature | undefined {
  return FEATURES.find((feature) => feature.id === id);
}
