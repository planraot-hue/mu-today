"use client";

import { useEffect, useState } from "react";
import { INSTALL_REQUEST_EVENT, isRunningInstalled } from "@/lib/pwa";

/**
 * ปุ่มติดตั้งถาวรบนหัวเว็บ
 *
 * มีไว้เพราะ beforeinstallprompt พึ่งพาไม่ได้ — เบราว์เซอร์ยิง event นี้ครั้งเดียว
 * และหลังผู้ใช้ถอนการติดตั้งจะระงับไว้อีกพักใหญ่ ถ้ามีแต่แถบเชิญชวนที่รอ event
 * ผู้ใช้จะไม่เหลือทางติดตั้งซ้ำเลย ปุ่มนี้จึงเรียกคู่มือติดตั้งด้วยมือแทนได้เสมอ
 *
 * ตัวปุ่มแค่ส่ง event ภายในเว็บ ส่วนตรรกะติดตั้งอยู่ที่ PwaSetup ที่เดียว
 */
export function InstallAppButton() {
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

  // ติดตั้งแล้วก็ไม่ต้องชวนอีก
  if (installed) return null;

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(INSTALL_REQUEST_EVENT))}
      title="ติดตั้งมูทูเดย์ไว้ในเครื่อง"
      className="shrink-0 rounded-full border border-line bg-card/70 px-3 py-1.5 text-xs text-ink-soft transition hover:border-lilac-deep hover:text-lilac-deep"
    >
      <span aria-hidden>📲</span>
      <span className="ml-1 hidden sm:inline">ติดตั้งแอป</span>
    </button>
  );
}
