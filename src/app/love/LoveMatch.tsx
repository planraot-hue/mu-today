"use client";

import { useMemo, useState } from "react";
import { BirthDatePicker } from "@/components/BirthDatePicker";
import { dayName, formatBirthDate, getWeekdayOf } from "@/lib/birth";
import { getChineseProfile } from "@/lib/chinese";
import { getCompatibility } from "@/lib/compatibility";
import { DEFAULT_BIRTH, useStoredBirthDate } from "@/lib/use-birth-date";
import { getZodiacByDate } from "@/lib/zodiac";
import type { BirthDate } from "@/lib/birth";

export function LoveMatch() {
  // ฝ่ายเราดึงวันเกิดที่เคยกรอกไว้ในหน้าอื่นมาให้เลย
  const { birth: mine, setBirth: setMine } =
    useStoredBirthDate("mutoday:birthdate");
  const [partner, setPartner] = useState<BirthDate>(DEFAULT_BIRTH);
  const [revealed, setRevealed] = useState(false);

  const result = useMemo(
    () => getCompatibility(mine, partner),
    [mine, partner],
  );

  return (
    <>
      <section className="rounded-blob border border-line bg-card/80 p-5 shadow-sm sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl bg-lilac/25 p-4">
            <BirthDatePicker
              value={mine}
              onChange={(next) => {
                setMine(next);
                setRevealed(false);
              }}
              legend="💗 วันเกิดของคุณ"
              idPrefix="me"
            />
            <p className="mt-2 text-xs text-ink-soft">
              {formatBirthDate(mine)} · วัน{dayName(getWeekdayOf(mine))}
            </p>
          </div>

          <div className="rounded-2xl bg-lilac/25 p-4">
            <BirthDatePicker
              value={partner}
              onChange={(next) => {
                setPartner(next);
                setRevealed(false);
              }}
              legend="💜 วันเกิดของอีกฝ่าย"
              idPrefix="partner"
            />
            <p className="mt-2 text-xs text-ink-soft">
              {formatBirthDate(partner)} · วัน{dayName(getWeekdayOf(partner))}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="mt-5 w-full rounded-full px-4 py-3 text-sm font-semibold grad-violet"
        >
          {revealed ? "💞 ทำนายอีกครั้ง" : "💞 ทำนายดวงสมพงศ์"}
        </button>
      </section>

      {revealed && (
        <>
          {/* คะแนนรวม */}
          <section
            key={`${result.totalScore}-${mine.day}-${partner.day}`}
            className="animate-pop-in mt-4 rounded-blob border border-line p-6 text-center shadow-sm grad-soft-violet"
          >
            <p className="text-5xl" aria-hidden>
              {result.levelEmoji}
            </p>

            <p className="mt-2 font-cute text-6xl leading-none text-ink">
              {result.totalScore}
              <span className="text-2xl text-ink-soft">%</span>
            </p>

            <h2 className="mt-1 font-cute text-2xl text-ink">{result.level}</h2>

            {/* หลอดคะแนน */}
            <div
              className="mx-auto mt-4 h-3 max-w-sm overflow-hidden rounded-full bg-card"
              role="progressbar"
              aria-valuenow={result.totalScore}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="คะแนนสมพงศ์"
            >
              <div
                className="h-full rounded-full grad-violet"
                style={{ width: `${result.totalScore}%` }}
              />
            </div>

            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink">
              {result.summary}
            </p>
          </section>

          {/* รายละเอียดแต่ละด้าน */}
          <section className="mt-4 space-y-3">
            {result.aspects.map((aspect) => (
              <article
                key={aspect.key}
                className="rounded-blob border border-line bg-card/85 p-5 shadow-sm"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-cute text-xl text-ink">
                    <span aria-hidden>{aspect.emoji}</span> {aspect.title}
                  </h3>
                  <span className="font-cute text-2xl text-lilac-deep">
                    {aspect.score}
                  </span>
                </div>

                <p className="text-sm font-medium text-ink">{aspect.headline}</p>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full grad-violet"
                    style={{ width: `${aspect.score}%` }}
                  />
                </div>

                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {aspect.detail}
                </p>
              </article>
            ))}
          </section>

          {/* ข้อมูลประกอบ */}
          <section className="mt-4 rounded-blob border border-line bg-card/85 p-5 shadow-sm sm:p-7">
            <h2 className="font-cute text-xl text-ink">📋 ข้อมูลที่ใช้คำนวณ</h2>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <PersonSummary label="💗 คุณ" birth={mine} />
              <PersonSummary label="💜 อีกฝ่าย" birth={partner} />
            </div>

            <p className="mt-3 rounded-2xl border border-dashed border-lilac-deep/40 bg-lilac/25 p-4 text-sm text-ink">
              <span className="font-semibold">คำแนะนำสำหรับคู่นี้ · </span>
              {result.advice}
            </p>

            <p className="mt-3 text-xs leading-relaxed text-ink-soft">
              คะแนนคำนวณจากวันเกิดตามตำราไทย ธาตุประจำราศี และนักษัตรจีน
              ถ่วงน้ำหนัก 40 / 35 / 25 ตามลำดับ ผลลัพธ์คงที่เสมอสำหรับคู่เดิม
              ไม่มีการสุ่ม — และเป็นเพียงความบันเทิงเท่านั้น
              ความสัมพันธ์จริงขึ้นอยู่กับความเข้าใจของทั้งสองคนมากกว่าดวง
            </p>
          </section>
        </>
      )}
    </>
  );
}

function PersonSummary({ label, birth }: { label: string; birth: BirthDate }) {
  const zodiac = getZodiacByDate(birth.month, birth.day);
  const chinese = getChineseProfile(birth.year, birth.month, birth.day);

  return (
    <div className="rounded-2xl border border-line bg-card p-4">
      <p className="text-sm font-semibold text-ink">{label}</p>
      <p className="text-xs text-ink-soft">{formatBirthDate(birth)}</p>

      <ul className="mt-2 space-y-1 text-xs text-ink">
        <li>📅 เกิดวัน{dayName(getWeekdayOf(birth))}</li>
        <li>
          {zodiac.symbol} ราศี{zodiac.name} · ธาตุ{zodiac.element}
        </li>
        <li>
          {chinese.animal.emoji} ปี{chinese.animal.name} · ธาตุ
          {chinese.element.name}
        </li>
      </ul>
    </div>
  );
}
