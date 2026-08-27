"use client";

import { useState } from "react";
import {
  POSITION_HINTS,
  TAROT_DECK,
  THREE_CARD_POSITIONS,
  type DrawnCard,
  type TarotSpreadType,
} from "@/lib/tarot";

const SPREADS: {
  type: TarotSpreadType;
  label: string;
  detail: string;
  count: number;
}[] = [
  { type: "single", label: "เปิด 1 ใบ", detail: "ถามสั้นๆ ตอบตรงประเด็น", count: 1 },
  { type: "three", label: "เปิด 3 ใบ", detail: "อดีต · ปัจจุบัน · อนาคต", count: 3 },
];

/** สับไพ่แล้วหยิบตามจำนวนที่ต้องการ พร้อมสุ่มว่าไพ่ตั้งตรงหรือกลับหัว */
function drawCards(count: number): DrawnCard[] {
  const deck = [...TAROT_DECK];
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck.slice(0, count).map((card, index) => ({
    card,
    reversed: Math.random() < 0.35,
    position: count === 1 ? "คำตอบ" : THREE_CARD_POSITIONS[index],
  }));
}

export function TarotReader() {
  const [spread, setSpread] = useState<TarotSpreadType>("single");
  const [drawn, setDrawn] = useState<DrawnCard[] | null>(null);
  const [flipped, setFlipped] = useState<Set<number>>(new Set());

  function startReading(nextSpread: TarotSpreadType) {
    const config = SPREADS.find((item) => item.type === nextSpread);
    if (!config) return;

    setSpread(nextSpread);
    setDrawn(drawCards(config.count));
    setFlipped(new Set());
  }

  function flipCard(index: number) {
    setFlipped((current) => {
      if (current.has(index)) return current;
      const next = new Set(current);
      next.add(index);
      return next;
    });
  }

  const allFlipped = drawn !== null && flipped.size === drawn.length;

  return (
    <>
      {/* เลือกรูปแบบการเปิดไพ่ */}
      <section className="rounded-blob border border-line bg-card/80 p-5 shadow-sm sm:p-6">
        <h2 className="font-cute text-xl text-ink">
          ตั้งคำถามในใจ แล้วเลือกวิธีเปิดไพ่
        </h2>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {SPREADS.map((item) => (
            <button
              key={item.type}
              type="button"
              onClick={() => startReading(item.type)}
              className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${
                spread === item.type && drawn
                  ? "border-transparent bg-sky-deep text-white shadow-sm"
                  : "border-line bg-card text-ink hover:border-sky-deep"
              }`}
            >
              <p className="font-cute text-xl">{item.label}</p>
              <p
                className={`text-xs ${
                  spread === item.type && drawn ? "text-white/80" : "text-ink-soft"
                }`}
              >
                {item.detail}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* สำรับไพ่ */}
      {drawn && (
        <section className="mt-4 rounded-blob border border-line bg-card/80 p-5 shadow-sm sm:p-6">
          <p className="text-center text-sm text-ink-soft">
            {allFlipped ? "อ่านคำทำนายด้านล่างได้เลย" : "แตะที่ไพ่เพื่อเปิด"}
          </p>

          <div
            className={`mt-4 grid justify-center gap-3 ${
              drawn.length === 1 ? "grid-cols-1" : "grid-cols-3"
            }`}
          >
            {drawn.map((item, index) => (
              <div key={`${item.card.id}-${index}`} className="text-center">
                <p className="mb-1.5 text-xs text-ink-soft">{item.position}</p>

                <button
                  type="button"
                  onClick={() => flipCard(index)}
                  aria-label={
                    flipped.has(index)
                      ? `ไพ่${item.card.name}`
                      : `เปิดไพ่ตำแหน่ง${item.position}`
                  }
                  className="card-scene mx-auto block aspect-[2/3] w-full max-w-[168px]"
                >
                  <div
                    className={`card-inner ${flipped.has(index) ? "is-flipped" : ""}`}
                  >
                    <CardBack />
                    <CardFront drawn={item} />
                  </div>
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => startReading(spread)}
            className="mx-auto mt-5 block rounded-full border border-line px-5 py-2.5 text-sm text-ink-soft transition hover:border-sky-deep hover:text-ink"
          >
            🔄 สับไพ่ใหม่
          </button>
        </section>
      )}

      {/* คำทำนาย */}
      {drawn && flipped.size > 0 && (
        <section className="mt-4 space-y-3">
          {drawn.map((item, index) =>
            flipped.has(index) ? (
              <article
                key={`meaning-${item.card.id}-${index}`}
                className="animate-pop-in rounded-blob border border-line bg-card/85 p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky text-2xl"
                    aria-hidden
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
                        <span className="ml-2 rounded-full bg-blossom px-2.5 py-0.5 align-middle text-xs text-ink">
                          กลับหัว
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-ink-soft">{item.card.nameEn}</p>
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
  return (
    <div className="card-face card-face--back flex flex-col items-center justify-center border-2 border-lilac-deep bg-card p-3 text-center shadow-md">
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
        <p className="mt-1 rounded-full bg-blossom px-2 py-0.5 text-[10px] text-ink">
          กลับหัว
        </p>
      )}
    </div>
  );
}
