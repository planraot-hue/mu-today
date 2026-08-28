import { createServerClient } from "@supabase/ssr";
import type { CookieToSet } from "./cookies";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";
import { GUEST_COOKIE, GUEST_COOKIE_VALUE } from "@/lib/viewer";

/** เส้นทางที่เข้าได้โดยไม่ต้องล็อกอิน */
const PUBLIC_PATHS = ["/login", "/auth/callback", "/auth/auth-error"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

/**
 * ต่ออายุ session ของ Supabase แล้วกันหน้าที่ต้องล็อกอิน
 *
 * หน้าที่หลักคือการเขียน cookie ที่ถูกรีเฟรชกลับไปให้ browser
 * ถ้าไม่ทำตรงนี้ token จะหมดอายุแล้วผู้ใช้จะหลุดออกจากระบบเอง
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // ยังไม่ได้ตั้ง env — ปล่อยผ่านไปให้หน้าเว็บแสดงข้อความบอกวิธีตั้งค่าแทนที่จะพัง 500
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return supabaseResponse;
  }

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  // ห้ามใส่โค้ดคั่นระหว่าง createServerClient กับ getUser()
  // ไม่งั้นอาจเจอปัญหาผู้ใช้หลุดออกจากระบบแบบสุ่มหาสาเหตุยาก
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ผู้เยี่ยมชมที่ยังไม่มีบัญชีก็เข้าดูเนื้อหาได้เหมือนกัน
  const isGuest =
    request.cookies.get(GUEST_COOKIE)?.value === GUEST_COOKIE_VALUE;
  const canView = Boolean(user) || isGuest;

  const { pathname, search } = request.nextUrl;

  // ล็อกอินอยู่แล้วไม่ต้องเห็นหน้า login อีก
  if (user && pathname === "/login") {
    return redirectWithCookies(request, "/", supabaseResponse);
  }

  // ยังไม่ล็อกอินและกำลังจะเข้าหน้าที่ต้องล็อกอิน
  if (!canView && !isPublicPath(pathname)) {
    return redirectWithCookies(
      request,
      "/login",
      supabaseResponse,
      pathname + search,
    );
  }

  return supabaseResponse;
}

/**
 * สร้าง redirect โดยยกคุกกี้ที่ Supabase เพิ่งรีเฟรชติดไปด้วย
 * ถ้าลืมยกไป token ที่รีเฟรชแล้วจะหายไปกับ response ที่ถูกทิ้ง
 */
function redirectWithCookies(
  request: NextRequest,
  pathname: string,
  from: NextResponse,
  nextParam?: string,
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  if (nextParam && nextParam !== "/") {
    url.searchParams.set("next", nextParam);
  }

  const response = NextResponse.redirect(url);
  from.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie);
  });
  return response;
}
