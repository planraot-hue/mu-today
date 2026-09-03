import type { CSSProperties } from "react";

/**
 * ลายไอคอนแอป ใช้ร่วมกันทุกขนาด (favicon, apple-icon, 192, 512)
 *
 * วาดด้วย div ล้วน ไม่ใช้ตัวอักษรหรืออีโมจิ เพราะ ImageResponse เรนเดอร์ด้วย satori
 * ซึ่งต้องโหลดฟอนต์เองถ้ามีตัวอักษร ถ้าไม่มีฟอนต์ภาษาไทยจะกลายเป็นสี่เหลี่ยมว่าง
 *
 * ทุกลายวางองค์ประกอบไว้กลางภาพในรัศมีปลอดภัย 80%
 * จึงใช้เป็นไอคอน maskable ของ Android ได้โดยไม่โดนตัดลายทิ้ง
 */

export type IconStyle = "ball" | "moon" | "star";

/**
 * เปลี่ยนไอคอนทั้งเว็บได้ที่บรรทัดนี้บรรทัดเดียว
 *
 * ball = ลูกแก้วพยากรณ์ ตรงกับคู่สีชมพู-ม่วงที่ใช้ทั่วเว็บที่สุด
 * moon = จันทร์เสี้ยว อ่านออกชัดที่สุดตอนย่อเหลือ 16px
 * star = ประกายดาว โทนทองสื่อโชคลาภ สดใสที่สุด
 */
export const ICON_STYLE: IconStyle = "moon";

/** ทุกชิ้นวางแบบ absolute ทับกัน ค่าเป็นเปอร์เซ็นต์จึงขยายตามขนาดภาพเอง */
const fill: CSSProperties = {
  display: "flex",
  width: "100%",
  height: "100%",
  position: "relative",
};

/** ลูกแก้วพยากรณ์ */
function BallIcon() {
  return (
    <div
      style={{
        ...fill,
        background: "linear-gradient(135deg, #FF9EC4 0%, #A98FEE 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "19%",
          top: "19%",
          width: "62%",
          height: "62%",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.94)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "27%",
          top: "27%",
          width: "46%",
          height: "46%",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #A98FEE 0%, #6FB3E8 100%)",
        }}
      />
      {/* จุดสะท้อนแสงให้ดูเป็นแก้ว */}
      <div
        style={{
          position: "absolute",
          left: "27%",
          top: "25%",
          width: "13%",
          height: "13%",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.9)",
        }}
      />
    </div>
  );
}

/** จันทร์เสี้ยวกับดาว */
function MoonIcon() {
  // พื้นเป็นสีทึบ ไม่ใช่ไล่สี เพราะต้องเอาสีเดียวกันไปทับวงกลมให้เว้าเป็นเสี้ยว
  const bg = "#6B5BD6";

  return (
    <div style={{ ...fill, background: bg }}>
      <div
        style={{
          position: "absolute",
          left: "17%",
          top: "20%",
          width: "60%",
          height: "60%",
          borderRadius: "50%",
          background: "#FFF0C4",
        }}
      />
      {/* วงกลมสีพื้นทับให้เว้าเข้าไปกลายเป็นเสี้ยว */}
      <div
        style={{
          position: "absolute",
          left: "34%",
          top: "13%",
          width: "60%",
          height: "60%",
          borderRadius: "50%",
          background: bg,
        }}
      />
      {/* ดาวดวงเล็ก */}
      <div
        style={{
          position: "absolute",
          right: "13%",
          bottom: "17%",
          width: "15%",
          height: "15%",
          borderRadius: "22%",
          background: "#FFD98A",
          transform: "rotate(45deg)",
        }}
      />
    </div>
  );
}

/** ประกายดาวสี่แฉก */
function StarIcon() {
  return (
    <div
      style={{
        ...fill,
        background: "linear-gradient(135deg, #FFD98A 0%, #FF8FB1 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "22%",
          top: "22%",
          width: "46%",
          height: "46%",
          borderRadius: "16%",
          background: "#FFFFFF",
          transform: "rotate(45deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "13%",
          top: "13%",
          width: "19%",
          height: "19%",
          borderRadius: "20%",
          background: "rgba(255,255,255,0.92)",
          transform: "rotate(45deg)",
        }}
      />
    </div>
  );
}

export function AppIconArt() {
  if (ICON_STYLE === "ball") return <BallIcon />;
  if (ICON_STYLE === "star") return <StarIcon />;
  return <MoonIcon />;
}
