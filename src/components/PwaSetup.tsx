"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  INSTALL_REQUEST_EVENT,
  detectPlatform,
  isInstallBannerSnoozed,
  isRunningInstalled,
  snoozeInstallBanner,
  type InstallPromptEvent,
  type Platform,
} from "@/lib/pwa";

/** ขั้นตอนติดตั้งด้วยมือ ใช้ตอนที่เบราว์เซอร์ไม่ยอมให้เรียกหน้าต่างติดตั้งเอง */
const MANUAL_STEPS: Record<Platform, { title: string; steps: string[] }> = {
  ios: {
    title: "บน iPhone / iPad (Safari)",
    steps: [
      "กดปุ่มแชร์ที่แถบด้านล่างของ Safari",
      "เลื่อนลงหา เพิ่มไปยังหน้าจอโฮม",
      "กด เพิ่ม มุมขวาบน",
    ],
  },
  android: {
    title: "บน Android (Chrome)",
    steps: [
      "กดปุ่มเมนูสามจุดมุมขวาบน",
      "เลือก ติดตั้งแอป หรือ เพิ่มลงในหน้าจอหลัก",
      "กด ติดตั้ง เพื่อยืนยัน",
    ],
  },
  desktop: {
    title: "บนคอมพิวเตอร์ (Chrome / Edge)",
    steps: [
      "มองหาไอคอนติดตั้งที่ท้ายแถบที่อยู่เว็บ",
      "ถ้าไม่เจอ ให้กดเมนูสามจุดมุมขวาบน",
      "เลือก ติดตั้ง แล้วกดยืนยัน",
    ],
  },
};

