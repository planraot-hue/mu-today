"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { featureIdOf, type Feature } from "@/lib/features";

type PopularFeature = Feature & { clicks: number };

/**
 * แท็บ "มาแรงตอนนี้" — แนะนำฟีเจอร์เดียวที่คนคลิกดูมากที่สุด
 *
 * ทุกครั้งที่เปลี่ยนหน้า จะยิงไปนับหนึ่งคลิกให้หน้านั้นแล้วรับยอดล่าสุดกลับมาเลย
 * ในคำตอบเดียวกัน จึงไม่ต้องยิงสอง request ต่อการเปลี่ยนหน้าหนึ่งครั้ง
 *
 * นับที่การเปลี่ยนหน้าแทนที่จะดักที่ปุ่มเมนู เพราะคนที่เข้าจากลิงก์ที่แชร์กันมา
 * ก็ควรถูกนับด้วย ไม่งั้นยอดจะเอียงไปทางคนที่กดเมนูอย่างเดียว
 *
 * ถ้ายังไม่ได้รันสคริปต์ใน Supabase หรือยังไม่มีใครคลิกเลย แท็บนี้จะไม่ขึ้น
 * ดีกว่าโชว์ตัวเลขปลอมหรือช่องว่างที่ไม่มีความหมาย
 */
export function PopularTab() {
  const pathname = usePathname();
  const [top, setTop] = useState<PopularFeature | null>(null);

  useEffect(() => {
    const currentId = featureIdOf(pathname);
    const controller = new AbortController();

    fetch("/api/popular", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: currentId }),
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setTop(data?.top ?? null))
      .catch(() => {
        // ออฟไลน์ ตารางยังไม่มี หรือ request ถูกยกเลิกตอนเปลี่ยนหน้า — ซ่อนแท็บไว้
      });

    return () => controller.abort();
  }, [pathname]);

  if (!top) return null;

  return (
    <Link
      href={top.href}
      className="mt-4 flex items-center gap-3 rounded-2xl border border-gold-soft bg-gold/40 px-3 py-2.5 transition hover:-translate-y-0.5 hover:shadow-sm"
    >
      <span className="shrink-0 rounded-full bg-card px-2.5 py-1 text-[11px] font-semibold text-gold-deep">
        🔥 มาแรง
      </span>

      <span className="text-xl leading-none" aria-hidden>
        {top.emoji}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block font-cute text-base leading-tight text-ink">
          {top.label}
        </span>
        <span className="block truncate text-[11px] leading-tight text-ink-soft">
          {top.blurb}
        </span>
      </span>

      <span className="shrink-0 text-[11px] text-ink-soft">
        {top.clicks.toLocaleString("th-TH")} ครั้ง
      </span>
    </Link>
  );
}
