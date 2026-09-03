import { ImageResponse } from "next/og";
import { AppIconArt } from "@/lib/app-icon";

/**
 * รูปพรีวิวตอนแชร์ลิงก์ (LINE, Facebook, X, Discord)
 *
 * ใช้ชื่อไฟล์ตามแบบแผนของ Next.js จึงถูกใส่เป็น og:image ให้อัตโนมัติ
 * ขนาด 1200x630 เป็นมาตรฐานที่ทุกแพลตฟอร์มรองรับ
 */

export const alt = "มูทูเดย์ · ดูดวงประจำวัน";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CREAM = "#FFF6F0";
const INK = "#4A3B52";
const INK_SOFT = "#8D7F97";

const TITLE = "มูทูเดย์";
const SUBTITLE = "ดูดวงประจำวัน";
const FEATURES = "สีมงคล · ราศี · ดวงจีน · สมพงศ์ · เซียมซี · ไพ่ทาโรต์";

/**
 * ดึงฟอนต์ไทยมาให้ satori
 *
 * satori ไม่มีฟอนต์ติดมาด้วย ถ้าไม่โหลดเอง ตัวอักษรไทยจะกลายเป็นสี่เหลี่ยมว่าง
 * พารามิเตอร์ text บอก Google ให้ตัดเฉพาะตัวอักษรที่ใช้จริง ไฟล์จึงเล็กมาก
 */
async function loadThaiFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=Mali:wght@600&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();

    // ต้องได้ไฟล์ truetype เพราะ satori อ่าน woff2 ไม่ได้
    const match = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/);
    if (!match) return null;

    return await (await fetch(match[1])).arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const allText = `${TITLE}${SUBTITLE}${FEATURES}`;
  const font = await loadThaiFont(allText);

  // โหลดฟอนต์ไม่สำเร็จก็ยังต้องได้รูป แค่ไม่มีตัวหนังสือ
  // ดีกว่าปล่อยให้ทั้ง route พังจนไม่มีพรีวิวเลย
  if (!font) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            background: CREAM,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", width: 460, height: 460 }}>
            <AppIconArt />
          </div>
        </div>
      ),
      size,
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: CREAM,
          alignItems: "center",
          padding: "0 86px",
        }}
      >
        {/* ลูกแก้ว */}
        <div style={{ display: "flex", width: 380, height: 380, flexShrink: 0 }}>
          <AppIconArt />
        </div>

        {/* ข้อความ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: 64,
          }}
        >
          <div style={{ fontSize: 104, color: INK, lineHeight: 1.1 }}>
            {TITLE}
          </div>
          <div style={{ fontSize: 46, color: INK, marginTop: 10 }}>
            {SUBTITLE}
          </div>

          {/* เส้นคั่นไล่สีเดียวกับปุ่มในเว็บ */}
          <div
            style={{
              display: "flex",
              width: 220,
              height: 8,
              borderRadius: 999,
              marginTop: 28,
              marginBottom: 26,
              background: "linear-gradient(90deg, #FF9EC4 0%, #A98FEE 100%)",
            }}
          />

          <div style={{ fontSize: 30, color: INK_SOFT, lineHeight: 1.5 }}>
            {FEATURES}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Mali", data: font, weight: 600, style: "normal" }],
    },
  );
}
