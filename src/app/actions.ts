"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AuthState = {
  error: string | null;
  /** ข้อความแจ้งเตือนที่ไม่ใช่ error เช่น "ส่งลิงก์ยืนยันไปที่อีเมลแล้ว" */
  notice: string | null;
};

// ไฟล์ "use server" export ได้เฉพาะ async function ค่าคงที่จึงต้องไม่ export
const NOT_CONFIGURED: AuthState = {
  error: "ระบบยังไม่ได้ตั้งค่าการเชื่อมต่อ Supabase",
  notice: null,
};

/**
 * อนุญาตเฉพาะ path ภายในเว็บ
 * กัน open redirect: ค่า next มาจาก query string ซึ่งผู้ใช้แก้ได้
 * ("//evil.com" เป็น protocol-relative URL ที่พาออกนอกเว็บได้ จึงต้องกันด้วย)
 */
function safeNextPath(value: string): string {
  if (!value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

/** หา origin ของเว็บจาก header เพื่อใช้เป็นปลายทางของลิงก์ยืนยันอีเมล */
async function getOrigin(): Promise<string> {
  const headerList = await headers();
  const origin = headerList.get("origin");
  if (origin) return origin;

  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "https";
  return `${protocol}://${host}`;
}

/** แปลงข้อความ error ของ Supabase เป็นภาษาไทย */
function translateAuthError(message: string): string {
  const lowered = message.toLowerCase();

  if (lowered.includes("invalid login credentials")) {
    return "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
  }
  if (lowered.includes("email not confirmed")) {
    return "ยังไม่ได้ยืนยันอีเมล กรุณาเปิดลิงก์ในอีเมลที่ส่งไปให้ก่อน";
  }
  if (lowered.includes("already registered")) {
    return "อีเมลนี้สมัครไว้แล้ว ลองเข้าสู่ระบบแทน";
  }
  if (lowered.includes("password should be at least")) {
    return "รหัสผ่านสั้นเกินไป ต้องมีอย่างน้อย 6 ตัวอักษร";
  }
  if (lowered.includes("rate limit") || lowered.includes("too many")) {
    return "ลองบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่";
  }
  if (lowered.includes("unable to validate email")) {
    return "รูปแบบอีเมลไม่ถูกต้อง";
  }
  return `ดำเนินการไม่สำเร็จ: ${message}`;
}

function readCredentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
    nextPath: safeNextPath(String(formData.get("next") ?? "/")),
  };
}

export async function signInAction(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const { email, password, nextPath } = readCredentials(formData);

  if (!email || !password) {
    return { error: "กรุณากรอกอีเมลและรหัสผ่านให้ครบ", notice: null };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return { error: translateAuthError(error.message), notice: null };
    }
  } catch (error) {
    console.error(error);
    return NOT_CONFIGURED;
  }

  revalidatePath("/", "layout");
  // redirect() ทำงานด้วยการ throw — ต้องอยู่นอก try/catch ไม่งั้นจะถูกดักไว้
  redirect(nextPath);
}

export async function signUpAction(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const { email, password } = readCredentials(formData);

  if (!email || !password) {
    return { error: "กรุณากรอกอีเมลและรหัสผ่านให้ครบ", notice: null };
  }
  if (password.length < 6) {
    return { error: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร", notice: null };
  }

  let signedInImmediately = false;

  try {
    const supabase = await createClient();
    const origin = await getOrigin();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${origin}/auth/callback` },
    });

    if (error) {
      return { error: translateAuthError(error.message), notice: null };
    }

    // ถ้าปิดการยืนยันอีเมลไว้ในโปรเจกต์ Supabase จะได้ session กลับมาเลย เข้าเว็บได้ทันที
    signedInImmediately = Boolean(data.session);
  } catch (error) {
    console.error(error);
    return NOT_CONFIGURED;
  }

  if (signedInImmediately) {
    revalidatePath("/", "layout");
    redirect("/");
  }

  return {
    error: null,
    notice: `ส่งลิงก์ยืนยันไปที่ ${email} แล้ว กรุณาเปิดอีเมลแล้วกดยืนยันก่อนเข้าสู่ระบบ`,
  };
}

export async function signOutAction(): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (error) {
    // ออกจากระบบไม่สำเร็จก็ยังพากลับไปหน้า login อยู่ดี
    console.error(error);
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
