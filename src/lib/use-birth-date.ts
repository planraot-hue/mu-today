"use client";

import { useCallback, useEffect, useState } from "react";
import { isValidBirthDate, type BirthDate } from "@/lib/birth";

/**
 * เก็บวันเกิดไว้ใน localStorage เพื่อให้กรอกครั้งเดียวใช้ได้ทุกหน้า
 *
 * ค่าเริ่มต้นต้องเหมือนกันทั้งฝั่ง server และ client จึงอ่าน localStorage
 * ใน useEffect ไม่ใช่ตอน initial state ไม่งั้นจะเกิด hydration mismatch
 */

export const DEFAULT_BIRTH: BirthDate = { day: 1, month: 1, year: 2000 };

function parseStored(raw: string): BirthDate | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;

    const candidate = parsed as Record<string, unknown>;
    if (
      typeof candidate.day !== "number" ||
      typeof candidate.month !== "number" ||
      typeof candidate.year !== "number"
    ) {
      return null;
    }

    const birth: BirthDate = {
      day: candidate.day,
      month: candidate.month,
      year: candidate.year,
    };
    return isValidBirthDate(birth) ? birth : null;
  } catch {
    return null;
  }
}

export function useStoredBirthDate(storageKey: string) {
  const [birth, setBirth] = useState<BirthDate>(DEFAULT_BIRTH);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = parseStored(raw);
        if (parsed) setBirth(parsed);
      }
    } catch {
      // บางเบราว์เซอร์ปิด storage ไว้ — ใช้ค่าเริ่มต้นไปก่อน
    }
    setRestored(true);
  }, [storageKey]);

  const save = useCallback(
    (next: BirthDate) => {
      setBirth(next);
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // เช่นเดียวกับด้านบน
      }
    },
    [storageKey],
  );

  return { birth, setBirth: save, restored };
}
