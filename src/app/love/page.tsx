import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/server";
import { LoveMatch } from "./LoveMatch";

export default async function LovePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <main className="mx-auto max-w-4xl px-4 pb-8 pt-6 sm:px-5">
      <header className="mb-4">
        <h1 className="font-cute text-3xl text-ink">💞 ดวงสมพงศ์คู่รัก</h1>
        <p className="text-sm text-ink-soft">
          กรอกวันเกิดของทั้งสองคน แล้วดูว่าเข้ากันได้แค่ไหนตามตำราไทยและจีน
        </p>
      </header>

      <LoveMatch />
    </main>
  );
}
