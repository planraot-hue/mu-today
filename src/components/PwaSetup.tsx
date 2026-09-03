"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * beforeinstallprompt ยังไม่อยู่ใน TypeScript DOM lib มาตรฐาน
 * และมีเฉพาะบนเบราว์เซอร์ตระกูล Chromium
 */
type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "mutoday:install-dismissed";

/** ตรวจว่าเปิดจากไอคอนที่ติดตั้งไว้แล้วหรือยัง */
function isRunningInstalled(): boolean {
  if (typeof window === "undefined") return false;

  const standalone = window.matchMedia?.("(display-mode: standalone)").matches;
  // iOS ใช้ property นี้แทน display-mode
  const iosStandalone = (
    window.navigator as Navigator & { standalone?: boolean }
  ).standalone;

  return Boolean(standalone || iosStandalone);
}

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function PwaSetup() {
  const pathname = usePathname();

  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(
    null,
  );
  const [showIosHint, setShowIosHint] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  /* ---------- ลงทะเบียน service worker ---------- */

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // รอให้หน้าโหลดเสร็จก่อน จะได้ไม่แย่งแบนด์วิดท์กับการเรนเดอร์ครั้งแรก
    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.error("ลงทะเบียน service worker ไม่สำเร็จ", error);
      });
    };

    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register);
      return () => window.removeEventListener("load", register);
    }
  }, []);

  /* ---------- ปุ่มติดตั้ง ---------- */

  useEffect(() => {
    if (isRunningInstalled()) return;

    let alreadyDismissed = false;
    try {
      alreadyDismissed = localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      // บางเบราว์เซอร์ปิด storage ไว้ — ถือว่ายังไม่เคยปิด
    }
    if (alreadyDismissed) return;

    setDismissed(false);

    // iOS ไม่มี beforeinstallprompt ต้องบอกวิธีทำเอง
    if (isIos()) {
      const timer = window.setTimeout(() => setShowIosHint(true), 4000);
      return () => window.clearTimeout(timer);
    }

    function handlePrompt(event: Event) {
      // กันไม่ให้เบราว์เซอร์ขึ้นแถบของตัวเอง จะได้ใช้ปุ่มที่ออกแบบเองแทน
      event.preventDefault();
      setInstallEvent(event as InstallPromptEvent);
    }

    function handleInstalled() {
      setInstallEvent(null);
      setShowIosHint(false);
    }

    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  function dismiss() {
    setInstallEvent(null);
    setShowIosHint(false);
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // เช่นเดียวกับด้านบน
    }
  }

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  }

  // หน้าเข้าสู่ระบบไม่ควรมีแถบมากวน และไม่ต้องโชว์ถ้าปิดไปแล้ว
  const hidden =
    dismissed ||
    pathname === "/login" ||
    pathname.startsWith("/auth/") ||
    (!installEvent && !showIosHint);

  if (hidden) return null;

  return (
    <div className="animate-chat-tip fixed bottom-5 left-4 right-4 z-40 mx-auto max-w-md sm:left-5 sm:right-auto sm:mx-0">
      <div className="flex items-start gap-3 rounded-blob border border-line bg-card p-4 shadow-xl">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-2xl grad-violet">
          🔮
        </span>

        <div className="min-w-0 flex-1">
          <p className="font-cute text-lg leading-tight text-ink">
            ติดตั้งมูทูเดย์ไว้ในเครื่อง
          </p>

          {showIosHint ? (
            <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">
              กดปุ่มแชร์ <span aria-hidden>􀈂</span> ด้านล่างของ Safari
              แล้วเลือก <strong>เพิ่มไปยังหน้าจอโฮม</strong>
            </p>
          ) : (
            <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">
              เปิดได้เร็วเหมือนแอป ดูสีมงคลย้อนหลังได้แม้ตอนเน็ตหลุด
            </p>
          )}

          <div className="mt-2.5 flex gap-2">
            {!showIosHint && (
              <button
                type="button"
                onClick={install}
                className="rounded-full px-4 py-2 text-xs font-semibold grad-violet"
              >
                ติดตั้งเลย
              </button>
            )}
            <button
              type="button"
              onClick={dismiss}
              className="rounded-full border border-line px-4 py-2 text-xs text-ink-soft transition hover:text-ink"
            >
              ไว้ก่อน
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
