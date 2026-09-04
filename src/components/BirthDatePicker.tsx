"use client";

import { daysInMonth, type BirthDate } from "@/lib/birth";
import { THAI_MONTH_NAMES } from "@/lib/thai-date";

type Props = {
  value: BirthDate;
  onChange: (next: BirthDate) => void;
  /** ป้ายกำกับ ใช้ตอนมีหลายชุดในหน้าเดียว เช่น หน้าสมพงศ์ */
  legend?: string;
  /** ต่อท้าย id ของ input เพื่อไม่ให้ซ้ำกันเมื่อมีสองชุดในหน้าเดียว */
  idPrefix: string;
};

/** ปีที่เลือกได้ ย้อนหลัง 100 ปีจากปีปัจจุบัน */
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, index) => CURRENT_YEAR - index);

const selectClass =
  "w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm text-ink outline-none transition focus:border-lilac-deep focus:ring-2 focus:ring-lilac-deep/25";

export function BirthDatePicker({ value, onChange, legend, idPrefix }: Props) {
  const maxDay = daysInMonth(value.month, value.year);

  function update(patch: Partial<BirthDate>) {
    const next = { ...value, ...patch };
    // ถ้าเปลี่ยนเดือนหรือปีแล้ววันเกินจำนวนวันของเดือนใหม่ ให้ดึงกลับมาที่วันสุดท้าย
    const limit = daysInMonth(next.month, next.year);
    if (next.day > limit) next.day = limit;
    onChange(next);
  }

  return (
    <fieldset>
      {legend && (
        <legend className="mb-2 text-sm font-medium text-ink">{legend}</legend>
      )}

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label
            htmlFor={`${idPrefix}-day`}
            className="mb-1 block text-xs text-ink-soft"
          >
            วันที่
          </label>
          <select
            id={`${idPrefix}-day`}
            value={value.day}
            onChange={(event) => update({ day: Number(event.target.value) })}
            className={selectClass}
          >
            {Array.from({ length: maxDay }, (_, index) => index + 1).map(
              (day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ),
            )}
          </select>
        </div>

        <div>
          <label
            htmlFor={`${idPrefix}-month`}
            className="mb-1 block text-xs text-ink-soft"
          >
            เดือน
          </label>
          <select
            id={`${idPrefix}-month`}
            value={value.month}
            onChange={(event) => update({ month: Number(event.target.value) })}
            className={selectClass}
          >
            {THAI_MONTH_NAMES.map((name, index) => (
              <option key={name} value={index + 1}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor={`${idPrefix}-year`}
            className="mb-1 block text-xs text-ink-soft"
          >
            ปี พ.ศ.
          </label>
          <select
            id={`${idPrefix}-year`}
            value={value.year}
            onChange={(event) => update({ year: Number(event.target.value) })}
            className={selectClass}
          >
            {YEARS.map((year) => (
              <option key={year} value={year}>
                {year + 543}
              </option>
            ))}
          </select>
        </div>
      </div>
    </fieldset>
  );
}
