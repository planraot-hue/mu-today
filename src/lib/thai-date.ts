/**
 * วันเวลาแบบไทย — ทุกอย่างอิงเขต Asia/Bangkok เสมอ
 *
 * สำคัญ: server ของ Vercel รันด้วยเวลา UTC ถ้าใช้ new Date().getDay() ตรงๆ
 * ช่วงหลังเที่ยงคืนถึง 7 โมงเช้าบ้านเราจะได้ "วันเมื่อวาน" ทุกครั้ง
 */

const TIME_ZONE = "Asia/Bangkok";

export const THAI_DAY_NAMES = [
  "อาทิตย์",
  "จันทร์",
  "อังคาร",
  "พุธ",
  "พฤหัสบดี",
  "ศุกร์",
  "เสาร์",
] as const;

export const THAI_MONTH_NAMES = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
] as const;

export type ThaiToday = {
  /** 1–31 */
  day: number;
  /** 1–12 */
  month: number;
  /** ค.ศ. */
  year: number;
  /** 0 = อาทิตย์ … 6 = เสาร์ */
  weekday: number;
  /** "2026-08-27" — ใช้เป็น seed ของดวงรายวัน */
  isoDate: string;
  /** "2026-08-24" วันจันทร์ต้นสัปดาห์ — seed ของดวงรายสัปดาห์ */
  weekKey: string;
  /** "2026-08" — seed ของดวงรายเดือน */
  monthKey: string;
};

/** อ่านวันที่ปัจจุบันตามเวลาไทย */
export function getThaiToday(): ThaiToday {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // en-CA ให้รูปแบบ YYYY-MM-DD พอดี
  const isoDate = formatter.format(new Date());
  const [year, month, day] = isoDate.split("-").map(Number);

  // สร้าง Date แบบ UTC จากตัวเลขที่ได้ เพื่อคำนวณวันในสัปดาห์โดยไม่โดน timezone ของเครื่องกวน
  const utc = new Date(Date.UTC(year, month - 1, day));
  const weekday = utc.getUTCDay();

  // ถอยไปหาวันจันทร์ของสัปดาห์นั้น (จันทร์ = ต้นสัปดาห์)
  const daysSinceMonday = (weekday + 6) % 7;
  const monday = new Date(utc);
  monday.setUTCDate(monday.getUTCDate() - daysSinceMonday);

  return {
    day,
    month,
    year,
    weekday,
    isoDate,
    weekKey: monday.toISOString().slice(0, 10),
    monthKey: isoDate.slice(0, 7),
  };
}

/** "วันพฤหัสบดีที่ 27 สิงหาคม 2569" */
export function formatThaiFullDate(today: ThaiToday): string {
  const dayName = THAI_DAY_NAMES[today.weekday];
  const monthName = THAI_MONTH_NAMES[today.month - 1];
  return `วัน${dayName}ที่ ${today.day} ${monthName} ${today.year + 543}`;
}

/** "24 – 30 สิงหาคม 2569" ช่วงของสัปดาห์ปัจจุบัน */
export function formatThaiWeekRange(today: ThaiToday): string {
  const monday = new Date(`${today.weekKey}T00:00:00Z`);
  const sunday = new Date(monday);
  sunday.setUTCDate(sunday.getUTCDate() + 6);

  const startMonth = THAI_MONTH_NAMES[monday.getUTCMonth()];
  const endMonth = THAI_MONTH_NAMES[sunday.getUTCMonth()];
  const buddhistYear = sunday.getUTCFullYear() + 543;

  if (startMonth === endMonth) {
    return `${monday.getUTCDate()} – ${sunday.getUTCDate()} ${endMonth} ${buddhistYear}`;
  }
  return `${monday.getUTCDate()} ${startMonth} – ${sunday.getUTCDate()} ${endMonth} ${buddhistYear}`;
}

/** "สิงหาคม 2569" */
export function formatThaiMonth(today: ThaiToday): string {
  return `${THAI_MONTH_NAMES[today.month - 1]} ${today.year + 543}`;
}
