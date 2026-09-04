"use client";

import { useCallback, useEffect, useState } from "react";
import {
  LEVEL_STYLES,
  TEMPLES,
  type SiamsiStick,
  type Temple,
} from "@/lib/siamsi";

/** DeviceMotionEvent.requestPermission มีเฉพาะบน iOS — TypeScript ยังไม่รู้จัก */
type MotionEventWithPermission = typeof DeviceMotionEvent & {
  requestPermission?: () => Promise<PermissionState | "granted" | "denied">;
};

export function SiamsiShaker() {
  const [temple, setTemple] = useState<Temple>(TEMPLES[0]);
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [result, setResult] = useState<SiamsiStick | null>(null);

  const [motionEnabled, setMotionEnabled] = useState(false);
  const [needsMotionPermission, setNeedsMotionPermission] = useState(false);

  const reset = useCallback(() => {
    setProgress(0);
    setHolding(false);
    setResult(null);
  }, []);

  function selectTemple(next: Temple) {
    setTemple(next);
    reset();
  }

  /* ---------- เขย่าด้วยการกดค้าง ---------- */

  useEffect(() => {
    if (!holding || result) return;
    const timer = window.setInterval(() => {
      setProgress((current) => Math.min(100, current + 5));
    }, 60);
    return () => window.clearInterval(timer);
  }, [holding, result]);

  // ปล่อยมือแล้วพลังเขย่าจะค่อยๆ ลดลง ต้องเขย่าต่อเนื่องถึงจะได้ใบเซียมซี
  useEffect(() => {
    if (holding || result || progress <= 0 || progress >= 100) return;
    const timer = window.setInterval(() => {
      setProgress((current) => Math.max(0, current - 2));
    }, 120);
    return () => window.clearInterval(timer);
  }, [holding, progress, result]);

  /* ---------- เขย่าด้วยการสะบัดมือถือจริงๆ ---------- */

  useEffect(() => {
    if (typeof window === "undefined" || !("DeviceMotionEvent" in window)) {
      return;
    }
    const motionEvent = window.DeviceMotionEvent as MotionEventWithPermission;
    if (typeof motionEvent.requestPermission === "function") {
      // iOS ต้องให้ผู้ใช้กดอนุญาตก่อน
      setNeedsMotionPermission(true);
    } else {
      setMotionEnabled(true);
    }
  }, []);

  useEffect(() => {
    if (!motionEnabled || result) return;

    let lastShakeAt = 0;

    function handleMotion(event: DeviceMotionEvent) {
      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;

      const magnitude =
        Math.abs(acceleration.x ?? 0) +
        Math.abs(acceleration.y ?? 0) +
        Math.abs(acceleration.z ?? 0);

      // ตอนวางนิ่งค่าจะราวๆ 10–14 การสะบัดจะพุ่งเกิน 28 ขึ้นไป
      const now = performance.now();
      if (magnitude > 28 && now - lastShakeAt > 120) {
        lastShakeAt = now;
        setProgress((current) => Math.min(100, current + 8));
      }
    }

    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, [motionEnabled, result]);

  async function requestMotionPermission() {
    const motionEvent = window.DeviceMotionEvent as MotionEventWithPermission;
    try {
      const response = await motionEvent.requestPermission?.();
      if (response === "granted") {
        setMotionEnabled(true);
        setNeedsMotionPermission(false);
      }
    } catch {
      // ผู้ใช้ปฏิเสธหรือเบราว์เซอร์ไม่รองรับ — ยังกดค้างเขย่าได้อยู่
      setNeedsMotionPermission(false);
    }
  }

  /* ---------- เขย่าครบแล้วหยิบใบเซียมซี ---------- */

  useEffect(() => {
    if (progress < 100 || result) return;
    setHolding(false);
    const sticks = temple.sticks;
    setResult(sticks[Math.floor(Math.random() * sticks.length)]);
  }, [progress, result, temple]);

  const isShaking = holding && !result;

  return (
    <>
      {/* เลือกวัด */}
      <section className="rounded-blob border border-line bg-card/80 p-5 shadow-sm sm:p-6">
        <h2 className="font-cute text-xl text-ink">เลือกวัดที่อยากเสี่ยงเซียมซี</h2>

        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {TEMPLES.map((item) => {
            const isActive = item.id === temple.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => selectTemple(item)}
                  aria-pressed={isActive}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    isActive
                      ? "border-transparent shadow-sm"
                      : "border-line bg-card hover:border-gold-deep"
                  }`}
                  style={
                    isActive ? { backgroundColor: `${item.accent}66` } : undefined
                  }
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl" aria-hidden>
                      {item.emoji}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-ink-soft">{item.region}</p>
                      <p className="font-cute text-lg leading-tight text-ink">
                        {item.shortName}
                      </p>
                    </div>
                  </div>
                  <p className="mt-1 truncate text-xs text-ink-soft">
                    {item.name} · {item.province}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>

        <p className="mt-3 rounded-2xl bg-gold/40 p-3 text-xs leading-relaxed text-ink-soft">
          {temple.description}
        </p>
      </section>

      {/* กระบอกเซียมซี

          ใช้ sticky ให้กระบอกลอยตามการเลื่อน จะได้อ่านคำทำนายไปด้วย
          แล้วเขย่าใหม่ได้เลยโดยไม่ต้องเลื่อนกลับขึ้นมา
          top-4 เผื่อระยะจากขอบบนจอ */}
      <section className="sticky top-4 z-20 mt-4 rounded-blob border border-line bg-card/95 p-6 text-center shadow-lg backdrop-blur-sm">
        {!result && (
          <>
            <h2 className="font-cute text-2xl text-ink">
              ตั้งจิตอธิษฐาน แล้วเขย่าเลย
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              กดค้างที่กระบอกแล้วเขย่าค้างไว้ หรือสะบัดมือถือก็ได้
            </p>
          </>
        )}

        {result && (
          <p className="text-sm text-ink-soft">
            อยากได้ใบใหม่ กดค้างที่กระบอกเพื่อเขย่าอีกครั้งได้เลย
          </p>
        )}

          <button
            type="button"
            aria-label="กดค้างเพื่อเขย่ากระบอกเซียมซี"
            onPointerDown={(event) => {
              try {
                // จับ pointer ไว้ เพื่อให้ลากนิ้วออกนอกปุ่มแล้วยังเขย่าต่อได้
                event.currentTarget.setPointerCapture(event.pointerId);
              } catch {
                // บางเบราว์เซอร์ไม่รองรับ — ไม่เป็นไร ยังกดค้างได้ปกติ
              }
              // เขย่าใหม่ทั้งที่ยังมีผลเดิมค้างอยู่ ให้ล้างผลเก่าก่อน
              if (result) reset();
              setHolding(true);
            }}
            onPointerUp={() => setHolding(false)}
            onPointerCancel={() => setHolding(false)}
            onPointerLeave={() => setHolding(false)}
            className="mx-auto mt-4 block touch-none select-none"
          >
            {/* ย่อกระบอกลงตอนมีผลแล้ว จะได้ไม่บังคำทำนายที่เลื่อนอยู่ข้างใต้ */}
            <ShakeCup
              accent={temple.accent}
              shaking={isShaking}
              compact={Boolean(result)}
            />
          </button>

          <div className="mx-auto mt-5 max-w-xs">
            <div
              className="h-3 overflow-hidden rounded-full bg-line"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="พลังการเขย่า"
            >
              <div
                className="h-full rounded-full transition-[width] duration-100"
                style={{
                  width: `${progress}%`,
                  backgroundColor: temple.accent,
                }}
              />
            </div>
            <p className="mt-2 text-xs text-ink-soft">
              {progress === 0
                ? "ยังไม่ได้เขย่าเลย"
                : progress < 60
                  ? "เขย่าต่อไปอีกหน่อย…"
                  : "ใกล้แล้ว ใบเซียมซีกำลังจะหล่น!"}
            </p>
          </div>

          {needsMotionPermission && (
            <button
              type="button"
              onClick={requestMotionPermission}
              className="mt-4 rounded-full border border-line px-4 py-2 text-xs text-ink-soft transition hover:border-gold-deep hover:text-ink"
            >
              📱 เปิดใช้การเขย่าด้วยมือถือ
            </button>
          )}
      </section>

      {/* ผลเซียมซี */}
      {result && (
        <section className="animate-pop-in mt-4 rounded-blob border border-line bg-card/85 p-5 shadow-sm sm:p-7">
          <StickResult stick={result} temple={temple} />

          <button
            type="button"
            onClick={reset}
            className="mt-5 w-full rounded-full px-4 py-3 text-sm font-semibold transition hover:opacity-90 grad-gold"
          >
            🥢 เสี่ยงใหม่อีกครั้ง
          </button>
        </section>
      )}
    </>
  );
}

function StickResult({ stick, temple }: { stick: SiamsiStick; temple: Temple }) {
  const level = LEVEL_STYLES[stick.level];

  return (
    <>
      <div className="text-center">
        <p className="text-xs text-ink-soft">
          {temple.emoji} {temple.shortName} · {temple.province}
        </p>

        <p className="mt-2 font-cute text-5xl text-ink">{stick.thaiNumber}</p>
        <p className="text-xs text-ink-soft">ใบที่ {stick.number}</p>

        <h2 className="mt-1 font-cute text-3xl text-ink">{stick.title}</h2>

        <span
          className="mt-2 inline-block rounded-full px-4 py-1.5 text-sm font-semibold"
          style={{ backgroundColor: level.bg, color: level.text }}
        >
          {level.emoji} {stick.level}
        </span>
      </div>

      {/* คำกลอน */}
      <div
        className="mt-5 rounded-2xl border p-5 text-center"
        style={{
          borderColor: `${temple.accent}99`,
          backgroundColor: `${temple.accent}2E`,
        }}
      >
        {stick.poem.map((line) => (
          <p key={line} className="font-cute text-lg leading-relaxed text-ink">
            {line}
          </p>
        ))}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink">{stick.meaning}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <AspectCard emoji="💗" title="ความรัก" text={stick.love} />
        <AspectCard emoji="💼" title="การงาน" text={stick.work} />
        <AspectCard emoji="💰" title="การเงิน" text={stick.money} />
        <AspectCard emoji="🌿" title="สุขภาพ" text={stick.health} />
      </div>
    </>
  );
}

function AspectCard({
  emoji,
  title,
  text,
}: {
  emoji: string;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-2xl border border-line bg-card p-4">
      <h3 className="font-cute text-lg text-ink">
        <span aria-hidden>{emoji}</span> {title}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{text}</p>
    </article>
  );
}

/** กระบอกเซียมซีวาดด้วย SVG */
function ShakeCup({
  accent,
  shaking,
  compact,
}: {
  accent: string;
  shaking: boolean;
  /** ย่อลงตอนมีผลแล้ว เพราะกระบอกลอยค้างอยู่บนคำทำนาย */
  compact?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 160 220"
      className={`${compact ? "h-32 w-24" : "h-56 w-40"} ${shaking ? "animate-shake-cup" : ""}`}
      style={{ transform: shaking ? undefined : "rotate(-11deg)" }}
      aria-hidden
    >
      {/* ไม้เซียมซีที่โผล่พ้นปากกระบอก */}
      {[
        { x: 58, y: 18, rotate: -9 },
        { x: 72, y: 8, rotate: -2 },
        { x: 86, y: 14, rotate: 5 },
        { x: 99, y: 24, rotate: 11 },
      ].map((stick) => (
        <g key={stick.x} transform={`rotate(${stick.rotate} ${stick.x} 100)`}>
          <rect
            x={stick.x}
            y={stick.y}
            width="8"
            height="86"
            rx="4"
            fill="#F3DFC2"
            stroke="#DCC29A"
            strokeWidth="1.5"
          />
          <rect
            x={stick.x}
            y={stick.y}
            width="8"
            height="18"
            rx="4"
            fill="#E06A7B"
          />
        </g>
      ))}

      {/* ตัวกระบอกไม้ไผ่ */}
      <path
        d="M42 84 H118 L110 200 Q80 210 50 200 Z"
        fill="#C98B5B"
        stroke="#A96F44"
        strokeWidth="3"
      />
      {/* ปากกระบอก */}
      <ellipse
        cx="80"
        cy="84"
        rx="38"
        ry="11"
        fill="#8A5A34"
        stroke="#A96F44"
        strokeWidth="3"
      />
      {/* ข้อไม้ไผ่ */}
      <path d="M45 128 H115" stroke="#A96F44" strokeWidth="3" opacity="0.7" />
      <path d="M48 166 H112" stroke="#A96F44" strokeWidth="3" opacity="0.7" />

      {/* แถบสีประจำวัด */}
      <rect x="52" y="138" width="56" height="20" rx="10" fill={accent} />
      <text
        x="80"
        y="153"
        textAnchor="middle"
        fontSize="13"
        fill="#4A3B52"
        fontFamily="var(--font-itim), sans-serif"
      >
        เซียมซี
      </text>
    </svg>
  );
}
