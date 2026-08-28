"use client";

import Link from "next/link";
import { useMemo } from "react";
import { BirthDatePicker } from "@/components/BirthDatePicker";
import { CuteCharacter } from "@/components/CuteCharacter";
import {
  dayName,
  formatBirthDate,
  getDayProfile,
  getLifeNumber,
  getWeekdayOf,
} from "@/lib/birth";
import { getChineseProfile } from "@/lib/chinese";
import { getLuckyDay } from "@/lib/lucky-color";
import { useStoredBirthDate } from "@/lib/use-birth-date";
import { getFortune, getZodiacByDate } from "@/lib/zodiac";

export function BirthFortune({ todayKey }: { todayKey: string }) {
  const { birth, setBirth } = useStoredBirthDate("mutoday:birthdate");

  const result = useMemo(() => {
    const weekday = getWeekdayOf(birth);
    const zodiac = getZodiacByDate(birth.month, birth.day);

    return {
      weekday,
      zodiac,
      dayProfile: getDayProfile(weekday),
      luckyDay: getLuckyDay(weekday),
      lifeNumber: getLifeNumber(birth),
      chinese: getChineseProfile(birth.year, birth.month, birth.day),
      todayFortune: getFortune(zodiac, "daily", todayKey),
    };
  }, [birth, todayKey]);

  const { dayProfile, luckyDay, zodiac, lifeNumber, chinese, todayFortune } =
    result;

  return (
    <>
      {/* กรอกวันเกิด */}
      <section className="rounded-blob border border-line bg-card/80 p-5 shadow-sm sm:p-6">
        <h2 className="font-cute text-xl text-ink">กรอกวันเดือนปีเกิด</h2>
        <p className="mb-3 text-xs text-ink-soft">
          กรอกครั้งเดียว หน้าดวงจีนกับดวงสมพงศ์จะจำให้อัตโนมัติ
        </p>

        <BirthDatePicker value={birth} onChange={setBirth} idPrefix="birth" />
      </section>

      {/* สรุปหัวเรื่อง */}
      <section
        key={`${birth.year}-${birth.month}-${birth.day}`}
        className="animate-pop-in mt-4 rounded-blob border border-line p-5 shadow-sm sm:p-7 grad-soft-pink"
      >
        <p className="text-sm text-ink-soft">{formatBirthDate(birth)}</p>
        <h2 className="font-cute text-3xl leading-snug text-ink">
          คุณเกิดวัน{dayName(result.weekday)}
        </h2>
        <p className="text-sm text-ink">
          {dayProfile.deity} · {dayProfile.headline}
        </p>

        <div className="mt-4 grid items-center gap-4 sm:grid-cols-[minmax(0,150px)_minmax(0,1fr)]">
          <div className="mx-auto w-32 sm:w-full">
            <CuteCharacter
              mainColor={luckyDay.main.hex}
              accentColor={luckyDay.lucky[0]?.hex ?? luckyDay.main.hex}
              style="dress"
              className="animate-float-soft w-full"
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <MiniCard label="ราศี" value={`${zodiac.symbol} ${zodiac.name}`} />
            <MiniCard label="ธาตุประจำราศี" value={zodiac.element} />
            <MiniCard
              label="นักษัตรจีน"
              value={`${chinese.animal.emoji} ${chinese.animal.name}`}
            />
            <MiniCard
              label="เลขชีวิต"
              value={`${lifeNumber.number} · ${lifeNumber.title}`}
            />
          </div>
        </div>
      </section>

      {/* นิสัยตามวันเกิด */}
      <section className="mt-4 rounded-blob border border-line bg-card/85 p-5 shadow-sm sm:p-7">
        <h2 className="font-cute text-2xl text-ink">
          🧡 นิสัยของคนเกิดวัน{dayName(result.weekday)}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink">
          {dayProfile.personality}
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <TraitList
            title="จุดแข็ง"
            emoji="✨"
            items={dayProfile.strengths}
            className="bg-mint/40"
          />
          <TraitList
            title="จุดที่ควรระวัง"
            emoji="⚠️"
            items={dayProfile.weaknesses}
            className="bg-blossom/40"
          />
        </div>

        <div className="mt-3 rounded-2xl border border-line bg-card p-4">
          <p className="text-sm font-semibold text-ink">💼 อาชีพที่เหมาะ</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {dayProfile.careers.map((career) => (
              <li
                key={career}
                className="rounded-full bg-butter/60 px-3 py-1.5 text-xs text-ink"
              >
                {career}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-3 rounded-2xl border border-line bg-card p-4">
          <p className="text-sm font-semibold text-ink">💞 มักเข้ากับคนเกิดวัน</p>
          <p className="mt-1 text-sm text-ink-soft">
            {dayProfile.matchDays.map((day) => `วัน${dayName(day)}`).join(" · ")}
          </p>
          <Link
            href="/love"
            className="mt-2 inline-block text-xs text-blossom-deep underline underline-offset-2"
          >
            ลองดูดวงสมพงศ์กับคนที่คิดถึง →
          </Link>
        </div>

        <p className="mt-3 rounded-2xl border border-dashed border-blossom-deep/40 bg-blossom/25 p-4 text-sm text-ink">
          <span className="font-semibold">คำแนะนำ · </span>
          {dayProfile.advice}
        </p>
      </section>

      {/* สีมงคลประจำวันเกิด */}
      <section className="mt-4 rounded-blob border border-line bg-card/85 p-5 shadow-sm sm:p-7">
        <h2 className="font-cute text-2xl text-ink">
          🎨 สีมงคลของคนเกิดวัน{dayName(result.weekday)}
        </h2>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-card p-4">
            <p className="text-sm font-semibold text-ink">สีเสริมดวง</p>
            <ul className="mt-2 space-y-1.5">
              {[luckyDay.main, ...luckyDay.lucky].map((color) => (
                <li key={color.name} className="flex items-center gap-2">
                  <span
                    className="h-5 w-5 rounded-full border border-line"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-xs text-ink">{color.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-line bg-card p-4">
            <p className="text-sm font-semibold text-ink">สีกาลกิณี ควรเลี่ยง</p>
            <ul className="mt-2 space-y-1.5">
              {luckyDay.avoid.map((color) => (
                <li key={color.name} className="flex items-center gap-2">
                  <span
                    className="h-5 w-5 rounded-full border border-line opacity-55"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-xs text-ink-soft line-through">
                    {color.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* เลขศาสตร์ */}
      <section className="mt-4 rounded-blob border border-line bg-card/85 p-5 shadow-sm sm:p-7">
        <h2 className="font-cute text-2xl text-ink">
          🔢 เลขชีวิตของคุณคือ {lifeNumber.number}
        </h2>
        <p className="text-sm text-ink-soft">{lifeNumber.title}</p>

        <p className="mt-2 text-sm leading-relaxed text-ink">
          {lifeNumber.meaning}
        </p>

        <ul className="mt-3 flex flex-wrap gap-2">
          {lifeNumber.luckyTraits.map((trait) => (
            <li
              key={trait}
              className="rounded-full bg-lilac/50 px-3 py-1.5 text-xs text-ink"
            >
              {trait}
            </li>
          ))}
        </ul>
      </section>

      {/* ดวงวันนี้ของราศีที่คำนวณได้ */}
      <section className="mt-4 rounded-blob border border-line bg-card/85 p-5 shadow-sm sm:p-7">
        <h2 className="font-cute text-2xl text-ink">
          {zodiac.symbol} ดวงวันนี้ของราศี{zodiac.name}
        </h2>
        <p className="mt-2 rounded-2xl bg-lilac/35 p-4 text-sm leading-relaxed text-ink">
          {todayFortune.overview}
        </p>

        <Link
          href="/horoscope"
          className="mt-3 inline-block rounded-full px-5 py-2.5 text-sm font-semibold grad-violet"
        >
          ดูดวงราศีแบบเต็ม →
        </Link>
      </section>
    </>
  );
}

function MiniCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-card/90 p-3">
      <p className="text-[11px] text-ink-soft">{label}</p>
      <p className="font-cute text-lg leading-tight text-ink">{value}</p>
    </div>
  );
}

function TraitList({
  title,
  emoji,
  items,
  className,
}: {
  title: string;
  emoji: string;
  items: string[];
  className: string;
}) {
  return (
    <div className={`rounded-2xl border border-line p-4 ${className}`}>
      <p className="text-sm font-semibold text-ink">
        <span aria-hidden>{emoji}</span> {title}
      </p>
      <ul className="mt-2 space-y-1">
        {items.map((item) => (
          <li key={item} className="text-xs text-ink">
            · {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
