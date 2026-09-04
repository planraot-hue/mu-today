"use client";

import { useEffect, useState } from "react";
import {
  PHROM_YAN_DECK_SIZE,
  PHROM_YAN_LEVEL_STYLES,
  SPREAD_SIZE,
  dealSpread,
  type PhromYanCard,
} from "@/lib/phrom-yan";

/** ระยะเวลาที่โชว์แอนิเมชันสับสำรับก่อนวางไพ่ชุดใหม่ */
const SHUFFLE_MS = 700;

type Phase = "idle" | "shuffling" | "ready";

export function PhromYanDeck() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [spread, setSpread] = useState<PhromYanCard[] | null>(null);
  const [pickedIndex, setPickedIndex] = useState<number | null>(null);
  const [shuffleCount, setShuffleCount] = useState(0);

  function startShuffle() {
    if (phase === "shuffling") return;
    setPickedIndex(null);
    setShuffleCount((current) => current + 1);
    setPhase("shuffling");
  }

  useEffect(() => {
    if (phase !== "shuffling") return;

    const timer = window.setTimeout(() => {
      setSpread(dealSpread());
      setPhase("ready");
    }, SHUFFLE_MS);

    return () => window.clearTimeout(timer);
  }, [phase]);

  const isShuffling = phase === "shuffling";
  const picked = pickedIndex !== null && spread ? spread[pickedIndex] : null;

  return (
    <>
      {/* เริ่มต้น */}
      {phase === "idle" && (
        <section className="rounded-blob border border-line bg-card/80 p-7 text-center shadow-sm">
          <p className="animate-float-soft text-6xl" aria-hidden>
            🔯
          </p>
          <h2 className="mt-3 font-cute text-2xl text-ink">
            ตั้งจิตอธิษฐานถึงสิ่งที่อยากรู้
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            หายใจเข้าลึกๆ นึกถึงคำถามในใจ แล้วกดปุ่มด้านล่างเพื่อสับสำรับ
          </p>

          <button
            type="button"
            onClick={startShuffle}
            className="mt-5 rounded-full px-6 py-3 text-sm font-semibold grad-gold"
          >
            🔀 สับสำรับแล้ววางไพ่
          </button>

          <p className="mt-3 text-xs text-ink-soft">
            สำรับมีทั้งหมด {PHROM_YAN_DECK_SIZE} ใบ
            แต่ละรอบจะวางคว่ำให้เลือก {SPREAD_SIZE} ใบ
          </p>
        </section>
      )}

      {/* วางไพ่ให้เลือก */}
      {phase !== "idle" && (
        <section className="rounded-blob border border-line bg-card/80 p-5 shadow-sm sm:p-6">
          <p
            role="status"
            aria-live="polite"
            className="text-center text-sm text-ink-soft"
          >
            {isShuffling
              ? "🔀 กำลังสับสำรับ…"
              : picked
                ? "ไพ่ที่คุณเลือกเปิดแล้ว อ่านคำทำนายด้านล่าง"
                : `แตะเลือกไพ่ 1 ใบจาก ${SPREAD_SIZE} ใบ`}
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2 sm:gap-3">
            {Array.from({ length: SPREAD_SIZE }).map((_, index) => {
              const card = spread?.[index];
              const isPicked = pickedIndex === index;
              const isDimmed = pickedIndex !== null && !isPicked;

              return (
                <button
                  key={`slot-${index}`}
                  type="button"
                  disabled={isShuffling || !card || pickedIndex !== null}
                  onClick={() => setPickedIndex(index)}
                  aria-label={
                    isPicked && card
                      ? `ไพ่${card.name}`
                      : `เลือกไพ่ใบที่ ${index + 1}`
                  }
                  className={`aspect-[2/3] w-[86px] rounded-2xl border-2 transition sm:w-[104px] ${
                    isShuffling ? "animate-shuffle" : ""
                  } ${
                    isDimmed
                      ? "scale-95 opacity-40"
                      : "hover:-translate-y-2 hover:shadow-lg"
                  } ${
                    isPicked
                      ? "border-gold-deep shadow-lg"
                      : "border-white grad-violet"
                  }`}
                  style={
                    isShuffling
                      ? { animationDelay: `${index * 70}ms` }
                      : isPicked
                        ? { backgroundColor: "#FFF6E0" }
                        : undefined
                  }
                >
                  {isPicked && card ? (
                    <span className="flex h-full flex-col items-center justify-center gap-1 px-1">
                      <span className="text-3xl" aria-hidden>
                        {card.symbol}
                      </span>
                      <span className="font-cute text-[11px] leading-tight text-ink">
                        {card.name}
                      </span>
                    </span>
                  ) : (
                    <span className="flex h-full items-center justify-center text-2xl text-white">
                      🔯
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={startShuffle}
              disabled={isShuffling}
              className="rounded-full border border-line px-5 py-2.5 text-sm text-ink-soft transition hover:border-gold-deep hover:text-ink disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isShuffling ? "🔀 กำลังสับสำรับ…" : "🔄 สับสำรับใหม่"}
            </button>

            {shuffleCount > 0 && (
              <p className="mt-2 text-xs text-ink-soft">
                {isShuffling
                  ? "กำลังสับ…"
                  : `✨ สับสำรับแล้ว ${shuffleCount} ครั้ง`}
              </p>
            )}
          </div>
        </section>
      )}

      {/* คำทำนาย */}
      {picked && !isShuffling && (
        <section className="animate-pop-in mt-4 rounded-blob border border-line bg-card/85 p-5 shadow-sm sm:p-7">
          <div className="text-center">
            <p className="text-6xl leading-none" aria-hidden>
              {picked.symbol}
            </p>
            <h2 className="mt-2 font-cute text-3xl text-ink">{picked.name}</h2>

            <span
              className="mt-2 inline-block rounded-full px-4 py-1.5 text-sm font-semibold"
              style={{
                backgroundColor: PHROM_YAN_LEVEL_STYLES[picked.level].bg,
                color: PHROM_YAN_LEVEL_STYLES[picked.level].text,
              }}
            >
              {PHROM_YAN_LEVEL_STYLES[picked.level].emoji} {picked.level}
            </span>
          </div>

          <ul className="mt-4 flex flex-wrap justify-center gap-2">
            {picked.keywords.map((keyword) => (
              <li
                key={keyword}
                className="rounded-full bg-lilac/50 px-3 py-1 text-xs text-ink"
              >
                {keyword}
              </li>
            ))}
          </ul>

          <p className="mt-4 text-sm leading-relaxed text-ink">
            {picked.meaning}
          </p>

          <p className="mt-4 rounded-2xl border border-dashed border-info-mid bg-info p-4 text-sm leading-relaxed text-ink">
            <span className="font-semibold text-info-deep">คำแนะนำ · </span>
            {picked.advice}
          </p>

          <button
            type="button"
            onClick={startShuffle}
            className="mt-5 w-full rounded-full px-4 py-3 text-sm font-semibold grad-gold"
          >
            🔯 เสี่ยงทายใหม่อีกครั้ง
          </button>
        </section>
      )}
    </>
  );
}
