import type { MetadataRoute } from "next";

/**
 * Web App Manifest — Next.js เสิร์ฟไฟล์นี้ที่ /manifest.webmanifest
 * และใส่ <link rel="manifest"> ให้อัตโนมัติ
 *
 * เกณฑ์การติดตั้งของ Chrome บังคับว่าต้องมี short_name หรือ name,
 * ไอคอนขนาด 192 และ 512, start_url และ display เป็น standalone
 * ครบทุกข้อแล้วในไฟล์นี้
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "มูทูเดย์ · ดูดวงประจำวัน",
    short_name: "มูทูเดย์",
    description:
      "สีมงคลประจำวันจากตำราทักษาปกรณ์ ดวงราศี ดวงจีน ดวงสมพงศ์ เซียมซี ไพ่ทาโรต์ และไพ่พรหมญาณ",
    lang: "th",
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fff8f2",
    theme_color: "#fff8f2",
    categories: ["lifestyle", "entertainment"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // maskable ให้ Android ครอบทรงไอคอนตามธีมเครื่องได้โดยไม่ตัดลายทิ้ง
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "สีมงคลวันนี้", url: "/" },
      { name: "ดวงราศี", url: "/horoscope" },
      { name: "เสี่ยงเซียมซี", url: "/siamsi" },
      { name: "ไพ่ทาโรต์", url: "/tarot" },
    ],
  };
}
