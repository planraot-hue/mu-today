"use client";

import { useMemo } from "react";
import { BirthDatePicker } from "@/components/BirthDatePicker";
import { formatBirthDate } from "@/lib/birth";
import {
  CHINESE_ANIMALS,
  getChineseProfile,
  getClashAnimal,
  getClashWithYear,
  getYearFortune,
} from "@/lib/chinese";
import { useStoredBirthDate } from "@/lib/use-birth-date";

const CLASH_STYLES: Record<string, { bg: string; text: string; emoji: string }> =
  {
    "ชงตรง": { bg: "#F7E3E8", text: "#A8455A", emoji: "⚡" },
    "คัดชง": { bg: "#FBECC9", text: "#9A6E06", emoji: "🌤️" },
    "ปกติ": { bg: "#ECE3FB", text: "#7C5FD3", emoji: "✅" },
  };

export function ChineseFortune({ currentYear }: { currentYear: number }) {
  const { birth, setBirth } = useStoredBirthDate("mutoday:birthdate");

  const data = useMemo(() => {
    const profile = getChineseProfile(birth.year, birth.month, birth.day);
    return {
      profile,
      clash: getClashWithYear(profile.animal, currentYear),
      clashAnimal: getClashAnimal(profile.animal),
      fortune: getYearFortune(profile.animal, currentYear),
      matches: profile.animal.bestMatch.map((index) => CHINESE_ANIMALS[index]),
    };
  }, [birth, currentYear]);

  const { profile, clash, clashAnimal, fortune, matches } = data;
  const clashStyle = CLASH_STYLES[clash.level] ?? CLASH_STYLES["ปกติ"];

  return (
    <>
      <section className="rounded-blob border border-line bg-card/80 p-5 shadow-sm sm:p-6">
        <h2 className="font-cute text-xl text-ink">กรอกวันเดือนปีเกิด</h2>
        <p className="mb-3 text-xs text-ink-soft">
          ดวงจีนใช้ปีเกิดเป็นหลัก แต่กรอกวันเดือนด้วยเพื่อเช็กช่วงตรุษจีน
        </p>

        <BirthDatePicker value={birth} onChange={setBirth} idPrefix="chinese" />
      </section>

      {/* นักษัตรและธาตุ */}
      <section
        key={`${birth.year}-${birth.month}-${birth.day}`}
        className="animate-pop-in mt-4 rounded-blob border border-line p-5 text-center shadow-sm sm:p-7 grad-soft-violet"
      >
        <p className="text-sm text-ink-soft">{formatBirthDate(birth)}</p>

        <p className="mt-2 text-7xl leading-none" aria-hidden>
          {profile.animal.emoji}
        </p>
        <h2 className="mt-2 font-cute text-3xl text-ink">
          ปี{profile.animal.name} ({profile.animal.animal})
        </h2>
        <p className="text-sm text-ink">{profile.animal.headline}</p>

        <div className="mx-auto mt-4 flex max-w-md flex-wrap justify-center gap-2">
          <span
            className="rounded-full px-4 py-1.5 text-sm text-ink"
            style={{ backgroundColor: profile.element.hex }}
          >
            {profile.element.emoji} ธาตุ{profile.element.name}
          </span>
          <span className="rounded-full bg-card px-4 py-1.5 text-sm text-ink">
            ☯️ {profile.polarity}
          </span>
        </div>

        <p className="mt-2 text-xs text-ink-soft">
          ลักษณะธาตุ: {profile.element.trait}
        </p>

        {profile.nearNewYear && (
          <p className="mx-auto mt-4 max-w-md rounded-2xl bg-gold/70 p-3 text-xs leading-relaxed text-ink">
            ⚠️ คุณเกิดช่วงต้นปี ซึ่งอาจอยู่ก่อนวันตรุษจีนของปีนั้น
            ถ้าเกิดก่อนตรุษจีน นักษัตรของคุณจะเป็น{" "}
            <strong>
              ปี{profile.previousAnimal.name} {profile.previousAnimal.emoji}
            </strong>{" "}
            แทน ลองเช็กวันตรุษจีนของปี {birth.year + 543} อีกครั้ง
          </p>
        )}
      </section>

      {/* นิสัย */}
      <section className="mt-4 rounded-blob border border-line bg-card/85 p-5 shadow-sm sm:p-7">
        <h2 className="font-cute text-2xl text-ink">
          🧡 นิสัยของคนปี{profile.animal.name}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink">
          {profile.animal.personality}
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-gold/40 p-4">
            <p className="text-sm font-semibold text-ink">✨ จุดแข็ง</p>
            <ul className="mt-2 space-y-1">
              {profile.animal.strengths.map((item) => (
                <li key={item} className="text-xs text-ink">
                  · {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-line bg-lilac/40 p-4">
            <p className="text-sm font-semibold text-ink">⚠️ จุดที่ควรระวัง</p>
            <ul className="mt-2 space-y-1">
              {profile.animal.weaknesses.map((item) => (
                <li key={item} className="text-xs text-ink">
                  · {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ปีชง */}
      <section className="mt-4 rounded-blob border border-line bg-card/85 p-5 shadow-sm sm:p-7">
        <h2 className="font-cute text-2xl text-ink">
          🧨 ปี {currentYear + 543} ชงไหม
        </h2>
        <p className="text-xs text-ink-soft">
          ปีนี้เป็นปี{clash.yearAnimal.name} {clash.yearAnimal.emoji}
        </p>

        <div
          className="mt-3 rounded-2xl p-4"
          style={{ backgroundColor: clashStyle.bg }}
        >
          <p
            className="font-cute text-2xl"
            style={{ color: clashStyle.text }}
          >
            {clashStyle.emoji} {clash.level}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-ink">{clash.note}</p>
        </div>

        <p className="mt-3 text-xs text-ink-soft">
          นักษัตรที่ชงกับปี{profile.animal.name}โดยตรงคือ ปี
          {clashAnimal.name} {clashAnimal.emoji}
        </p>
      </section>

      {/* ดวงปีนี้ */}
      <section className="mt-4 rounded-blob border border-line bg-card/85 p-5 shadow-sm sm:p-7">
        <h2 className="font-cute text-2xl text-ink">
          🔮 ดวงปี {currentYear + 543} ของคนปี{profile.animal.name}
        </h2>

        <p className="mt-2 rounded-2xl bg-lilac/35 p-4 text-sm leading-relaxed text-ink">
          {fortune.overview}
        </p>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <AspectCard emoji="💰" title="การเงิน" text={fortune.money} />
          <AspectCard emoji="💼" title="การงาน" text={fortune.work} />
          <AspectCard emoji="💗" title="ความรัก" text={fortune.love} />
          <AspectCard emoji="🌿" title="สุขภาพ" text={fortune.health} />
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-gold/50 p-4">
            <p className="text-xs text-ink-soft">เลขนำโชคประจำปี</p>
            <p className="font-cute text-xl text-ink">
              {fortune.luckyNumbers.join(" · ")}
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-gold/50 p-4">
            <p className="text-xs text-ink-soft">สีนำโชคประจำปี</p>
            <p className="font-cute text-xl text-ink">{fortune.luckyColor}</p>
          </div>
        </div>
      </section>

      {/* คู่ถูกโฉลก */}
      <section className="mt-4 rounded-blob border border-line bg-card/85 p-5 shadow-sm sm:p-7">
        <h2 className="font-cute text-2xl text-ink">💞 นักษัตรที่ถูกโฉลกกัน</h2>
        <p className="text-xs text-ink-soft">
          ตำราจีนเรียกกลุ่มนี้ว่า สามฮะ ถือว่าส่งเสริมกันมากที่สุด
        </p>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {matches.map((animal) => (
            <div
              key={animal.index}
              className="flex items-center gap-3 rounded-2xl border border-line bg-gold/35 p-4"
            >
              <span className="text-3xl" aria-hidden>
                {animal.emoji}
              </span>
              <div>
                <p className="font-cute text-lg text-ink">
                  ปี{animal.name} ({animal.animal})
                </p>
                <p className="text-xs text-ink-soft">{animal.headline}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
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
