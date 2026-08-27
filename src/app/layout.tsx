import type { Metadata, Viewport } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-thai",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ระบบภายใน",
  description: "เว็บส่วนตัว เข้าใช้งานด้วยรหัสผ่าน",
  // หน้าเว็บนี้ต้องล็อกอิน ไม่ต้องให้ search engine เก็บ
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={notoSansThai.variable}>
      <body className="min-h-dvh font-sans antialiased">{children}</body>
    </html>
  );
}
