import Link from "next/link";

export const metadata = {
  title: "ออฟไลน์อยู่ · มูทูเดย์",
};

/**
 * หน้าที่ service worker เสิร์ฟให้เมื่อเน็ตหลุดและไม่มีหน้านั้นในแคช
 *
 * ต้องเข้าได้โดยไม่ต้องล็อกอิน เพราะ service worker แคชหน้านี้ตอนติดตั้ง
 * ซึ่งเป็นจังหวะที่อาจยังไม่มีคุกกี้ (ดู PUBLIC_PATHS ใน middleware)
 */
export default function OfflinePage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-blob border border-line bg-card/85 p-7 text-center shadow-sm">
        <p className="animate-float-soft text-6xl" aria-hidden>
          🔌
        </p>

        <h1 className="mt-3 font-cute text-2xl text-ink">ตอนนี้ออฟไลน์อยู่</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          หน้านี้ยังไม่เคยเปิดตอนมีเน็ตเลยไม่มีเก็บไว้ในเครื่อง
          ลองเช็กสัญญาณแล้วกดลองใหม่อีกครั้งนะคะ
        </p>

        <p className="mt-3 rounded-2xl bg-gold/50 p-3 text-xs leading-relaxed text-ink">
          หน้าที่เคยเปิดตอนมีเน็ตแล้วจะยังดูย้อนหลังได้ปกติ
          ส่วนแชทกับการเข้าสู่ระบบต้องต่อเน็ตเสมอ
        </p>

        <Link
          href="/"
          className="mt-5 inline-block rounded-full px-5 py-2.5 text-sm font-semibold grad-violet"
        >
          ลองกลับหน้าแรก
        </Link>
      </div>
    </main>
  );
}
