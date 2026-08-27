import { LoginForm } from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-7 shadow-sm">
        <div className="mb-6 space-y-1">
          <h1 className="text-xl font-semibold text-foreground">เข้าสู่ระบบ</h1>
          <p className="text-sm text-muted">
            หน้านี้เปิดให้เฉพาะผู้ที่มีรหัสผ่านเท่านั้น
          </p>
        </div>

        <LoginForm next={next ?? "/"} />
      </div>
    </main>
  );
}
