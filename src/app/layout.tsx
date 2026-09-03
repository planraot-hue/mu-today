import type { Metadata, Viewport } from "next";
import { Itim, Mali } from "next/font/google";
import { ChatWidget } from "@/components/ChatWidget";
import { PwaSetup } from "@/components/PwaSetup";
import { SiteHeader } from "@/components/SiteHeader";
import { getViewer } from "@/lib/viewer";
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
  // บอก iOS ให้เปิดแบบเต็มจอเหมือนแอปเมื่อเพิ่มลงหน้าโฮม
  appleWebApp: {
    capable: true,
    title: "มูทูเดย์",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fff8f2",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // อ่านสถานะผู้เข้าชมไว้โชว์บนหัวเว็บ
  // getViewer กลืน error ของ Supabase ไว้แล้ว จึงไม่ต้อง try/catch ซ้ำ
  const viewer = await getViewer();

  return (
    <html lang="th" className={`${mali.variable} ${itim.variable}`}>
      <body className="min-h-dvh font-sans antialiased">
        {/* ดัก beforeinstallprompt ไว้ตั้งแต่ก่อน React ทำงาน
            เบราว์เซอร์ยิง event นี้ครั้งเดียว ถ้าพลาดคือพลาดเลย */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();window.__muInstallPrompt=e;});",
          }}
        />

        <SiteHeader
          email={viewer.user?.email ?? null}
          isGuest={viewer.isGuest}
        />
        {children}
        <footer className="mx-auto max-w-4xl px-5 pb-10 pt-4 text-center text-xs text-ink-soft">
          <p>
            มูทูเดย์ · คำทำนายทั้งหมดจัดทำขึ้นเพื่อความบันเทิง
            โปรดใช้วิจารณญาณในการรับชม
          </p>
          <a
            href="/sources"
            className="mt-1 inline-block underline underline-offset-2 hover:text-ink"
          >
            📚 ดูที่มาของข้อมูลแต่ละฟีเจอร์
          </a>
        </footer>

        <ChatWidget />
        <PwaSetup />
      </body>
    </html>
  );
}
