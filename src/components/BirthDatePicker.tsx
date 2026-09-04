"use client";

import { useEffect, useRef, useState } from "react";
import {
  daysInMonth,
  formatBirthDate,
  getWeekdayOf,
  type BirthDate,
} from "@/lib/birth";
import { THAI_DAY_NAMES, THAI_MONTH_NAMES } from "@/lib/thai-date";

type Props = {
  value: BirthDate;
  onChange: (next: BirthDate) => void;
  /** ป้ายกำกับ ใช้ตอนมีหลายชุดในหน้าเดียว เช่น หน้าสมพงศ์ */
  legend?: string;
  /** ต่อท้าย id เพื่อไม่ให้ซ้ำกันเมื่อมีสองชุดในหน้าเดียว */
  idPrefix: string;
};

/** ปีที่เลือกได้ ย้อนหลัง 100 ปีจากปีปัจจุบัน */
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, index) => CURRENT_YEAR - index);

/** ตัวย่อวันในสัปดาห์ เรียงจากอาทิตย์ */
const DAY_INITIALS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

const selectClass =
  "rounded-lg border border-line bg-cream px-2 py-1.5 text-sm text-ink outline-none transition focus:border-lilac-deep focus:ring-2 focus:ring-lilac-deep/25";

/**
 * ตัวเลือกวันเกิดแบบปฏิทิน
 *
 * เลือกวันจากตารางปฏิทิน แต่เดือนกับปียังเป็น dropdown
 * เพราะวันเกิดมักห่างจากปัจจุบันหลายสิบปี ถ้าให้กดลูกศรเลื่อนเดือนทีละเดือน
 * จะต้องกดหลายร้อยครั้ง
 */
export function BirthDatePicker({ value, onChange, legend, idPrefix }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /* ---------- ปิดเมื่อคลิกนอกกรอบหรือกด Esc ---------- */

  useEffect(() => {
    if (!isOpen) return;

    function handlePointer(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  function update(patch: Partial<BirthDate>) {
    const next = { ...value, ...patch };
    // เปลี่ยนเดือนหรือปีแล้ววันอาจเกินจำนวนวันของเดือนใหม่ ต้องดึงกลับ
    const limit = daysInMonth(next.month, next.year);
    if (next.day > limit) next.day = limit;
    onChange(next);
  }

  function pickDay(day: number) {
    onChange({ ...value, day });
    setIsOpen(false);
  }

  function shiftMonth(step: number) {
    let month = value.month + step;
    let year = value.year;

    if (month < 1) {
      month = 12;
      year -= 1;
    } else if (month > 12) {
      month = 1;
      year += 1;
    }

    update({ month, year });
  }

  const totalDays = daysInMonth(value.month, value.year);
  // ช่องว่างก่อนวันที่ 1 เพื่อให้วันตรงคอลัมน์
  const leadingBlanks = getWeekdayOf({ ...value, day: 1 });
  const selectedWeekday = getWeekdayOf(value);

  return (
    <div ref={containerRef} className="relative">
      {legend && (
        <p className="mb-2 text-sm font-medium text-ink">{legend}</p>
      )}

      {/* ปุ่มเปิดปฏิทิน */}
      <button
        type="button"
        id={`${idPrefix}-trigger`}
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-label={`เลือกวันเกิด ตอนนี้เลือก ${formatBirthDate(value)}`}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-line bg-cream px-4 py-3 text-left transition hover:border-lilac-deep focus:border-lilac-deep focus:outline-none focus:ring-2 focus:ring-lilac-deep/25"
      >
        <span className="min-w-0">
          <span className="block text-base text-ink">
            {formatBirthDate(value)}
          </span>
          <span className="block text-xs text-ink-soft">
            วัน{THAI_DAY_NAMES[selectedWeekday]}
          </span>
        </span>
        <span className="shrink-0 text-xl" aria-hidden>
          📅
        </span>
      </button>

      {/* แผงปฏิทิน */}
      {isOpen && (
        <div className="animate-pop-in absolute left-0 right-0 z-30 mt-2 rounded-2xl border border-line bg-card p-3 shadow-xl">
          {/* หัวปฏิทิน */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              aria-label="เดือนก่อนหน้า"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft transition hover:border-lilac-deep hover:text-lilac-deep"
            >
              ‹
            </button>

            <select
              value={value.month}
              onChange={(event) => update({ month: Number(event.target.value) })}
              aria-label="เดือน"
              className={`min-w-0 flex-1 ${selectClass}`}
            >
              {THAI_MONTH_NAMES.map((name, index) => (
                <option key={name} value={index + 1}>
                  {name}
                </option>
              ))}
            </select>

            <select
              value={value.year}
              onChange={(event) => update({ year: Number(event.target.value) })}
              aria-label="ปี พ.ศ."
              className={`shrink-0 ${selectClass}`}
            >
              {YEARS.map((year) => (
                <option key={year} value={year}>
                  {year + 543}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => shiftMonth(1)}
              aria-label="เดือนถัดไป"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft transition hover:border-lilac-deep hover:text-lilac-deep"
            >
              ›
            </button>
          </div>

          {/* หัวคอลัมน์วัน */}
          <div className="mt-3 grid grid-cols-7 gap-1">
            {DAY_INITIALS.map((initial, index) => (
              <div
                key={initial}
                className={`py-1 text-center text-[11px] font-medium ${
                  index === 0 ? "text-danger" : "text-ink-soft"
                }`}
              >
                {initial}
              </div>
            ))}
          </div>

          {/* ตารางวัน */}
          <div className="mt-1 grid grid-cols-7 gap-1">
            {Array.from({ length: leadingBlanks }).map((_, index) => (
              <div key={`blank-${index}`} />
            ))}

            {Array.from({ length: totalDays }, (_, index) => index + 1).map(
              (day) => {
                const isSelected = day === value.day;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => pickDay(day)}
                    aria-pressed={isSelected}
                    className={`flex h-9 items-center justify-center rounded-lg text-sm transition ${
                      isSelected
                        ? "grad-violet font-semibold"
                        : "text-ink hover:bg-lilac"
                    }`}
                  >
                    {day}
                  </button>
                );
              },
            )}
          </div>
        </div>
      )}
    </div>
  );
}
