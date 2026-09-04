"use client";

import { useEffect, useState } from "react";
import {
  DECK_SIZE,
  POSITION_HINTS,
  SUIT_INFO,
  drawCards,
  type DrawnCard,
  type TarotSpreadType,
} from "@/lib/tarot";

const SPREADS: {
  type: TarotSpreadType;
  label: string;
  detail: string;
  count: number;
}[] = [
  {
    type: "single",
    label: "เปิด 1 ใบ",
    detail: "ถามสั้นๆ ตอบตรงประเด็น",
    count: 1,
  },
  {
    type: "three",
    label: "เปิด 3 ใบ",
    detail: "อดีต · ปัจจุบัน · อนาคต",
    count: 3,
  },
];

/** ระยะเวลาที่โชว์แอนิเมชันสับไพ่ ก่อนจะแจกไพ่ชุดใหม่ */
const SHUFFLE_MS = 750;

type Phase = "idle" | "shuffling" | "ready";

export function TarotReader() {
  const [spread, setSpread] = useState<TarotSpreadType>("single");
  const [phase, setPhase] = useState<Phase>("idle");
  const [drawn, setDrawn] = useState<DrawnCard[] | null>(null);
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [shuffleCount, setShuffleCount] = useState(0);

  const cardCount =
    SPREADS.find((item) => item.type === spread)?.count ?? 1;

  /** เริ่มสับไพ่ ไพ่ชุดใหม่จะถูกแจกหลังแอนิเมชันจบ */
  function startShuffle(nextSpread: TarotSpreadType) {
    if (phase === "shuffling") return;
    setSpread(nextSpread);
    setFlipped(new Set());
    setShuffleCount((current) => current + 1);
    setPhase("shuffling");
  }

  useEffect(() => {
    if (phase !== "shuffling") return;

    const timer = window.setTimeout(() => {
      setDrawn(drawCards(cardCount));
      setPhase("ready");
    }, SHUFFLE_MS);

    return () => window.clearTimeout(timer);
  }, [phase, cardCount]);

  function flipCard(index: number) {
    setFlipped((current) => {
      if (current.has(index)) return current;
      const next = new Set(current);
      next.add(index);
      return next;
    });
  }

  const isShuffling = phase === "shuffling";
  const allFlipped = drawn !== null && flipped.size === drawn.length;

  return (
    <>
      {/* เลือกรูปแบบการเปิดไพ่ */}
      <section className="rounded-blob border border-line bg-card/80 p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-cute text-xl text-ink">
            ตั้งคำถามในใจ แล้วเลือกวิธีเปิดไพ่
          </h2>
          <span className="rounded-full bg-lilac/60 px-3 py-1 text-xs text-ink">
            สำรับเต็ม {DECK_SIZE} ใบ
          </span>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {SPREADS.map((item) => (
            <button
              key={item.type}
              type="button"
              onClick={() => startShuffle(item.type)}
              disabled={isShuffling}
              className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 ${
                spread === item.type && drawn
                  ? "grad-violet"
                  : "border-line bg-card text-ink hover:border-lilac-deep"
              }`}
            >
              <p className="font-cute text-xl">{item.label}</p>
              <p
                className={`text-xs ${
                  spread === item.type && drawn
                    ? "text-white/80"
                    : "text-ink-soft"
                }`}
              >
                {item.detail}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* สำรับไพ่ */}
      {(drawn || isShuffling) && (
        <section className="mt-4 rounded-blob border border-line bg-card/80 p-5 shadow-sm sm:p-6">
          <p
            role="status"
            aria-live="polite"
            className="text-center text-sm text-ink-soft"
          >
            {isShuffling
              ? "🔀 กำลังสับไพ่…"
              : allFlipped
                ? "อ่านคำทำนายด้านล่างได้เลย"
                : "แตะที่ไพ่เพื่อเปิด"}
          </p>

          <div
            className={`mt-4 grid justify-center gap-3 ${
              cardCount === 1 ? "grid-cols-1" : "grid-cols-3"
            }`}
          >
            {Array.from({ length: cardCount }).map((_, index) => {
              const item = drawn?.[index];
              const position =
                item?.position ??
                (cardCount === 1 ? "คำตอบ" : ["อดีต", "ปัจจุบัน", "อนาคต"][index]);

              return (
                <div key={`slot-${index}`} className="text-center">
                  <p className="mb-1.5 text-xs text-ink-soft">{position}</p>

                  <button
                    type="button"
                    disabled={isShuffling || !item}
                    onClick={() => flipCard(index)}
                    aria-label={
                      isShuffling
                        ? "กำลังสับไพ่"
                        : flipped.has(index) && item
                          ? `ไพ่${item.card.name}`
                          : `เปิดไพ่ตำแหน่ง${position}`
                    }
                    className={`card-scene mx-auto block aspect-[2/3] w-full max-w-[168px] ${
                      isShuffling ? "animate-shuffle" : ""
                    }`}
                    style={
                      isShuffling
                        ? { animationDelay: `${index * 90}ms` }
                        : undefined
                    }
                  >
                    <div
                      className={`card-inner ${
                        flipped.has(index) && item ? "is-flipped" : ""
                      }`}
                    >
                      <CardBack />
                      {item && <CardFront drawn={item} />}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => startShuffle(spread)}
              disabled={isShuffling}
              className="rounded-full border border-line px-5 py-2.5 text-sm text-ink-soft transition hover:border-lilac-deep hover:text-ink disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isShuffling ? "🔀 กำลังสับไพ่…" : "🔄 สับไพ่ใหม่"}
            </button>

            {shuffleCount > 0 && (
              <p className="mt-2 text-xs text-ink-soft">
                {isShuffling
                  ? "กำลังสับ…"
                  : `✨ สับไพ่แล้ว ${shuffleCount} ครั้ง`}
              </p>
            )}
          </div>
        </section>
      )}

      {/* คำทำนาย */}
      {drawn && !isShuffling && flipped.size > 0 && (
        <section className="mt-4 space-y-3">
          {drawn.map((item, index) =>
            flipped.has(index) ? (
              <article
                key={`meaning-${item.card.id}-${index}`}
                className="animate-pop-in rounded-blob border border-line bg-card/85 p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl"
                    aria-hidden
                    style={{
                      backgroundColor: item.card.suit
                        ? `${SUIT_INFO[item.card.suit].hex}66`
                        : undefined,
                    }}
                  >
                    {item.card.symbol}
                  </span>

                  <div className="min-w-0">
                    <p className="text-xs text-ink-soft">
                      {item.position} · {POSITION_HINTS[item.position]}
                    </p>
                    <h3 className="font-cute text-2xl leading-tight text-ink">
                      {item.card.name}
                      {item.reversed && (
                        <span className="ml-2 rounded-full bg-lilac px-2.5 py-0.5 align-middle text-xs text-ink">
                          กลับหัว
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-ink-soft">
                      {item.card.nameEn} ·{" "}
                      {item.card.suit
                        ? `ชุด${SUIT_INFO[item.card.suit].label} ธาตุ${SUIT_INFO[item.card.suit].element}`
                        : "ไพ่ชุดใหญ่"}
                    </p>
                  </div>
                </div>

                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {item.card.keywords.map((keyword) => (
                    <li
                      key={keyword}
                      className="rounded-full bg-lilac/50 px-3 py-1 text-xs text-ink"
                    >
                      {keyword}
                    </li>
                  ))}
                </ul>

                <p className="mt-3 text-sm leading-relaxed text-ink">
                  {item.reversed ? item.card.reversed : item.card.upright}
                </p>
              </article>
            ) : null,
          )}
        </section>
      )}
    </>
  );
}

function CardBack() {
  return (
    <div className="card-face flex items-center justify-center border-2 border-white bg-lilac-deep shadow-md">
      <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.45),transparent_55%)]">
        <div className="text-center text-white">
          <p className="text-3xl" aria-hidden>
            ✨
          </p>
          <p className="font-cute text-lg">มูทูเดย์</p>
          <p className="text-[10px] tracking-widest opacity-80">TAROT</p>
        </div>
      </div>
    </div>
  );
}

function CardFront({ drawn }: { drawn: DrawnCard }) {
  const suitInfo = drawn.card.suit ? SUIT_INFO[drawn.card.suit] : null;

  return (
    <div
      className="card-face card-face--back flex flex-col items-center justify-center border-2 p-3 text-center shadow-md"
      style={{
        borderColor: suitInfo?.hex ?? "#A98FEE",
        backgroundColor: suitInfo ? `${suitInfo.hex}26` : "#FFFFFF",
      }}
    >
      <span
        className="text-4xl"
        aria-hidden
        style={{ transform: drawn.reversed ? "rotate(180deg)" : undefined }}
      >
        {drawn.card.symbol}
      </span>
      <p className="mt-2 font-cute text-lg leading-tight text-ink">
        {drawn.card.name}
      </p>
      <p className="text-[10px] text-ink-soft">{drawn.card.nameEn}</p>
      {drawn.reversed && (
        <p className="mt-1 rounded-full bg-lilac px-2 py-0.5 text-[10px] text-ink">
          กลับหัว
        </p>
      )}
    </div>
  );
}