export function PwaSetup() {
  const pathname = usePathname();

  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(
    null,
  );
  const [installed, setInstalled] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [platform, setPlatform] = useState<Platform>("desktop");

  /* ---------- ลงทะเบียน service worker ---------- */

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.error("ลงทะเบียน service worker ไม่สำเร็จ", error);
      });
    };

    if (document.readyState === "complete") {
      register();
      return;
    }

    window.addEventListener("load", register);
    return () => window.removeEventListener("load", register);
  }, []);

  /* ---------- ติดตามสถานะการติดตั้ง ---------- */

  useEffect(() => {
    setPlatform(detectPlatform());
    setInstalled(isRunningInstalled());

    // ถ้าผู้ใช้ถอนการติดตั้ง display-mode จะเปลี่ยนกลับ ต้องอัปเดตตาม
    const media = window.matchMedia("(display-mode: standalone)");
    const syncInstalled = () => setInstalled(isRunningInstalled());
    media.addEventListener("change", syncInstalled);

    return () => media.removeEventListener("change", syncInstalled);
  }, []);

  /* ---------- ดัก beforeinstallprompt ---------- */

  useEffect(() => {
    // สคริปต์ใน layout อาจดักไว้ให้แล้วตั้งแต่ก่อน React ทำงาน
    if (window.__muInstallPrompt) {
      setPromptEvent(window.__muInstallPrompt);
    }

    function handlePrompt(event: Event) {
      event.preventDefault();
      const promptable = event as InstallPromptEvent;
      window.__muInstallPrompt = promptable;
      setPromptEvent(promptable);
    }

    function handleInstalled() {
      window.__muInstallPrompt = undefined;
      setPromptEvent(null);
      setInstalled(true);
      setShowBanner(false);
      setShowGuide(false);
    }

    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  /* ---------- แถบเชิญชวน ---------- */

  useEffect(() => {
    if (installed || !promptEvent || isInstallBannerSnoozed()) {
      setShowBanner(false);
      return;
    }

    const timer = window.setTimeout(() => setShowBanner(true), 2500);
    return () => window.clearTimeout(timer);
  }, [installed, promptEvent]);

  /* ---------- เรียกหน้าต่างติดตั้ง ---------- */

  const startInstall = useCallback(async () => {
    setShowBanner(false);

    if (!promptEvent) {
      // เบราว์เซอร์ไม่ยอมให้เรียกเอง เช่นเพิ่งถอนการติดตั้งไป
      // หรือเป็น iOS ที่ไม่มี API นี้ตั้งแต่แรก จึงบอกขั้นตอนทำมือแทน
      setShowGuide(true);
      return;
    }

    try {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice.outcome === "accepted") setInstalled(true);
    } catch (error) {
      console.error("เปิดหน้าต่างติดตั้งไม่สำเร็จ", error);
      setShowGuide(true);
    } finally {
      // ใช้ได้ครั้งเดียวต่อหนึ่ง event ต้องทิ้งไป
      window.__muInstallPrompt = undefined;
      setPromptEvent(null);
    }
  }, [promptEvent]);

  /* ---------- ฟังคำสั่งจากปุ่มบนหัวเว็บ ---------- */

  useEffect(() => {
    function handleRequest() {
      void startInstall();
    }

    window.addEventListener(INSTALL_REQUEST_EVENT, handleRequest);
    return () => window.removeEventListener(INSTALL_REQUEST_EVENT, handleRequest);
  }, [startInstall]);

  /* ---------- ปิดคู่มือด้วย Esc ---------- */

  useEffect(() => {
    if (!showGuide) return;

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setShowGuide(false);
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showGuide]);

  const onAuthPage = pathname === "/login" || pathname.startsWith("/auth/");
  const manual = MANUAL_STEPS[platform];

  return (
    <>
      {/* แถบเชิญชวน */}
      {showBanner && !onAuthPage && (
        <div className="animate-chat-tip fixed bottom-5 left-4 right-4 z-40 mx-auto max-w-md sm:left-5 sm:right-auto sm:mx-0">
          <div className="flex items-start gap-3 rounded-blob border border-line bg-card p-4 shadow-xl">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-2xl grad-violet">
              🔮
            </span>

            <div className="min-w-0 flex-1">
              <p className="font-cute text-lg leading-tight text-ink">
                ติดตั้งมูทูเดย์ไว้ในเครื่อง
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">
                เปิดได้เร็วเหมือนแอป ดูหน้าที่เคยเข้าแล้วได้แม้ตอนเน็ตหลุด
              </p>

              <div className="mt-2.5 flex gap-2">
                <button
                  type="button"
                  onClick={() => void startInstall()}
                  className="rounded-full px-4 py-2 text-xs font-semibold grad-violet"
                >
                  ติดตั้งเลย
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowBanner(false);
                    snoozeInstallBanner();
                  }}
                  className="rounded-full border border-line px-4 py-2 text-xs text-ink-soft transition hover:text-ink"
                >
                  ไว้ก่อน
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* คู่มือติดตั้งด้วยมือ */}
      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/35 p-4 sm:items-center"
          onClick={() => setShowGuide(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="วิธีติดตั้งมูทูเดย์"
            onClick={(event) => event.stopPropagation()}
            className="animate-pop-in w-full max-w-sm rounded-blob border border-line bg-card p-6 shadow-xl"
          >
            <div className="text-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl text-3xl grad-violet">
                📲
              </span>
              <h2 className="mt-3 font-cute text-2xl text-ink">
                ติดตั้งมูทูเดย์
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                ทำตามขั้นตอนนี้เพื่อเพิ่มไว้ที่หน้าจอเครื่องค่ะ
              </p>
            </div>

            <div className="mt-4 rounded-2xl bg-lilac/35 p-4">
              <p className="text-sm font-semibold text-ink">{manual.title}</p>
              <ol className="mt-2 space-y-2">
                {manual.steps.map((step, index) => (
                  <li key={step} className="flex gap-2 text-sm text-ink">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lilac-deep text-[11px] font-semibold text-white">
                      {index + 1}
                    </span>
                    <span className="leading-snug">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <p className="mt-3 rounded-2xl bg-gold/50 p-3 text-xs leading-relaxed text-ink">
              ถ้าเพิ่งถอนการติดตั้งไป เบราว์เซอร์อาจซ่อนปุ่มติดตั้งอัตโนมัติไว้สักพัก
              ให้ใช้วิธีในเมนูตามขั้นตอนด้านบนได้เลยค่ะ
            </p>

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="mt-4 w-full rounded-full border border-line px-4 py-2.5 text-sm text-ink-soft transition hover:text-ink"
            >
              เข้าใจแล้ว
            </button>
          </div>
        </div>
      )}
    </>
  );
}
