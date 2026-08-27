import { LoginForm } from "./LoginForm";

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
            ดูดวงประจำวัน · ใส่รหัสผ่านเพื่อเข้าใช้งาน
          </p>
        </div>

        <LoginForm next={next ?? "/"} />
      </div>
    </main>
  );
}
