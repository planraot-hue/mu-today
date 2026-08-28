/**
 * ทักษาปกรณ์ — ระบบพื้นฐานของโหราศาสตร์ไทย
 *
 * ที่มา: ตำราทักษาปกรณ์ (โหราศาสตร์ไทยสายพระคัมภีร์) ซึ่งวางดาวพระเคราะห์ 8 ดวง
 * ลงใน 8 ทิศ แล้วนับ "ภูมิ" ทั้งแปดเรียงจากดาวประจำวันเกิดของเจ้าชะตา
 *
 * ลำดับดาวตามทักษา (เลขทักษา) คือ ๑ ๒ ๓ ๔ ๗ ๕ ๘ ๖
 * = อาทิตย์ จันทร์ อังคาร พุธ เสาร์ พฤหัสบดี ราหู ศุกร์
 *
 * ภูมิทั้งแปดเรียงตามลำดับ: บริวาร อายุ เดช ศรี มูละ อุตสาหะ มนตรี กาลกิณี
 * โดยเริ่มนับ "บริวาร" ที่ดาวประจำวันเกิด
 *
 * ระบบนี้เป็นที่มาของ "สีมงคล" และ "สีกาลกิณี" ประจำวันเกิดที่คนไทยใช้กัน
 * ทั้งหมดในไฟล์นี้คำนวณจากกฎ ไม่ได้ฮาร์ดโค้ดคำตอบไว้
 */

export type PlanetKey =
  | "sun"
  | "moon"
  | "mars"
  | "mercury"
  | "jupiter"
  | "venus"
  | "saturn"
  | "rahu";

export type ColorSwatch = {
  name: string;
  hex: string;
};

export type Planet = {
  key: PlanetKey;
  /** เลขประจำดาวตามโหราศาสตร์ไทย */
  number: number;
  name: string;
  /** วันที่ดาวดวงนี้เป็นเจ้าการ */
  dayLabel: string;
  /** สีประจำดาว — ค่า hex ปรับเป็นโทนพาสเทลให้เข้ากับธีมเว็บ */
  colors: ColorSwatch[];
};

export const PLANETS: Record<PlanetKey, Planet> = {
  sun: {
    key: "sun",
    number: 1,
    name: "พระอาทิตย์",
    dayLabel: "วันอาทิตย์",
    colors: [
      { name: "แดง", hex: "#FF9AA8" },
      { name: "ชมพูอมส้ม", hex: "#FFB0A0" },
    ],
  },
  moon: {
    key: "moon",
    number: 2,
    name: "พระจันทร์",
    dayLabel: "วันจันทร์",
    colors: [
      { name: "ขาวนวล", hex: "#FFF6E5" },
      { name: "เหลืองอ่อน", hex: "#FFE08A" },
    ],
  },
  mars: {
    key: "mars",
    number: 3,
    name: "พระอังคาร",
    dayLabel: "วันอังคาร",
    colors: [
      { name: "ชมพู", hex: "#FFB3C6" },
      { name: "ชมพูกุหลาบ", hex: "#FFA5BC" },
    ],
  },
  mercury: {
    key: "mercury",
    number: 4,
    name: "พระพุธ",
    dayLabel: "วันพุธ (กลางวัน)",
    colors: [
      { name: "เขียว", hex: "#A8E0C0" },
      { name: "เขียวอ่อน", hex: "#C8EFD4" },
    ],
  },
  jupiter: {
    key: "jupiter",
    number: 5,
    name: "พระพฤหัสบดี",
    dayLabel: "วันพฤหัสบดี",
    colors: [
      { name: "ส้ม", hex: "#FFBE85" },
      { name: "แสด", hex: "#FFC49B" },
    ],
  },
  venus: {
    key: "venus",
    number: 6,
    name: "พระศุกร์",
    dayLabel: "วันศุกร์",
    colors: [
      { name: "ฟ้า", hex: "#A8D5F0" },
      { name: "น้ำเงินอ่อน", hex: "#8CA9E0" },
    ],
  },
  saturn: {
    key: "saturn",
    number: 7,
    name: "พระเสาร์",
    dayLabel: "วันเสาร์",
    colors: [
      { name: "ม่วง", hex: "#C3ACF0" },
      { name: "ดำ", hex: "#8A8194" },
    ],
  },
  rahu: {
    key: "rahu",
    number: 8,
    name: "พระราหู",
    dayLabel: "วันพุธ (กลางคืน)",
    colors: [
      { name: "เทา", hex: "#C4C2CC" },
      { name: "ดำควันบุหรี่", hex: "#9A9AA5" },
    ],
  },
};

/** ลำดับดาวตามทักษา: ๑ ๒ ๓ ๔ ๗ ๕ ๘ ๖ */
export const THAKSA_ORDER: PlanetKey[] = [
  "sun",
  "moon",
  "mars",
  "mercury",
  "saturn",
  "jupiter",
  "rahu",
  "venus",
];

