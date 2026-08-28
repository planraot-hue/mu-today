import { redirect } from "next/navigation";
import { getViewer } from "@/lib/viewer";
import { getThaiToday } from "@/lib/thai-date";
import { BirthFortune } from "./BirthFortune";

export const dynamic = "force-dynamic";

export default async function BirthPage() {
  const viewer = await getViewer();
  if (!viewer.canView) redirect("/login");

  const today = getThaiToday();

  return (
    <main className="mx-auto max-w-4xl px-4 pb-8 pt-6 sm:px-5">
      <header className="mb-4">
        <h1 className="font-cute text-3xl text-ink">🎂 ดวงวันเดือนปีเกิด</h1>
        <p className="text-sm text-ink-soft">
          กรอกวันเกิดแล้วดูนิสัย สีมงคล ราศี นักษัตรจีน และเลขชีวิตของคุณ
        </p>
      </header>

      {/* คีย์วันที่คำนวณฝั่ง server ตามเวลาไทย เพื่อไม่ให้ client กับ server ได้ผลต่างกัน */}
      <BirthFortune todayKey={today.isoDate} />
    </main>
  );
}
