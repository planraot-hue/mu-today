import { ImageResponse } from "next/og";
import { AppIconArt } from "@/lib/app-icon";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  // ขนาดเล็กใช้เวอร์ชันย่อ รายละเอียดรอบลูกแก้วจะกลายเป็นจุดมั่วถ้าย่อลงมา
  return new ImageResponse(<AppIconArt detail={false} />, size);
}
