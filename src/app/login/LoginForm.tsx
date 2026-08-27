"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, type LoginState } from "@/app/actions";

const initialState: LoginState = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-blossom-deep px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blossom-deep disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "กำลังตรวจสอบ…" : "เข้าสู่ระบบ"}
    </button>
  );
}

export function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-ink">
          รหัสผ่าน
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoFocus
          required
          autoComplete="current-password"
          placeholder="กรอกรหัสผ่าน"
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "password-error" : undefined}
          className="w-full rounded-2xl border border-line bg-cream px-4 py-3 text-base text-ink outline-none transition placeholder:text-ink-soft focus:border-blossom-deep focus:ring-2 focus:ring-blossom-deep/25"
        />
      </div>

      {state.error && (
        <p
          id="password-error"
          role="alert"
          className="rounded-2xl bg-blossom/50 px-3 py-2 text-sm text-danger"
        >
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
