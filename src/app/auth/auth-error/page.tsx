import Link from "next/link";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;

  const message =
    reason === "missing-code"
      ? "ลิงก์ยืนยันไม่สมบูรณ์ อาจถูกตัดตอนคัดลอกมา"
      : "ลิงก์ยืนยันหมดอายุหรือถูกใช้ไปแล้ว";

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-blob border border-line bg-card/85 p-7 text-center shadow-sm">
        <p className="text-5xl" aria-hidden>
          🌧️
        </p>
        <h1 className="mt-2 font-cute text-2xl text-ink">
          ยืนยันอีเมลไม่สำเร็จ
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{message}</p>

        <Link
          href="/login"
          className="mt-5 inline-block rounded-full bg-blossom-deep px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          กลับไปหน้าเข้าสู่ระบบ
        </Link>
      </div>
    </main>
  );
}