export type BhumKey =
  | "borivan"
  | "ayu"
  | "det"
  | "si"
  | "mula"
  | "utsaha"
  | "montri"
  | "kalakini";

export type Bhum = {
  key: BhumKey;
  name: string;
  /** เรื่องที่ภูมินี้ดูแล ตามตำราทักษาปกรณ์ */
  governs: string;
  /** true = สีมงคล ใส่ได้ / false = สีต้องห้าม */
  auspicious: boolean;
  /** ภูมิที่ตำราแนะนำให้ใช้เสริมดวงมากที่สุด */
  highlighted: boolean;
};

/** ภูมิทั้งแปด เรียงตามลำดับการนับ เริ่มที่ดาวประจำวันเกิด */
export const BHUM_LIST: Bhum[] = [
  {
    key: "borivan",
    name: "บริวาร",
    governs: "คนรอบข้าง ครอบครัว ลูกน้อง ผู้ที่อยู่ในความดูแล",
    auspicious: true,
    highlighted: false,
  },
  {
    key: "ayu",
    name: "อายุ",
    governs: "สุขภาพ ความเป็นอยู่ การดำเนินชีวิตโดยรวม",
    auspicious: true,
    highlighted: false,
  },
  {
    key: "det",
    name: "เดช",
    governs: "อำนาจ บารมี ชื่อเสียง ความน่าเกรงขาม",
    auspicious: true,
    highlighted: true,
  },
  {
    key: "si",
    name: "ศรี",
    governs: "โชคลาภ ทรัพย์สิน เสน่ห์ สิริมงคล",
    auspicious: true,
    highlighted: true,
  },
  {
    key: "mula",
    name: "มูละ",
    governs: "หลักทรัพย์ มรดก รากฐานของชีวิต",
    auspicious: true,
    highlighted: false,
  },
  {
    key: "utsaha",
    name: "อุตสาหะ",
    governs: "ความเพียร ความสำเร็จที่ได้จากความพยายาม",
    auspicious: true,
    highlighted: false,
  },
  {
    key: "montri",
    name: "มนตรี",
    governs: "ผู้ใหญ่อุปถัมภ์ ผู้ให้การสนับสนุน",
    auspicious: true,
    highlighted: true,
  },
  {
    key: "kalakini",
    name: "กาลกิณี",
    governs: "สิ่งอัปมงคล อุปสรรค ศัตรู — ตำราให้หลีกเลี่ยง",
    auspicious: false,
    highlighted: false,
  },
];

export type ThaksaEntry = {
  bhum: Bhum;
  planet: Planet;
};

/**
 * ผูกทักษาของเจ้าชะตา
 * เริ่มนับบริวารที่ดาวประจำวันเกิด แล้วไล่ตามลำดับทักษาไปจนครบแปดภูมิ
 */
export function getThaksaChart(birthPlanet: PlanetKey): ThaksaEntry[] {
  const startIndex = THAKSA_ORDER.indexOf(birthPlanet);

  return BHUM_LIST.map((bhum, offset) => ({
    bhum,
    planet: PLANETS[THAKSA_ORDER[(startIndex + offset) % THAKSA_ORDER.length]],
  }));
}

/** หาภูมิของดาวดวงหนึ่ง เมื่อดูจากมุมของเจ้าชะตาที่เกิดวันหนึ่ง */
export function getBhumOf(
  birthPlanet: PlanetKey,
  otherPlanet: PlanetKey,
): Bhum {
  const chart = getThaksaChart(birthPlanet);
  const found = chart.find((entry) => entry.planet.key === otherPlanet);
  return found?.bhum ?? BHUM_LIST[0];
}

/** ดาวประจำวันในสัปดาห์ (0 = อาทิตย์ … 6 = เสาร์) */
const WEEKDAY_PLANETS: PlanetKey[] = [
  "sun",
  "moon",
  "mars",
  "mercury",
  "jupiter",
  "venus",
  "saturn",
];

/**
 * @param weekday 0–6
 * @param wednesdayNight ตำราไทยแยกคนเกิดวันพุธกลางคืน (หลัง 18.00 น.)
 *                       ให้อยู่ใต้พระราหู ไม่ใช่พระพุธ
 */
export function getPlanetOfWeekday(
  weekday: number,
  wednesdayNight = false,
): PlanetKey {
  if (weekday === 3 && wednesdayNight) return "rahu";
  return WEEKDAY_PLANETS[weekday];
}

/** สีมงคลที่ตำราแนะนำที่สุด — เดช ศรี มนตรี */
export function getHighlightedColors(birthPlanet: PlanetKey): ThaksaEntry[] {
  return getThaksaChart(birthPlanet).filter((entry) => entry.bhum.highlighted);
}

/** ภูมิกาลกิณี = สีต้องห้ามของเจ้าชะตา */
export function getKalakini(birthPlanet: PlanetKey): ThaksaEntry {
  const chart = getThaksaChart(birthPlanet);
  return chart[chart.length - 1];
}
