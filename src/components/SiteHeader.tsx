"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { exitGuestAction, signOutAction } from "@/app/actions";

const NAV_ITEMS = [
  { href: "/", label: "สีมงคล", emoji: "🎨", grad: "grad-pink" },
  { href: "/birth", label: "วันเกิด", emoji: "🎂", grad: "grad-sun" },
  { href: "/horoscope", label: "ราศี", emoji: "🔮", grad: "grad-violet" },
  { href: "/chinese", label: "ดวงจีน", emoji: "🧧", grad: "grad-sun" },
  { href: "/love", label: "สมพงศ์", emoji: "💞", grad: "grad-pink" },
  { href: "/siamsi", label: "เซียมซี", emoji: "🥢", grad: "grad-mint" },
  { href: "/tarot", label: "ทาโรต์", emoji: "🃏", grad: "grad-sky" },
  { href: "/phrom-yan", label: "พรหมญาณ", emoji: "🔯", grad: "grad-violet" },
];

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
          {isGuest ? (
            <>
              <span className="hidden rounded-full bg-butter/70 px-3 py-1 text-xs text-ink sm:inline">
                👀 โหมดผู้เยี่ยมชม
              </span>
              <form action={exitGuestAction}>
                <button
                  type="submit"
                  className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold grad-pink"
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
                  className="shrink-0 rounded-full border border-line bg-card/70 px-3 py-1.5 text-xs text-ink-soft transition hover:border-blossom-deep hover:text-blossom-deep"
                >
                  ออกจากระบบ
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <nav className="mt-4">
        <ul className="flex gap-2 overflow-x-auto pb-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <li key={item.href} className="shrink-0">
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition ${
                    isActive
                      ? item.grad
                      : "border-line bg-card/70 text-ink-soft hover:border-blossom hover:text-ink"
                  }`}
                >
                  <span aria-hidden>{item.emoji}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
