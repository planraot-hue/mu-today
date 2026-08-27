import type { Metadata, Viewport } from "next";
import { Itim, Mali } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const mali = Mali({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mali",
  display: "swap",
});

const itim = Itim({
  subsets: ["thai", "latin"],
  weight: ["400"],
  variable: "--font-itim",
  display: "swap",
});

export const metadata: Metadata = {
  title: "มูทูเดย์ · ดูดวงประจำวัน",
  description:
    "สีมงคลประจำวัน ดวงราศีรายวันรายสัปดาห์รายเดือน เสี่ยงเซียมซีวัดดัง 4 ภาค และเปิดไพ่ทาโรต์",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fff8f2",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={`${mali.variable} ${itim.variable}`}>
      <body className="min-h-dvh font-sans antialiased">
        <SiteHeader />
        {children}
        <footer className="mx-auto max-w-4xl px-5 pb-10 pt-4 text-center text-xs text-ink-soft">
          <p>
            มูทูเดย์ · คำทำนายทั้งหมดจัดทำขึ้นเพื่อความบันเทิง
            โปรดใช้วิจารณญาณในการรับชม
          </p>
        </footer>
      </body>
    </html>
  );
}
