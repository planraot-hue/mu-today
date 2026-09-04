"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Message = {
  role: "user" | "model";
  text: string;
};

const SUGGESTIONS = [
  "เว็บนี้ทำอะไรได้บ้าง",
  "วันนี้ใส่สีอะไรดี",
  "ทักษาปกรณ์คืออะไร",
  "ปีนี้ใครชงบ้าง",
];

const GREETING =
  "สวัสดีค่ะ น้องมูเองนะคะ 🔮 ถามได้เลยว่าเว็บนี้ใช้ยังไง หรืออยากรู้เรื่องสีมงคล ทักษา ราศี ดวงจีน อะไรก็ได้ค่ะ";

const TIP_KEY = "mutoday:chat-tip-seen";

/** หน้าน้องมูแบบย่อ วาดด้วย SVG ให้เข้าชุดกับตัวการ์ตูนในหน้าเว็บ */
function MuFace({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      {/* ผมด้านหลัง */}
      <circle cx="20" cy="20" r="17" fill="#5C4A5E" />
      {/* หน้า */}
      <circle cx="20" cy="21" r="14" fill="#FFE0CC" />
      {/* หน้าม้า */}
      <path d="M6 18 A14 14 0 0 1 34 18 Q27 12 20 13 Q13 12 6 18 Z" fill="#5C4A5E" />
      {/* ตา */}
      <ellipse cx="15" cy="22" rx="1.9" ry="2.3" fill="#4A3B52" />
      <ellipse cx="25" cy="22" rx="1.9" ry="2.3" fill="#4A3B52" />
      {/* แก้ม */}
      <ellipse cx="10.5" cy="25" rx="2.6" ry="1.7" fill="#FFAFC5" opacity="0.8" />
      <ellipse cx="29.5" cy="25" rx="2.6" ry="1.7" fill="#FFAFC5" opacity="0.8" />
      {/* ปาก */}
      <path
        d="M17.5 26.5 Q20 29 22.5 26.5"
        stroke="#4A3B52"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* ดาวข้างหัว */}
      <circle cx="33" cy="9" r="2.4" fill="#F0B429" />
    </svg>
  );
}

