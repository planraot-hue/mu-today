import { LoginForm } from "./LoginForm";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-blob border border-line bg-card/85 p-7 shadow-sm backdrop-blur-sm">
        <div className="mb-6 text-center">
          <p className="animate-float-soft text-5xl" aria-hidden>
            🔮
          </p>
          <h1 className="mt-2 font-cute text-3xl text-ink">มูทูเดย์</h1>
          <p className="mt-1 text-sm text-ink-soft">
            ดูดวงประจำวัน · เข้าสู่ระบบเพื่อเริ่มใช้งาน
          </p>
        </div>

        {isSupabaseConfigured ? (
          <LoginForm next={next ?? "/"} />
        ) : (
          <div className="rounded-2xl bg-butter/60 p-4 text-sm leading-relaxed text-ink">
            <p className="font-semibold">ยังเชื่อมต่อ Supabase ไม่ได้</p>
            <p className="mt-1 text-ink-soft">
              ต้องตั้งค่า <code>NEXT_PUBLIC_SUPABASE_URL</code> และ{" "}
              <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> ก่อน ดูขั้นตอนได้ใน
              README.md
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
