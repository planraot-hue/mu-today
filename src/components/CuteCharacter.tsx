import type { OutfitIdea } from "@/lib/lucky-color";

type Props = {
  /** สีเสื้อผ้าหลัก — ใช้สีมงคลประจำวัน */
  mainColor: string;
  /** สีรอง ใช้กับกางเกง/กระเป๋าและของประกอบ */
  accentColor: string;
  /** ทรงชุดตามไอเดียการแต่งตัวของวันนั้น */
  style: OutfitIdea["style"];
  /** ปิดดาวรอบตัวสำหรับรูปขนาดเล็ก จะได้ไม่รก */
  showSparkles?: boolean;
  className?: string;
};

/** สีขอบสติกเกอร์ฟ้าอ่อนที่ล้อมรอบทั้งตัว */
const OUTLINE = "#A9C9E8";
const SKIN = "#F3DCC2";
const HAIR = "#4A3A31";
const HAIR_LINE = "#6E574A";
const BLUSH = "#E4867A";
const INK = "#2E2723";
const MOUTH = "#D65B55";
const COLLAR = "#FFFFFF";
const STAR = "#FFD34E";

/**
 * ตัวการ์ตูนวาดด้วย SVG ล้วน สไตล์สติกเกอร์แบนมีขอบฟ้า
 *
 * วิธีทำขอบ: วาดเงาร่างทั้งตัวด้วยสีฟ้าและเส้นหนาไว้ชั้นล่างสุดก่อน
 * แล้ววาดของจริงทับ ขอบที่โผล่ออกมารอบๆ จึงกลายเป็นเส้นล้อมแบบสติกเกอร์
 * เงาร่างกับตัวจริงใช้ path ชุดเดียวกัน (ตัวแปร silhouette) จะได้ไม่หลุดกัน
 *
 * เหตุผลที่ยังเป็น SVG ไม่ใช่ไฟล์รูป: สีเสื้อผ้าต้องเปลี่ยนตามสีมงคล
 * ที่คำนวณจากทักษาปกรณ์ในแต่ละวัน ถ้าใช้ไฟล์รูปจะต้องมี 7 วัน x 3 ลุค = 21 รูป
 */
