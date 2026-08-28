import { MAJOR_ARCANA } from "./tarot-major";
import { MINOR_ARCANA } from "./tarot-minor";
import { SUIT_INFO, type TarotCard, type TarotSuit } from "./tarot-types";

export { SUIT_INFO };
export type { TarotCard, TarotSuit };

/** สำรับเต็ม 78 ใบ — ชุดใหญ่ 22 ใบ + ชุดเล็ก 56 ใบ */
export const TAROT_DECK: TarotCard[] = [...MAJOR_ARCANA, ...MINOR_ARCANA];

export const DECK_SIZE = TAROT_DECK.length;

export type TarotSpreadType = "single" | "three";

export type DrawnCard = {
  card: TarotCard;
  reversed: boolean;
  /** ตำแหน่งในการเปิดไพ่ เช่น "อดีต" */
  position: string;
};

export const THREE_CARD_POSITIONS = ["อดีต", "ปัจจุบัน", "อนาคต"] as const;

export const POSITION_HINTS: Record<string, string> = {
  "อดีต": "สิ่งที่ผ่านมาและยังส่งผลถึงตอนนี้",
  "ปัจจุบัน": "สถานการณ์ที่กำลังเผชิญอยู่",
  "อนาคต": "แนวโน้มที่กำลังจะเกิดขึ้น",
  "คำตอบ": "คำตอบสำหรับสิ่งที่คุณถาม",
};

/**
 * สับไพ่แล้วหยิบตามจำนวนที่ต้องการ พร้อมสุ่มว่าไพ่ตั้งตรงหรือกลับหัว
 * ใช้ Math.random เพราะต้องได้ผลใหม่ทุกครั้ง และเรียกหลังผู้ใช้กดเท่านั้น
 * จึงไม่กระทบการ render ครั้งแรก
 */
export function drawCards(count: number): DrawnCard[] {
  const deck = [...TAROT_DECK];

  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck.slice(0, count).map((card, index) => ({
    card,
    reversed: Math.random() < 0.35,
    position: count === 1 ? "คำตอบ" : THREE_CARD_POSITIONS[index],
  }));
}
