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

export type IconStyle = "crystal" | "ball" | "moon" | "star";

/**
 * เปลี่ยนไอคอนทั้งเว็บได้ที่บรรทัดนี้บรรทัดเดียว
 *
 * crystal = ลูกแก้วมีจันทร์เสี้ยวข้างใน ตั้งบนฐาน มีประกายรอบตัว
 * ball    = ลูกแก้วเรียบๆ ไล่สีชมพู-ม่วง
 * moon    = จันทร์เสี้ยวบนพื้นม่วงเข้ม
 * star    = ประกายดาวบนพื้นทอง-ชมพู
 */
export const ICON_STYLE: IconStyle = "crystal";

const fill: CSSProperties = {
  display: "flex",
  width: "100%",
  height: "100%",
  position: "relative",
};

/* ------------------------------------------------------------------ */
/* ลูกแก้วมีจันทร์เสี้ยว                                                */
/* ------------------------------------------------------------------ */

const CREAM = "#FFF6F0";
/**
 * ตัวลูกแก้วเป็นสีทึบ ไม่ใช่ไล่สี เพราะต้องเอาวงกลมสีเดียวกันไปทับ
 * วงกลมขาวให้เว้าเป็นจันทร์เสี้ยว ถ้าพื้นเป็นไล่สี รอยต่อจะไม่เนียน
 * ความเป็นแก้วได้จากแถบไฮไลต์ที่วาดทับแทน
 */
const GLASS = "#BA8DE0";
const NAVY = "#2E3566";
const GOLD = "#F3C64B";

/** ลูกแก้วกับจันทร์เสี้ยว ส่วนที่ต้องอยู่ครบทุกขนาด */
function CrystalCore({ compact }: { compact: boolean }) {
  // ขนาดเล็กให้ลูกแก้วเต็มกรอบกว่า จะได้ยังอ่านออกตอนย่อเหลือ 16px
  const ball = compact
    ? { left: "8%", top: "8%", size: "84%" }
    : { left: "12%", top: "9%", size: "76%" };

  const disc = compact
    ? { left: "25%", top: "23%", size: "44%" }
    : { left: "30%", top: "26%", size: "36%" };

  const bite = compact
    ? { left: "40%", top: "17%", size: "40%" }
    : { left: "40%", top: "22%", size: "34%" };

  return (
    <>
      {/* ลูกแก้ว */}
      <div
        style={{
          position: "absolute",
          left: ball.left,
          top: ball.top,
          width: ball.size,
          height: ball.size,
          borderRadius: "50%",
          background: GLASS,
        }}
      />

      {/* แถบไฮไลต์ให้ดูเป็นแก้ว */}
      <div
        style={{
          position: "absolute",
          left: compact ? "18%" : "20%",
          top: compact ? "20%" : "20%",
          width: compact ? "18%" : "20%",
          height: compact ? "30%" : "32%",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.34)",
          transform: "rotate(-30deg)",
        }}
      />

      {/* จันทร์เสี้ยว: วงกลมขาวแล้วเอาวงกลมสีลูกแก้วทับให้เว้า */}
      <div
        style={{
          position: "absolute",
          left: disc.left,
          top: disc.top,
          width: disc.size,
          height: disc.size,
          borderRadius: "50%",
          background: "#FFFFFF",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: bite.left,
          top: bite.top,
          width: bite.size,
          height: bite.size,
          borderRadius: "50%",
          background: GLASS,
        }}
      />
    </>
  );
}

/** จุดดาวในลูกแก้ว วาดหลังจันทร์เสี้ยวเพื่อไม่ให้โดนวงกลมทับหาย */
function CrystalStars() {
  const dots = [
    { left: "24%", top: "56%" },
    { left: "64%", top: "30%" },
    { left: "57%", top: "66%" },
    { left: "34%", top: "21%" },
  ];

  return (
    <>
      {dots.map((dot) => (
        <div
          key={`${dot.left}-${dot.top}`}
          style={{
            position: "absolute",
            left: dot.left,
            top: dot.top,
            width: "3.4%",
            height: "3.4%",
            borderRadius: "50%",
            background: "#FFFFFF",
          }}
        />
      ))}
    </>
  );
}

function CrystalIcon({ detail }: { detail: boolean }) {
  if (!detail) {
    return (
      <div style={{ ...fill, background: CREAM }}>
        <CrystalCore compact />
      </div>
    );
  }

  return (
    <div style={{ ...fill, background: CREAM }}>
      <CrystalCore compact={false} />
      <CrystalStars />

      {/* ฐานตั้งลูกแก้ว วาดทับส่วนล่างของลูกแก้วให้ดูเหมือนวางอยู่บนฐาน */}
      <div
        style={{
          position: "absolute",
          left: "25%",
          top: "78%",
          width: "50%",
          height: "16%",
          borderRadius: "999px",
          background: NAVY,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "33%",
          top: "88%",
          width: "20%",
          height: "2.6%",
          borderRadius: "999px",
          background: "rgba(255,255,255,0.28)",
        }}
      />

      {/* ประกายสี่แฉกสองดวง */}
      <div
        style={{
          position: "absolute",
          left: "4%",
          top: "13%",
          width: "13%",
          height: "13%",
          borderRadius: "18%",
          background: "#F2612C",
          transform: "rotate(45deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "4%",
          bottom: "21%",
          width: "11%",
          height: "11%",
          borderRadius: "18%",
          background: "#F0367A",
          transform: "rotate(45deg)",
        }}
      />

      {/* ขีดสีทองรอบลูกแก้ว */}
      <div
        style={{
          position: "absolute",
          left: "18%",
          top: "3%",
          width: "3%",
          height: "12%",
          borderRadius: "999px",
          background: GOLD,
          transform: "rotate(20deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "7%",
          top: "31%",
          width: "3%",
          height: "11%",
          borderRadius: "999px",
          background: GOLD,
          transform: "rotate(-38deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "5%",
          bottom: "24%",
          width: "3%",
          height: "11%",
          borderRadius: "999px",
          background: GOLD,
          transform: "rotate(38deg)",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ลายสำรองที่เคยเสนอไว้                                                */
/* ------------------------------------------------------------------ */

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

function MoonIcon() {
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

/**
 * @param detail ใส่ false สำหรับไอคอนขนาดเล็ก (favicon 32px ลงมา)
 *               จะตัดฐาน ดาว และประกายรอบตัวออก เหลือแต่ลูกแก้วกับจันทร์เสี้ยว
 *               เพราะรายละเอียดพวกนั้นกลายเป็นจุดมั่วตอนย่อ
 */
export function AppIconArt({ detail = true }: { detail?: boolean }) {
  if (ICON_STYLE === "crystal") return <CrystalIcon detail={detail} />;
  if (ICON_STYLE === "ball") return <BallIcon />;
  if (ICON_STYLE === "star") return <StarIcon />;
  return <MoonIcon />;
}
