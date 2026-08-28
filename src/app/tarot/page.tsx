import { redirect } from "next/navigation";
import { getViewer } from "@/lib/viewer";
import { TarotReader } from "./TarotReader";

export default async function TarotPage() {
  const viewer = await getViewer();
  if (!viewer.canView) redirect("/login");

  return (
    <main className="mx-auto max-w-4xl px-4 pb-8 pt-6 sm:px-5">
      <header className="mb-4">
        <h1 className="font-cute text-3xl text-ink">🃏 ไพ่ทาโรต์</h1>
        <p className="text-sm text-ink-soft">
          ไพ่ชุดหลัก 22 ใบ เปิดได้ทั้งแบบใบเดียวและแบบสามใบ
        </p>
      </header>

      <TarotReader />
    </main>
  );
}
