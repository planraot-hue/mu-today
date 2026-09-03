import { ImageResponse } from "next/og";
import { AppIconArt } from "@/lib/app-icon";

/** ไอคอน 512px สำหรับ manifest และใช้เป็น maskable ได้ด้วย
 *  เพราะลายอยู่กลางภาพในรัศมีปลอดภัย 80% */
export function GET() {
  return new ImageResponse(<AppIconArt />, { width: 512, height: 512 });
}
