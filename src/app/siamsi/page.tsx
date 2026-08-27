import { redirect } from "next/navigation";
import { getSession } from "@/lib/session-cookie";
import { SiamsiShaker } from "./SiamsiShaker";

export default async function SiamsiPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <main className="mx-auto max-w-4xl px-4 pb-8 pt-6 sm:px-5">
      <header className="mb-4">
        <h1 className="font-cute text-3xl text-ink">🥢 เสี่ยงเซียมซี</h1>
        <p className="text-sm text-ink-soft">
          เลือกวัดดังจาก 4 ภาค แล้วเขย่ากระบอกเซียมซีด้วยตัวเอง
        </p>
      </header>

      <SiamsiShaker />
    </main>
  );
}