export function ChatWidget() {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTip, setShowTip] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  /**
   * โผล่ฟองทักทายหลังเข้าเว็บสักพัก แล้วจำไว้ว่าเคยโผล่แล้วในการเข้าเว็บครั้งนี้
   * ใช้ sessionStorage ไม่ใช่ localStorage เพราะอยากให้ทักทายใหม่เมื่อกลับมาวันหลัง
   */
  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(TIP_KEY) === "1";
    } catch {
      // บางเบราว์เซอร์ปิด storage ไว้ — ถือว่ายังไม่เคยเห็น
    }
    if (dismissed) return;

    const timer = window.setTimeout(() => setShowTip(true), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  function dismissTip() {
    setShowTip(false);
    try {
      sessionStorage.setItem(TIP_KEY, "1");
    } catch {
      // เช่นเดียวกับด้านบน
    }
  }

  // เลื่อนลงล่างสุดทุกครั้งที่มีข้อความใหม่หรือข้อความไหลเพิ่ม
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, isSending]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // กด Esc ปิดแชท
  useEffect(() => {
    if (!isOpen) return;

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || isSending) return;

    setError(null);
    setInput("");

    const history: Message[] = [...messages, { role: "user", text: question }];
    // เติมช่องว่างของบอทไว้ก่อน แล้วค่อยเติมตัวอักษรเข้าไประหว่างสตรีม
    setMessages([...history, { role: "model", text: "" }]);
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error ?? "เชื่อมต่อไม่สำเร็จ กรุณาลองใหม่");
      }

      if (!response.body) throw new Error("ไม่ได้รับคำตอบจากเซิร์ฟเวอร์");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        answer += decoder.decode(value, { stream: true });

        // แทนที่ข้อความสุดท้าย (ของบอท) ด้วยข้อความที่ยาวขึ้นเรื่อยๆ
        setMessages((current) => {
          const next = [...current];
          next[next.length - 1] = { role: "model", text: answer };
          return next;
        });
      }
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "เกิดข้อผิดพลาด";
      setError(message);
      // เอาช่องว่างของบอทออก จะได้ไม่ค้างเป็นฟองเปล่า
      setMessages((current) => current.slice(0, -1));
    } finally {
      setIsSending(false);
    }
  }

  // หน้าเกี่ยวกับการเข้าสู่ระบบไม่ต้องมีแชท
  if (pathname === "/login" || pathname.startsWith("/auth/")) return null;

  return (
    <>
      {/* ฟองทักทาย โผล่ครั้งเดียวต่อการเข้าเว็บหนึ่งครั้ง */}
      {showTip && !isOpen && (
        <div className="animate-chat-tip fixed bottom-24 right-5 z-50 max-w-[15rem]">
          <div className="relative rounded-2xl rounded-br-sm border border-line bg-card px-4 py-3 shadow-lg">
            <button
              type="button"
              onClick={dismissTip}
              aria-label="ปิดคำทักทาย"
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-line bg-card text-xs text-ink-soft shadow-sm transition hover:text-ink"
            >
              ✕
            </button>

            <p className="text-sm leading-snug text-ink">
              สวัสดีค่ะ 👋 หาอะไรไม่เจอ หรืออยากรู้ว่าสีมงคลวันนี้คืออะไร
              <br />
              <span className="font-semibold text-lilac-deep">ถามน้องมูได้เลย</span>
            </p>
          </div>
        </div>
      )}

      {/* ปุ่มลอย */}
      <div className="fixed bottom-5 right-5 z-50">
        {/* วงกลมกระเพื่อมด้านหลัง ไม่รับคลิก */}
        {!isOpen && (
          <span
            aria-hidden
            className="animate-chat-ping pointer-events-none absolute inset-0 rounded-full grad-violet"
          />
        )}

        <button
          type="button"
          onClick={() => {
            setIsOpen((current) => !current);
            dismissTip();
          }}
          aria-expanded={isOpen}
          aria-label={isOpen ? "ปิดแชทผู้ช่วย" : "เปิดแชทกับน้องมู ผู้ช่วยประจำเว็บ"}
          className={`relative flex items-center gap-2 rounded-full shadow-xl transition hover:scale-105 active:scale-95 ${
            isOpen
              ? "h-14 w-14 justify-center border border-line bg-card text-xl text-ink"
              : "animate-chat-wiggle py-2 pl-2 pr-4 grad-violet"
          }`}
        >
          {isOpen ? (
            <span aria-hidden>✕</span>
          ) : (
            <>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/90">
                <MuFace />
              </span>
              <span className="text-sm font-semibold leading-tight">
                ถามน้องมู
                <span className="block text-[10px] font-normal opacity-90">
                  ผู้ช่วยประจำเว็บ
                </span>
              </span>
            </>
          )}

          {/* จุดกะพริบบอกว่าพร้อมคุย */}
          {!isOpen && (
            <span
              aria-hidden
              className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-gold-deep"
            />
          )}
        </button>
      </div>

      {/* แผงแชท */}
      {isOpen && (
        <section
          aria-label="แชทกับน้องมู"
          className="animate-pop-in fixed bottom-24 right-4 z-50 flex h-[min(30rem,calc(100dvh-8rem))] w-[min(23rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-blob border border-line bg-card shadow-xl"
        >
          <header className="flex items-center justify-between gap-2 border-b border-line px-4 py-3 grad-violet">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/90">
                <MuFace className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <p className="font-cute text-lg leading-tight">น้องมู</p>
                <p className="truncate text-[11px] opacity-90">
                  ผู้ช่วยประจำเว็บมูทูเดย์
                </p>
              </div>
            </div>

            {messages.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setMessages([]);
                  setError(null);
                }}
                className="shrink-0 rounded-full bg-white/25 px-3 py-1 text-xs transition hover:bg-white/40"
              >
                ล้างแชท
              </button>
            )}
          </header>

          {/* รายการข้อความ */}
          <div
            ref={scrollRef}
            aria-live="polite"
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
            <Bubble role="model" text={GREETING} />

            {messages.map((message, index) => (
              <Bubble
                key={`${index}-${message.role}`}
                role={message.role}
                text={
                  message.text ||
                  (isSending && index === messages.length - 1
                    ? "กำลังพิมพ์…"
                    : "")
                }
              />
            ))}

            {messages.length === 0 && (
              <ul className="space-y-2 pt-1">
                {SUGGESTIONS.map((suggestion) => (
                  <li key={suggestion}>
                    <button
                      type="button"
                      onClick={() => send(suggestion)}
                      className="w-full rounded-2xl border border-line bg-cream px-3 py-2 text-left text-xs text-ink transition hover:border-lilac-deep"
                    >
                      {suggestion}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {error && (
              <p
                role="alert"
                className="rounded-2xl bg-lilac/50 px-3 py-2 text-xs leading-relaxed text-danger"
              >
                {error}
              </p>
            )}
          </div>

          {/* ช่องพิมพ์ */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              send(input);
            }}
            className="flex gap-2 border-t border-line px-3 py-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={1000}
              placeholder="พิมพ์คำถามที่นี่…"
              aria-label="ข้อความถึงน้องมู"
              className="min-w-0 flex-1 rounded-full border border-line bg-cream px-4 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink-soft focus:border-lilac-deep focus:ring-2 focus:ring-lilac-deep/25"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 grad-violet"
            >
              {isSending ? "…" : "ส่ง"}
            </button>
          </form>

          <p className="px-4 pb-3 text-center text-[10px] leading-snug text-ink-soft">
            น้องมูเป็น AI ช่วยแนะนำการใช้เว็บ ไม่ได้ทำนายดวงเอง
            คำทำนายจริงอยู่ในแต่ละหน้า
          </p>
        </section>
      )}
    </>
  );
}

function Bubble({ role, text }: { role: Message["role"]; text: string }) {
  if (!text) return null;

  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <p
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-sm bg-lilac/60 text-ink"
            : "rounded-bl-sm bg-cream text-ink"
        }`}
      >
        {text}
      </p>
    </div>
  );
}
