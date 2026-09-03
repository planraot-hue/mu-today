/**
 * Service worker ของมูทูเดย์
 *
 * วางไว้ใน public/ เพื่อให้เสิร์ฟที่ /sw.js ซึ่งอยู่ระดับรากของเว็บ
 * ขอบเขตของ service worker จะครอบทั้งเว็บได้ก็ต่อเมื่อไฟล์อยู่ที่รากเท่านั้น
 *
 * กลยุทธ์แคช:
 * - ไฟล์ที่ Next.js ใส่แฮชในชื่อ (/_next/static) แคชถาวรได้เลย เพราะชื่อเปลี่ยนทุกครั้งที่เนื้อหาเปลี่ยน
 * - หน้าเว็บใช้เครือข่ายก่อน ถ้าเน็ตหลุดค่อยดึงจากแคช แล้วค่อยตกไปหน้าออฟไลน์
 * - API การล็อกอินและแชทไม่แคชเด็ดขาด เพราะเป็นข้อมูลรายคนและเปลี่ยนตลอด
 */

const VERSION = "v1";
const STATIC_CACHE = `mutoday-static-${VERSION}`;
const PAGE_CACHE = `mutoday-pages-${VERSION}`;
const OFFLINE_URL = "/offline";

/** เส้นทางที่ห้ามแคชเด็ดขาด */
function isNeverCached(url) {
  return (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/auth/") ||
    url.pathname === "/login"
  );
}

/** ไฟล์ที่ชื่อมีแฮช เปลี่ยนเนื้อหาเมื่อไหร่ชื่อก็เปลี่ยน จึงแคชยาวได้ */
function isImmutableAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icon-") ||
    url.pathname === "/apple-icon" ||
    url.pathname === "/icon"
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PAGE_CACHE)
      .then((cache) => cache.add(OFFLINE_URL))
      // ถ้าโหลดหน้าออฟไลน์ไม่ได้ก็ยังติดตั้ง service worker ต่อไป ดีกว่าล้มทั้งตัว
      .catch(() => undefined)
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== PAGE_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // แคชได้เฉพาะ GET และเฉพาะโดเมนตัวเอง
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (isNeverCached(url)) return;

  // ไฟล์ static: หยิบจากแคชก่อน ไม่มีค่อยโหลด
  if (isImmutableAsset(url)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          }),
      ),
    );
    return;
  }

  // หน้าเว็บ: ใช้เน็ตก่อนเพื่อให้ได้ดวงของวันปัจจุบันเสมอ
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(PAGE_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached || caches.match(OFFLINE_URL))
            .then(
              (cached) =>
                cached ||
                new Response("ออฟไลน์อยู่", {
                  status: 503,
                  headers: { "Content-Type": "text/plain; charset=utf-8" },
                }),
            ),
        ),
    );
  }
});
