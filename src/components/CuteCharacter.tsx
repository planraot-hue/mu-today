import type { OutfitIdea } from "@/lib/lucky-color";

type Props = {
  /** สีเสื้อผ้าหลัก — ใช้สีมงคลประจำวัน */
  mainColor: string;
  /** สีรอง ใช้กับกระโปรง/กางเกงและรองเท้า */
  accentColor: string;
  /** ทรงชุดตามไอเดียการแต่งตัวของวันนั้น */
  style: OutfitIdea["style"];
  className?: string;
};

const SKIN = "#FFE0CC";
const SKIN_SHADE = "#F5C9AE";
const HAIR = "#5C4A5E";
const INK = "#4A3B52";

/**
 * ตัวการ์ตูนวาดด้วย SVG ล้วน ไม่มีไฟล์รูป
 * เปลี่ยนสีเสื้อผ้าและทรงชุดได้ตามสีมงคลของแต่ละวัน
 */
export function CuteCharacter({
  mainColor,
  accentColor,
  style,
  className,
}: Props) {
  return (
    <svg
      viewBox="0 0 200 268"
      className={className}
      role="img"
      aria-label="ตัวการ์ตูนใส่ชุดสีมงคลประจำวัน"
    >
      {/* เงาใต้เท้า */}
      <ellipse cx="100" cy="252" rx="54" ry="9" fill={INK} opacity="0.08" />

      {/* ขา */}
      <rect x="83" y="196" width="13" height="42" rx="6.5" fill={SKIN} />
      <rect x="104" y="196" width="13" height="42" rx="6.5" fill={SKIN} />

      {/* รองเท้า */}
      <ellipse cx="89" cy="241" rx="12" ry="8" fill={accentColor} />
      <ellipse cx="111" cy="241" rx="12" ry="8" fill={accentColor} />

      {/* ชุด */}
      {style === "dress" && (
        <>
          <path
            d="M64 214 Q70 152 100 148 Q130 152 136 214 Z"
            fill={mainColor}
          />
          <path d="M78 172 H122 V180 H78 Z" fill={accentColor} opacity="0.55" />
        </>
      )}

      {style === "casual" && (
        <>
          {/* เสื้อยืด */}
          <path
            d="M72 152 Q100 142 128 152 L130 190 Q100 196 70 190 Z"
            fill={mainColor}
          />
          {/* กางเกง */}
          <path d="M72 188 H128 L124 216 H76 Z" fill={accentColor} />
        </>
      )}

      {style === "hoodie" && (
        <>
          {/* ตัวฮู้ดดี้ */}
          <rect x="66" y="148" width="68" height="62" rx="18" fill={mainColor} />
          {/* ฮู้ดด้านหลังคอ */}
          <path
            d="M74 152 Q100 138 126 152 Q100 162 74 152 Z"
            fill={mainColor}
            opacity="0.75"
          />
          {/* กระเป๋าหน้า */}
          <path
            d="M82 184 H118 V198 Q100 204 82 198 Z"
            fill={accentColor}
            opacity="0.6"
          />
          {/* เชือกฮู้ด */}
          <circle cx="94" cy="160" r="2.6" fill={accentColor} />
          <circle cx="106" cy="160" r="2.6" fill={accentColor} />
        </>
      )}

      {/* แขน */}
      <path
        d="M72 158 Q58 176 60 196"
        stroke={SKIN}
        strokeWidth="13"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M128 158 Q142 176 140 196"
        stroke={SKIN}
        strokeWidth="13"
        strokeLinecap="round"
        fill="none"
      />

      {/* คอ */}
      <rect x="92" y="128" width="16" height="18" rx="7" fill={SKIN_SHADE} />

      {/* ผมด้านหลัง */}
      <ellipse cx="100" cy="86" rx="54" ry="56" fill={HAIR} />

      {/* หน้า */}
      <circle cx="100" cy="84" r="45" fill={SKIN} />

      {/* หน้าม้า */}
      <path
        d="M56 78 A44 44 0 0 1 144 78 Q120 60 100 62 Q80 60 56 78 Z"
        fill={HAIR}
      />

      {/* ตา */}
      <ellipse cx="84" cy="88" rx="5.4" ry="6.4" fill={INK} />
      <ellipse cx="116" cy="88" rx="5.4" ry="6.4" fill={INK} />
      <circle cx="86" cy="85.5" r="1.9" fill="#FFFFFF" />
      <circle cx="118" cy="85.5" r="1.9" fill="#FFFFFF" />

      {/* แก้มแดง */}
      <ellipse cx="71" cy="99" rx="8.5" ry="5.4" fill="#FFAFC5" opacity="0.75" />
      <ellipse cx="129" cy="99" rx="8.5" ry="5.4" fill="#FFAFC5" opacity="0.75" />

      {/* ปาก */}
      <path
        d="M93 103 Q100 111 107 103"
        stroke={INK}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* โบว์ติดผม สีเดียวกับชุด */}
      <g transform="translate(139 52)">
        <path d="M0 0 L-15 -8 L-15 8 Z" fill={mainColor} />
        <path d="M0 0 L15 -8 L15 8 Z" fill={mainColor} />
        <circle cx="0" cy="0" r="4.5" fill={accentColor} />
      </g>

      {/* ประกายรอบตัว */}
      <g fill={accentColor}>
        <circle cx="34" cy="60" r="4" className="animate-twinkle" />
        <circle
          cx="168"
          cy="104"
          r="3.2"
          className="animate-twinkle"
          style={{ animationDelay: "0.7s" }}
        />
        <circle
          cx="40"
          cy="164"
          r="2.8"
          className="animate-twinkle"
          style={{ animationDelay: "1.3s" }}
        />
      </g>
    </svg>
  );
}
