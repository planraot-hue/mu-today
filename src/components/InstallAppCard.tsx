"use client";

import { useEffect, useState } from "react";
import { INSTALL_REQUEST_EVENT, isRunningInstalled } from "@/lib/pwa";

/**
 * การ์ดเชิญชวนติดตั้งบนหน้าแรก
 *
 * มีเพิ่มจากปุ่มบนหัวเว็บ เพราะปุ่มบนหัวเว็บเล็กและอยู่ปนกับปุ่มอื่น
 * ผู้ใช้มองไม่เห็น การ์ดนี้อยู่ในสายตาแน่นอนและอธิบายด้วยว่าติดตั้งแล้วได้อะไร
 *
 * ซ่อนตัวเองเมื่อเปิดจากแอปที่ติดตั้งแล้ว
 */
export function InstallAppCard() {
  const [installed, setInstalled] = useState(true);

  useEffect(() => {
    setInstalled(isRunningInstalled());

    const media = window.matchMedia("(display-mode: standalone)");
    const sync = () => setInstalled(isRunningInstalled());

    media.addEventListener("change", sync);
    window.addEventListener("appinstalled", sync);

    return () => {
      media.removeEventListener("change", sync);
      window.removeEventListener("appinstalled", sync);
    };
  }, []);

  if (installed) return null;

  return (
    <section className="mt-5 rounded-blob border border-line p-5 shadow-sm sm:p-6 grad-soft-violet">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl grad-violet">
          📲
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="font-cute text-xl leading-tight text-ink">
            ติดตั้งมูทูเดย์ไว้ในเครื่อง
          </h2>
          <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">
            เปิดได้เร็วเหมือนแอป มีไอคอนอยู่หน้าจอ
            และเปิดหน้าที่เคยเข้าแล้วได้แม้ตอนเน็ตหลุด
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            window.dispatchEvent(new CustomEvent(INSTALL_REQUEST_EVENT))
          }
          className="w-full shrink-0 rounded-full px-6 py-3 text-sm font-semibold sm:w-auto grad-violet"
        >
          ติดตั้งเลย
        </button>
      </div>
    </section>
  );
}
