import { redirect } from "next/navigation";
import { getViewer } from "@/lib/viewer";
import { getThaiToday } from "@/lib/thai-date";
import { ChineseFortune } from "./ChineseFortune";

export const dynamic = "force-dynamic";

export default async function ChinesePage() {
  const viewer = await getViewer();
  if (!viewer.canView) redirect("/login");

  const today = getThaiToday();

  return (
    <main className="mx-auto max-w-4xl px-4 pb-8 pt-6 sm:px-5">
      <header className="mb-4">
        <h1 className="font-cute text-3xl text-ink">🧧 ดูดวงแบบจีน</h1>
        <p className="text-sm text-ink-soft">
          12 นักษัตร ธาตุประจำปีเกิด ดวงปีนี้ และเช็กว่าปีนี้ชงหรือไม่
        </p>
      </header>

      <ChineseFortune currentYear={today.year} />
    </main>
  );
}
