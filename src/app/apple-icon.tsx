import { ImageResponse } from "next/og";
import { AppIconArt } from "@/lib/app-icon";

/** iOS ใช้ไอคอนนี้ตอนเพิ่มลงหน้าโฮม และไม่รองรับ manifest icons */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<AppIconArt />, size);
}
