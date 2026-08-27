import { redirect } from "next/navigation";
import { getSession } from "@/lib/session-cookie";
import {
  formatThaiFullDate,
  formatThaiMonth,
  formatThaiWeekRange,
  getThaiToday,
} from "@/lib/thai-date";
import { HoroscopeExplorer } from "./HoroscopeExplorer";

export const dynamic = "force-dynamic";

export default async function HoroscopePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const today = getThaiToday();

  return (
    <main className="mx-auto max-w-4xl px-4 pb-8 pt-6 sm:px-5">
      <header className="mb-4">
        <h1 className="font-cute text-3xl text-ink">🔮 ดวงราศี</h1>
        <p className="text-sm text-ink-soft">
          เลือกราศีแล้วดูดวงได้ทั้งรายวัน รายสัปดาห์ และรายเดือน
        </p>
      </header>

      {/* คีย์ช่วงเวลาคำนวณฝั่ง server ตามเวลาไทย แล้วส่งให้ client
          ทำให้คำทำนายที่ render บน server กับ browser ตรงกันเสมอ */}
      <HoroscopeExplorer
        periodKeys={{
          daily: today.isoDate,
          weekly: today.weekKey,
          monthly: today.monthKey,
        }}
        periodLabels={{
          daily: formatThaiFullDate(today),
          weekly: formatThaiWeekRange(today),
          monthly: formatThaiMonth(today),
        }}
      />
    </main>
  );
}
