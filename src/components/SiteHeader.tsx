"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions";

const NAV_ITEMS = [
  { href: "/", label: "สีมงคล", emoji: "🎨" },
  { href: "/horoscope", label: "ดวงราศี", emoji: "🔮" },
  { href: "/siamsi", label: "เซียมซี", emoji: "🥢" },
  { href: "/tarot", label: "ทาโรต์", emoji: "🃏" },
];

export function SiteHeader() {
  const pathname = usePathname();

  // หน้า login ไม่ควรเห็นเมนูหรือปุ่มออกจากระบบ
  if (pathname === "/login") return null;

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

        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-full border border-line bg-card/70 px-3 py-1.5 text-xs text-ink-soft transition hover:border-blossom-deep hover:text-blossom-deep"
          >
            ออกจากระบบ
          </button>
        </form>
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
                      ? "border-transparent bg-blossom-deep text-white shadow-sm"
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
