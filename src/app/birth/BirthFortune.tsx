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
          <div className="flex justify-center">
            <CuteCharacter
              mainColor={luckyDay.main.hex}
              accentColor={luckyDay.lucky[0]?.hex ?? luckyDay.main.hex}
              style="dress"
              className="animate-float-soft h-60 w-auto sm:h-64"
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

        <p className="mt-3 rounded-2xl border border-dashed border-blossom-deep/40 bg-blossom/25 p-4 text-sm text-ink">
          <span className="font-semibold">คำแนะนำ · </span>
          {dayProfile.advice}
        </p>
      </section>

      {/* ผูกทักษาเต็ม — ส่วนนี้คำนวณจากตำราทักษาปกรณ์ทั้งหมด */}
      <section className="mt-4 rounded-blob border border-line bg-card/85 p-5 shadow-sm sm:p-7">
        <h2 className="font-cute text-2xl text-ink">📜 ผูกทักษาของคุณ</h2>
        <p className="text-xs leading-relaxed text-ink-soft">
          ตามตำราทักษาปกรณ์ เริ่มนับภูมิบริวารที่ดาวประจำวันเกิด
          แล้วไล่ตามลำดับทักษา ๑ ๒ ๓ ๔ ๗ ๕ ๘ ๖ จนครบแปดภูมิ
          ตารางนี้คือที่มาของสีมงคลและสีกาลกิณีทั้งหมดในเว็บ
        </p>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs text-ink-soft">
                <th className="py-2 pr-2 font-medium">ภูมิ</th>
                <th className="py-2 pr-2 font-medium">ดาว</th>
                <th className="py-2 pr-2 font-medium">สี</th>
                <th className="py-2 font-medium">ดูแลเรื่อง</th>
              </tr>
            </thead>
            <tbody>
              {luckyDay.thaksa.map((entry) => (
                <tr
                  key={entry.bhum.key}
                  className={`border-b border-line/60 align-top ${
                    entry.bhum.key === "kalakini"
                      ? "bg-blossom/25"
                      : entry.bhum.highlighted
                        ? "bg-mint/25"
                        : ""
                  }`}
                >
                  <td className="py-2 pr-2">
                    <span className="font-semibold text-ink">
                      {entry.bhum.name}
                    </span>
                    {entry.bhum.highlighted && (
                      <span className="ml-1 text-[10px] text-mint-deep">
                        แนะนำ
                      </span>
                    )}
                    {!entry.bhum.auspicious && (
                      <span className="ml-1 text-[10px] text-danger">ห้าม</span>
                    )}
                  </td>
                  <td className="py-2 pr-2 text-xs text-ink">
                    {entry.planet.name}
                    <span className="text-ink-soft"> ({entry.planet.number})</span>
                  </td>
                  <td className="py-2 pr-2">
                    <span className="flex items-center gap-1.5">
                      <span
                        className="h-4 w-4 shrink-0 rounded-full border border-line"
                        style={{ backgroundColor: entry.planet.colors[0].hex }}
                      />
                      <span className="text-xs text-ink">
                        {entry.planet.colors[0].name}
                      </span>
                    </span>
                  </td>
                  <td className="py-2 text-xs leading-snug text-ink-soft">
                    {entry.bhum.governs}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-ink-soft">
          หมายเหตุ: ตำราแยกคนเกิด<strong>วันพุธกลางคืน</strong> (หลัง 18.00 น.)
          ให้อยู่ใต้พระราหู ไม่ใช่พระพุธ ซึ่งจะได้ผูกทักษาคนละชุด
          เว็บนี้ยังคำนวณให้เฉพาะวันพุธกลางวัน
        </p>

        <Link
          href="/love"
          className="mt-4 inline-block rounded-full px-5 py-2.5 text-sm font-semibold grad-pink"
        >
          ดูดวงสมพงศ์ด้วยทักษา →
        </Link>
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
