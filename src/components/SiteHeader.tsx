"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { exitGuestAction, signOutAction } from "@/app/actions";
import { InstallAppButton } from "@/components/InstallAppButton";
import { PopularTab } from "@/components/PopularTab";
import { FEATURES } from "@/lib/features";

export function SiteHeader({
  email,
  isGuest,
}: {
  email: string | null;
  isGuest: boolean;
}) {
  const pathname = usePathname();

  // หน้าเกี่ยวกับการเข้าสู่ระบบไม่ควรเห็นเมนูหรือปุ่มออกจากระบบ
  if (pathname === "/login" || pathname.startsWith("/auth/")) return null;

  return (
    <header className="mx-auto w-full max-w-4xl px-4 pt-5 sm:px-5">
      <div className="flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden>
            🔮
          </span>
          <span className="font-cute text-2xl leading-none text-ink">
            มูทูเดย์
          </span>
        </Link>

        <div className="flex min-w-0 items-center gap-2">
          <InstallAppButton />

          {isGuest ? (
            <>
              <span className="hidden rounded-full bg-gold/70 px-3 py-1 text-xs text-ink sm:inline">
                👀 โหมดผู้เยี่ยมชม
              </span>
              <form action={exitGuestAction}>
                <button
                  type="submit"
                  className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold grad-violet"
                >
                  เข้าสู่ระบบ
                </button>
              </form>
            </>
          ) : (
            <>
              {email && (
                <span
                  className="hidden max-w-[180px] truncate text-xs text-ink-soft sm:inline"
                  title={email}
                >
                  {email}
                </span>
              )}

              <form action={signOutAction}>
                <button
                  type="submit"
                  className="shrink-0 rounded-full border border-line bg-card/70 px-3 py-1.5 text-xs text-ink-soft transition hover:border-lilac-deep hover:text-lilac-deep"
                >
                  ออกจากระบบ
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <PopularTab />

      <nav className="mt-4">
        <ul className="grid grid-cols-4 gap-1.5 sm:grid-cols-8 sm:gap-2">
          {FEATURES.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex flex-col items-center justify-center gap-0.5 rounded-2xl border px-1 py-2 text-center transition hover:-translate-y-0.5 ${
                    isActive
                      ? `${item.grad} scale-[1.03] shadow-md`
                      : `border-line ${item.tint} text-ink hover:shadow-sm`
                  }`}
                >
                  <span className="text-xl leading-none" aria-hidden>
                    {item.emoji}
                  </span>
                  <span className="text-[11px] leading-tight">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
