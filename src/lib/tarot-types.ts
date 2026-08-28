/** ชนิดข้อมูลของไพ่ทาโรต์ แยกไว้เพื่อไม่ให้ไฟล์ข้อมูลอ้างอิงวนกัน */

export type TarotSuit = "wands" | "cups" | "swords" | "pentacles";

export type TarotCard = {
  id: string;
  arcana: "major" | "minor";
  /** มีเฉพาะไพ่ชุดเล็ก */
  suit?: TarotSuit;
  name: string;
  nameEn: string;
  symbol: string;
  keywords: string[];
  upright: string;
  reversed: string;
};

export const SUIT_INFO: Record<
  TarotSuit,
  { label: string; emoji: string; element: string; theme: string; hex: string }
> = {
  wands: {
    label: "ไม้เท้า",
    emoji: "🔥",
    element: "ไฟ",
    theme: "แรงบันดาลใจ การลงมือทำ",
    hex: "#FFBE85",
  },
  cups: {
    label: "ถ้วย",
    emoji: "💧",
    element: "น้ำ",
    theme: "อารมณ์ ความรัก ความสัมพันธ์",
    hex: "#A8D5F0",
  },
  swords: {
    label: "ดาบ",
    emoji: "🗡️",
    element: "ลม",
    theme: "ความคิด การสื่อสาร ความจริง",
    hex: "#C3ACF0",
  },
  pentacles: {
    label: "เหรียญ",
    emoji: "🪙",
    element: "ดิน",
    theme: "การเงิน การงาน ร่างกาย",
    hex: "#A8E0C0",
  },
};
