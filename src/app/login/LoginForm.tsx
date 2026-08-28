"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { signInAction, signUpAction, type AuthState } from "@/app/actions";

type Mode = "signin" | "signup";

// นิยามไว้ฝั่งนี้ เพราะไฟล์ "use server" export ได้เฉพาะ async function
const EMPTY_STATE: AuthState = { error: null, notice: null };

function SubmitButton({ mode }: { mode: Mode }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-blossom-deep px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blossom-deep disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending
        ? "กำลังดำเนินการ…"
        : mode === "signin"
          ? "เข้าสู่ระบบ"
          : "สมัครสมาชิก"}
    </button>
  );
}

export function LoginForm({ next }: { next: string }) {
  const [mode, setMode] = useState<Mode>("signin");

  // แยก state ของสองโหมด เพื่อไม่ให้ error ของฝั่งหนึ่งค้างไปโผล่อีกฝั่ง
  const [signInState, signInFormAction] = useActionState<AuthState, FormData>(
    signInAction,
    EMPTY_STATE,
  );
  const [signUpState, signUpFormAction] = useActionState<AuthState, FormData>(
    signUpAction,
    EMPTY_STATE,
  );

  const state = mode === "signin" ? signInState : signUpState;
  const formAction = mode === "signin" ? signInFormAction : signUpFormAction;

  return (
    <>
      {/* สลับโหมด */}
      <div
        role="tablist"
        aria-label="เลือกระหว่างเข้าสู่ระบบกับสมัครสมาชิก"
        className="mb-5 flex gap-1.5 rounded-full border border-line bg-cream p-1.5"
      >
        {(["signin", "signup"] as Mode[]).map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={mode === item}
            onClick={() => setMode(item)}
            className={`flex-1 rounded-full px-3 py-2 text-sm transition ${
              mode === item
                ? "grad-pink"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            {item === "signin" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
          </button>
        ))}
      </div>

      {/* key ทำให้ React สร้างฟอร์มใหม่ตอนสลับโหมด ค่าที่พิมพ์ค้างไว้จะถูกล้าง */}
      <form key={mode} action={formAction} className="space-y-4">
        <input type="hidden" name="next" value={next} />

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-ink">
            อีเมล
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-line bg-cream px-4 py-3 text-base text-ink outline-none transition placeholder:text-ink-soft focus:border-blossom-deep focus:ring-2 focus:ring-blossom-deep/25"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-ink"
          >
            รหัสผ่าน
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete={
              mode === "signin" ? "current-password" : "new-password"
            }
            placeholder={mode === "signup" ? "อย่างน้อย 6 ตัวอักษร" : "รหัสผ่าน"}
            aria-invalid={state.error ? true : undefined}
            aria-describedby={state.error ? "auth-error" : undefined}
            className="w-full rounded-2xl border border-line bg-cream px-4 py-3 text-base text-ink outline-none transition placeholder:text-ink-soft focus:border-blossom-deep focus:ring-2 focus:ring-blossom-deep/25"
          />
        </div>

        {state.error && (
          <p
            id="auth-error"
            role="alert"
            className="rounded-2xl bg-blossom/50 px-3 py-2 text-sm text-danger"
          >
            {state.error}
          </p>
        )}

        {state.notice && (
          <p
            role="status"
            className="rounded-2xl bg-mint/60 px-3 py-2 text-sm leading-relaxed text-ink"
          >
            ✉️ {state.notice}
          </p>
        )}

        <SubmitButton mode={mode} />
      </form>

      <p className="mt-4 text-center text-xs leading-relaxed text-ink-soft">
        {mode === "signin"
          ? "ยังไม่มีบัญชี? กดแท็บสมัครสมาชิกด้านบนได้เลย"
          : "สมัครแล้วต้องเปิดลิงก์ยืนยันในอีเมลก่อนถึงจะเข้าใช้งานได้"}
      </p>
    </>
  );
}
