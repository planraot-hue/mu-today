import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import { PhromYanDeck } from "./PhromYanDeck";

export default async function PhromYanPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <main className="mx-auto max-w-4xl px-4 pb-8 pt-6 sm:px-5">
      <header className="mb-4">
        <h1 className="font-cute text-3xl text-ink">🔯 ไพ่พรหมญาณ</h1>
        <p className="text-sm text-ink-soft">
          ตั้งจิตอธิษฐาน แล้วเลือกไพ่ 1 ใบจากที่วางคว่ำไว้
        </p>
      </header>

      <PhromYanDeck />
    </main>
  );
}
