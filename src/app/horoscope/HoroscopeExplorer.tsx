"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PERIOD_LABELS,
  ZODIACS,
  getFortune,
  type PeriodType,
} from "@/lib/zodiac";

const STORAGE_KEY = "mutoday:zodiac";

type Props = {
  /** คีย์ช่วงเวลาคำนวณจาก server ตามเวลาไทย เพื่อให้ client ได้ผลตรงกัน */
  periodKeys: Record<PeriodType, string>;
  /** ข้อความบอกช่วงเวลาแบบอ่านง่าย เช่น "วันพฤหัสบดีที่ 27 สิงหาคม 2569" */
  periodLabels: Record<PeriodType, string>;
};

export function HoroscopeExplorer({ periodKeys, periodLabels }: Props) {
  const [zodiacId, setZodiacId] = useState(ZODIACS[0].id);
  const [period, setPeriod] = useState<PeriodType>("daily");

  // จำราศีที่เลือกไว้ให้ ไม่ต้องเลือกใหม่ทุกครั้งที่เข้ามา
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && ZODIACS.some((zodiac) => zodiac.id === saved)) {
        setZodiacId(saved);
      }
    } catch {
      // บางเบราว์เซอร์ปิด storage ไว้ — ไม่ใช่เรื่องคอขาดบาดตาย ข้ามไป
    }
  }, []);

  function selectZodiac(id: string) {
    setZodiacId(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // เช่นเดียวกับด้านบน
    }
  }

  const zodiac = useMemo(
    () => ZODIACS.find((item) => item.id === zodiacId) ?? ZODIACS[0],
    [zodiacId],
  );

  const fortune = useMemo(
    () => getFortune(zodiac, period, periodKeys[period]),
    [zodiac, period, periodKeys],
  );

  return (
    <>
      {/* เลือกราศี */}
      <section className="rounded-blob border border-line bg-card/80 p-5 shadow-sm sm:p-6">
        <h2 className="font-cute text-xl text-ink">เลือกราศีของคุณ</h2>

        <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {ZODIACS.map((item) => {
            const isActive = item.id === zodiac.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => selectZodiac(item.id)}
                  aria-pressed={isActive}
                  className={`w-full rounded-2xl border px-2 py-3 text-center transition ${
                    isActive
                      ? "grad-violet"
                      : "border-line bg-card text-ink hover:border-lilac-deep"
                  }`}
                >
                  <span className="block text-xl leading-none" aria-hidden>
                    {item.symbol}
                  </span>
                  <span className="mt-1 block text-sm">{item.name}</span>
                  <span
                    className={`block text-[10px] leading-tight ${
                      isActive ? "text-white/80" : "text-ink-soft"
                    }`}
                  >
                    {item.range}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* เลือกช่วงเวลา */}
      <section className="mt-4">
        <div
          role="tablist"
          aria-label="ช่วงเวลาของคำทำนาย"
          className="flex gap-2 rounded-full border border-line bg-card/80 p-1.5"
        >
          {(Object.keys(PERIOD_LABELS) as PeriodType[]).map((key) => {
            const isActive = key === period;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setPeriod(key)}
                className={`flex-1 rounded-full px-3 py-2 text-sm transition ${
                  isActive
                    ? "grad-violet"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {PERIOD_LABELS[key]}
              </button>
            );
          })}
        </div>
      </section>

      {/* คำทำนาย — key ทำให้เล่นแอนิเมชันใหม่ทุกครั้งที่เปลี่ยนราศีหรือช่วงเวลา */}
      <section
        key={`${zodiac.id}-${period}`}
        className="animate-pop-in mt-4 rounded-blob border border-line bg-card/85 p-5 shadow-sm sm:p-7"
      >
        <div className="flex items-start gap-4">
          <span
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-lilac text-3xl"
            aria-hidden
          >
            {zodiac.symbol}
          </span>

          <div className="min-w-0">
            <h2 className="font-cute text-2xl text-ink">
              ราศี{zodiac.name} · {PERIOD_LABELS[period]}
            </h2>
            <p className="text-xs text-ink-soft">
              {periodLabels[period]} · ธาตุ{zodiac.element}
            </p>
            <div className="mt-1.5">
              <Stars score={fortune.overallScore} />
            </div>
          </div>
        </div>

        <p className="mt-4 rounded-2xl bg-lilac/40 p-4 text-sm leading-relaxed text-ink">
          {fortune.overview}
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {fortune.sections.map((section) => (
            <article
              key={section.key}
              className="rounded-2xl border border-line bg-card p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-cute text-lg text-ink">
                  <span aria-hidden>{section.emoji}</span> {section.title}
                </h3>
                <Stars score={section.score} small />
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                {section.text}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <InfoPill
            label="เลขนำโชค"
            value={fortune.luckyNumbers.join(" · ")}
            className="bg-gold/50"
          />
          <InfoPill
            label="สีนำโชค"
            value={fortune.luckyColor}
            className="bg-gold/50"
          />
          <InfoPill
            label="คะแนนรวม"
            value={`${fortune.overallScore} / 5`}
            className="bg-lilac/50"
          />
        </div>

        <p className="mt-4 rounded-2xl border border-dashed border-lilac-deep/40 bg-lilac/25 p-4 text-sm text-ink">
          <span className="font-semibold">คำแนะนำ · </span>
          {fortune.advice}
        </p>
      </section>
    </>
  );
}

function Stars({ score, small }: { score: number; small?: boolean }) {
  return (
    <span
      className={small ? "text-sm" : "text-base"}
      aria-label={`คะแนน ${score} จาก 5`}
    >
      <span aria-hidden className="text-gold-deep">
        {"★".repeat(score)}
      </span>
      <span aria-hidden className="text-line">
        {"★".repeat(5 - score)}
      </span>
    </span>
  );
}

function InfoPill({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className: string;
}) {
  return (
    <div className={`rounded-2xl border border-line p-4 ${className}`}>
      <p className="text-xs text-ink-soft">{label}</p>
      <p className="font-cute text-xl text-ink">{value}</p>
    </div>
  );
}
