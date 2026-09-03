import { ImageResponse } from "next/og";
import { AppIconArt } from "@/lib/app-icon";

/**
 * ไอคอน 192px สำหรับ manifest
 * เกณฑ์การติดตั้ง PWA ของ Chrome บังคับว่าต้องมีทั้งขนาด 192 และ 512
 * และต้องเป็นไฟล์ภาพจริง จึงสร้างเป็น PNG ด้วย ImageResponse ที่มากับ Next.js
 * ไม่ต้องเก็บไฟล์รูปไว้ในโปรเจกต์
 */
export function GET() {
  return new ImageResponse(<AppIconArt />, { width: 192, height: 192 });
}
