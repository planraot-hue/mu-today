/**
 * ตัวช่วยเกี่ยวกับการติดตั้งแอป ใช้ร่วมกันระหว่างปุ่มบนหัวเว็บกับแถบเชิญชวน
 */

/** beforeinstallprompt ยังไม่อยู่ใน TypeScript DOM lib และมีเฉพาะเบราว์เซอร์ตระกูล Chromium */
export type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

declare global {
  interface Window {
    /** สคริปต์ใน layout ดัก event ไว้ตั้งแต่ก่อน React ทำงาน */
    __muInstallPrompt?: InstallPromptEvent;
  }
}

/** ชื่อ event ภายในเว็บ ใช้ให้ปุ่มบนหัวเว็บสั่งเปิดขั้นตอนติดตั้งได้ */
export const INSTALL_REQUEST_EVENT = "mutoday:install";

/** ตรวจว่ากำลังเปิดจากไอคอนที่ติดตั้งไว้แล้วหรือไม่ */
export function isRunningInstalled(): boolean {
  if (typeof window === "undefined") return false;

  const standalone = window.matchMedia?.("(display-mode: standalone)").matches;
  // iOS ใช้ property นี้แทน display-mode
  const iosStandalone = (
    window.navigator as Navigator & { standalone?: boolean }
  ).standalone;

  return Boolean(standalone || iosStandalone);
}

export type Platform = "ios" | "android" | "desktop";

export function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "desktop";

  const ua = navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  if (/android/i.test(ua)) return "android";
  return "desktop";
}

/**
 * เลื่อนการเชิญชวนออกไปชั่วคราว ไม่ใช่ปิดถาวร
 *
 * เดิมเก็บเป็นธง "ปิดแล้ว" ถาวร ทำให้พอผู้ใช้กดไว้ก่อนครั้งเดียว
 * แถบก็ไม่มีวันกลับมาอีก ตอนนี้เก็บเป็นเวลาแล้วให้กลับมาใหม่ได้
 */
const SNOOZE_KEY = "mutoday:install-snoozed-until";
const SNOOZE_DAYS = 7;

export function snoozeInstallBanner(): void {
  try {
    const until = Date.now() + SNOOZE_DAYS * 24 * 60 * 60 * 1000;
    localStorage.setItem(SNOOZE_KEY, String(until));
  } catch {
    // บางเบราว์เซอร์ปิด storage ไว้ — ไม่เป็นไร แค่จะถามใหม่รอบหน้า
  }
}

export function isInstallBannerSnoozed(): boolean {
  try {
    const raw = localStorage.getItem(SNOOZE_KEY);
    if (!raw) return false;
    return Date.now() < Number(raw);
  } catch {
    return false;
  }
}