export function CuteCharacter({
  mainColor,
  accentColor,
  style,
  className,
  showSparkles = true,
}: Props) {
  const styleLabel =
    style === "dress" ? "ลุคเดรส" : style === "casual" ? "ลุคลำลอง" : "ลุคสบายๆ";

  /** ผมยาวทรงเดียวกันทุกลุค เป็นเอกลักษณ์ของตัวละคร */
  const hairPath =
    "M100 18 C58 18 46 56 46 96 C46 142 40 180 36 212 C34 226 54 230 60 214 C66 186 68 158 70 138 L130 138 C132 158 134 186 140 214 C146 230 166 226 164 212 C160 180 154 142 154 96 C154 56 142 18 100 18 Z";

  /** เสื้อผ้าท่อนบน ต่างกันตามลุค */
  const topPath =
    style === "dress"
      ? "M74 150 Q100 141 126 150 L124 192 L146 254 Q100 268 54 254 L76 192 Z"
      : "M70 150 Q100 140 130 150 L134 220 Q100 230 66 220 Z";

  /** แขนเสื้อทั้งสองข้าง */
  const sleevePath =
    style === "hoodie"
      ? "M70 150 L56 214 Q66 220 74 214 L78 156 Z M130 150 L144 214 Q134 220 126 214 L122 156 Z"
      : "M72 150 L60 208 Q70 214 78 208 L80 156 Z M128 150 L140 208 Q130 214 122 208 L120 156 Z";

  /** ขาและเท้า */
  const legsPath =
    style === "dress"
      ? "M82 250 H94 V276 Q88 282 80 276 Z M106 250 H118 V276 Q112 282 104 276 Z"
      : "M78 214 H97 L95 272 Q86 278 79 272 Z M103 214 H122 L121 272 Q114 278 105 272 Z";

  /** รูปทรงรวมที่ใช้ทำขอบสติกเกอร์ */
  const silhouette = (
    <>
      <path d={hairPath} />
      <path d={topPath} />
      <path d={sleevePath} />
      <path d={legsPath} />
      <ellipse cx="100" cy="92" rx="40" ry="48" />
    </>
  );

  return (
    <svg
      viewBox="0 0 200 300"
      className={className}
      role="img"
      aria-label={`ตัวอย่างการแต่งตัว${styleLabel}ด้วยสีมงคลประจำวัน`}
    >
      {/* ---------- ขอบสติกเกอร์ ---------- */}
      <g
        fill={OUTLINE}
        stroke={OUTLINE}
        strokeWidth="11"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {silhouette}
      </g>

      {/* ---------- ผมด้านหลัง ---------- */}
      <path d={hairPath} fill={HAIR} />

      {/* ---------- ขาและเท้า ---------- */}
      <path d={legsPath} fill={style === "dress" ? SKIN : accentColor} />
      {style !== "dress" && (
        <>
          {/* ปลายกางเกงแล้วมีเท้าโผล่ */}
          <ellipse cx="87" cy="276" rx="11" ry="7" fill={SKIN} />
          <ellipse cx="113" cy="276" rx="11" ry="7" fill={SKIN} />
        </>
      )}

      {/* ---------- คอ ---------- */}
      <rect x="91" y="126" width="18" height="28" rx="8" fill={SKIN} />

      {/* ---------- เสื้อผ้า ---------- */}
      <path d={topPath} fill={mainColor} />
      <path d={sleevePath} fill={mainColor} />

      {/* มือโผล่ปลายแขน */}
      <ellipse cx="69" cy="212" rx="7" ry="7.5" fill={SKIN} />
      <ellipse cx="131" cy="212" rx="7" ry="7.5" fill={SKIN} />

      {style === "dress" && (
        <>
          {/* ปกเชิ้ตขาว */}
          <path d="M89 148 L100 162 L92 166 L84 152 Z" fill={COLLAR} />
          <path d="M111 148 L100 162 L108 166 L116 152 Z" fill={COLLAR} />
          {/* ตะเข็บเอว */}
          <path d="M76 190 H124" stroke="#00000018" strokeWidth="3" />
          {/* ชายกระโปรง */}
          <path d="M54 254 Q100 268 146 254" stroke="#00000015" strokeWidth="2.5" fill="none" />
        </>
      )}

      {style === "casual" && (
        <>
          {/* ปกเชิ้ตขาว */}
          <path d="M89 148 L100 162 L92 166 L84 152 Z" fill={COLLAR} />
          <path d="M111 148 L100 162 L108 166 L116 152 Z" fill={COLLAR} />
          {/* ชายเสื้อ */}
          <path d="M66 220 Q100 230 134 220" stroke="#00000015" strokeWidth="2.5" fill="none" />
          {/* ขอบเอวกางเกง */}
          <path d="M78 218 H122" stroke="#00000018" strokeWidth="3" />
        </>
      )}

      {style === "hoodie" && (
        <>
          {/* ฮู้ดพับหลังคอ */}
          <path d="M80 150 Q100 130 120 150 Q100 160 80 150 Z" fill={mainColor} />
          <path d="M84 149 Q100 136 116 149" stroke="#00000018" strokeWidth="2" fill="none" />
          {/* เชือกฮู้ด */}
          <path d="M93 158 V176" stroke={COLLAR} strokeWidth="3" strokeLinecap="round" />
          <path d="M107 158 V176" stroke={COLLAR} strokeWidth="3" strokeLinecap="round" />
          {/* กระเป๋าจิงโจ้ */}
          <path d="M80 186 H120 V206 Q100 212 80 206 Z" fill="#00000012" />
          {/* ชายเสื้อ */}
          <path d="M66 220 Q100 230 134 220" stroke="#00000015" strokeWidth="2.5" fill="none" />
        </>
      )}

      {/* ---------- กระเป๋าสะพายเฉียง ---------- */}
      <path
        d="M92 158 L128 208"
        stroke={accentColor}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M60 206 Q68 196 76 206" stroke={accentColor} strokeWidth="3" fill="none" />
      <path d="M76 206 L92 158" stroke={accentColor} strokeWidth="4" strokeLinecap="round" />
      <rect x="57" y="204" width="22" height="18" rx="5" fill={accentColor} />
      <path d="M57 210 H79" stroke="#00000018" strokeWidth="2" />

      {/* ---------- ใบหน้า ---------- */}
      <ellipse cx="100" cy="92" rx="40" ry="48" fill={SKIN} />

      {/* แก้มแดงวงกลมใหญ่ */}
      <circle cx="70" cy="104" r="13" fill={BLUSH} opacity="0.62" />
      <circle cx="130" cy="104" r="13" fill={BLUSH} opacity="0.62" />

      {/* คิ้ว */}
      <path d="M74 74 L88 71" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <path d="M126 74 L112 71" stroke={INK} strokeWidth="3" strokeLinecap="round" />

      {/* ตา */}
      <ellipse cx="82" cy="90" rx="4.2" ry="6" fill={INK} />
      <ellipse cx="118" cy="90" rx="4.2" ry="6" fill={INK} />
      <circle cx="83.4" cy="87.6" r="1.5" fill="#FFFFFF" />
      <circle cx="119.4" cy="87.6" r="1.5" fill="#FFFFFF" />

      {/* จมูก */}
      <circle cx="100" cy="99" r="2.2" fill="#DCBFA3" />

      {/* ปากยิ้มเปิดเล็กๆ ถ้าทำใหญ่กว่านี้จะดูเป็นรูโหว่แทนที่จะน่ารัก */}
      <path d="M94.5 107 Q100 116.5 105.5 107 Q100 110.5 94.5 107 Z" fill={MOUTH} />

      {/* ---------- ผมด้านหน้า ---------- */}
      {/* แสกกลาง ปิดหน้าผากทั้งสองข้าง */}
      <path
        d="M100 18 C74 18 60 40 58 74 C57 88 60 96 62 100 C62 76 66 56 78 46 C86 56 94 58 100 58 Z"
        fill={HAIR}
      />
      <path
        d="M100 18 C126 18 140 40 142 74 C143 88 140 96 138 100 C138 76 134 56 122 46 C114 56 106 58 100 58 Z"
        fill={HAIR}
      />

      {/* เส้นเส้นผม */}
      <g stroke={HAIR_LINE} strokeWidth="1.4" fill="none" opacity="0.55">
        <path d="M64 76 C60 120 54 170 50 212" />
        <path d="M74 66 C68 112 62 168 58 210" />
        <path d="M136 76 C140 120 146 170 150 212" />
        <path d="M126 66 C132 112 138 168 142 210" />
        <path d="M100 20 V56" />
        <path d="M86 30 C80 44 76 52 74 60" />
        <path d="M114 30 C120 44 124 52 126 60" />
      </g>

      {/* ---------- ดาว ---------- */}
      {showSparkles && (
        <g>
          <path
            d="M168 30 L173 44 L187 49 L173 54 L168 68 L163 54 L149 49 L163 44 Z"
            fill={STAR}
            stroke={OUTLINE}
            strokeWidth="3.5"
            strokeLinejoin="round"
            className="animate-twinkle"
          />
          <path
            d="M188 18 L191 26 L199 29 L191 32 L188 40 L185 32 L177 29 L185 26 Z"
            fill={STAR}
            stroke={OUTLINE}
            strokeWidth="3"
            strokeLinejoin="round"
            className="animate-twinkle"
            style={{ animationDelay: "0.8s" }}
          />
        </g>
      )}
    </svg>
  );
}
