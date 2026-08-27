import { redirect } from "next/navigation";
import { getSession } from "@/lib/session-cookie";
import { logoutAction } from "./actions";

export default async function HomePage() {
  // ตรวจซ้ำอีกชั้นนอกเหนือจาก middleware — หน้าที่ต้องล็อกอินไม่ควรพึ่ง middleware อย่างเดียว
  const session = await getSession();
  if (!session) redirect("/login");

  const issuedAt = session.iat
    ? new Date(session.iat * 1000).toLocaleString("th-TH")
    : null;

  return (
    <div className="min-h-dvh">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-4">
          <span className="font-semibold text-foreground">ระบบภายใน</span>

          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition hover:border-danger hover:text-danger"
            >
              ออกจากระบบ
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-5 px-5 py-10">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            เข้าสู่ระบบเรียบร้อย
          </h1>
          <p className="mt-1 text-sm text-muted">
            {issuedAt
              ? `เข้าสู่ระบบเมื่อ ${issuedAt} · session มีอายุ 7 วัน`
              : "session มีอายุ 7 วัน"}
          </p>
        </div>

        {/*
          จุดสำหรับเติมฟีเจอร์ต่อไป
          ทุกหน้าที่สร้างเพิ่มใน src/app/ จะถูก middleware กันให้อัตโนมัติอยู่แล้ว
          ยกเว้น /login — ไม่ต้องเขียนโค้ดตรวจสิทธิ์ซ้ำ (แต่แนะนำให้เรียก getSession()
          ในหน้านั้นด้วย เหมือนที่ทำในไฟล์นี้)
        */}
        <section className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
          <p className="text-sm text-muted">
            พื้นที่สำหรับฟีเจอร์ถัดไป — เพิ่มหน้าใหม่ได้ที่{" "}
            <code className="rounded bg-background px-1.5 py-0.5 text-xs text-foreground">
              src/app/
            </code>
          </p>
        </section>
      </main>
    </div>
  );
}
