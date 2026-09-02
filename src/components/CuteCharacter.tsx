import type { OutfitIdea } from "@/lib/lucky-color";

type Props = {
  /** สีเสื้อผ้าหลัก — ใช้สีมงคลประจำวัน */
  mainColor: string;
  /** สีรอง ใช้กับกระโปรง/กางเกงและของประกอบ */
  accentColor: string;
  /** ทรงชุดตามไอเดียการแต่งตัวของวันนั้น */
  style: OutfitIdea["style"];
  /** ปิดประกายรอบตัวสำหรับรูปขนาดเล็ก จะได้ไม่รก */
  showSparkles?: boolean;
  className?: string;
};

const SKIN = "#F6D8C3";
const SKIN_SHADE = "#E4BCA4";
const HAIR = "#4A3A46";
const HAIR_SHINE = "#6B5566";
const INK = "#4A3B52";
const LINE = "#00000022";
const SHOE = "#FFFFFF";
const SOLE = "#DED8E6";
const DENIM_SEAM = "#FFFFFF66";

/**
 * ตัวการ์ตูนวาดด้วย SVG ล้วน ไม่มีไฟล์รูป
 *
 * สัดส่วนราว 5.7 หัว (ใกล้เคียงภาพวาดแฟชั่น) แทนสัดส่วนหัวโตแบบชิบิ
 * เพื่อให้เห็นทรงเสื้อผ้าชัดพอที่จะแต่งตามได้จริง
 * เสื้อผ้าแต่ละทรงวาดรายละเอียดที่ใช้แยกแบบ เช่น ตะเข็บเอว ชายแขน
 * กระเป๋าหน้า และพื้นรองเท้า
 */
export function CuteCharacter({
  mainColor,
  accentColor,
  style,
  className,
  showSparkles = true,
}: Props) {
  return (
    <svg
      viewBox="0 0 200 400"
      className={className}
      role="img"
      aria-label={`ตัวอย่างการแต่งตัว${
        style === "dress" ? "ลุคเดรส" : style === "casual" ? "ลุคลำลอง" : "ลุคสบายๆ"
      }ด้วยสีมงคลประจำวัน`}
    >
      {/* เงาใต้เท้า */}
      <ellipse cx="100" cy="391" rx="44" ry="7" fill={INK} opacity="0.09" />

      {/* ---------- ผมด้านหลัง ---------- */}
      <path
        d="M64 54 Q64 14 100 14 Q136 14 136 54 L139 146 Q139 158 127 155 Q133 112 129 76 L71 76 Q67 112 73 155 Q61 158 61 146 Z"
        fill={HAIR}
      />

      {/* ---------- ขา ---------- */}
      <path d="M85 196 H99 L97 300 L95 372 H84 L84 300 Z" fill={SKIN} />
      <path d="M101 196 H115 L116 300 L116 372 H105 L103 300 Z" fill={SKIN} />
      {/* เงาด้านในขา ให้ดูมีมิติ */}
      <path d="M99 240 L97 372 H95 L97 240 Z" fill={SKIN_SHADE} opacity="0.7" />

      {/* ---------- ลำตัว (ผิว) ---------- */}
      <path
        d="M70 106 Q100 98 130 106 L127 168 Q126 186 122 202 L78 202 Q74 186 73 168 Z"
        fill={SKIN}
      />

      {/* ---------- คอ ---------- */}
      <path d="M91 74 H109 V96 Q100 104 91 96 Z" fill={SKIN_SHADE} />

      {/* ================= ชุด ================= */}

      {style === "dress" && (
        <>
          {/* กระโปรงทรงเอ บานจากเอวถึงเข่า */}
          <path
            d="M76 166 H124 L146 268 Q100 280 54 268 Z"
            fill={mainColor}
          />
          {/* ชายกระโปรง */}
          <path d="M54 268 Q100 280 146 268 L146 273 Q100 285 54 273 Z" fill={LINE} />

          {/* ท่อนบนเข้ารูป */}
          <path
            d="M70 106 Q100 99 130 106 L128 150 Q127 160 126 168 H74 Q73 160 72 150 Z"
            fill={mainColor}
          />

          {/* คอกลม เปิดให้เห็นผิว */}
          <path d="M86 102 Q100 116 114 102 Q100 108 86 102 Z" fill={SKIN} />

          {/* แขนตุ๊กตา */}
          <path d="M70 106 Q60 116 61 134 L77 130 Q75 116 79 104 Z" fill={mainColor} />
          <path d="M130 106 Q140 116 139 134 L123 130 Q125 116 121 104 Z" fill={mainColor} />

          {/* เข็มขัดคาดเอว */}
          <rect x="72" y="160" width="56" height="9" rx="4.5" fill={accentColor} />
          <circle cx="100" cy="164.5" r="3" fill="#FFFFFF" opacity="0.85" />

          {/* กระเป๋าถือสะพายแขน */}
          <path
            d="M139 200 Q146 186 152 200"
            stroke={accentColor}
            strokeWidth="2.5"
            fill="none"
          />
          <rect x="136" y="198" width="20" height="16" rx="4" fill={accentColor} />

          {/* รองเท้าส้นเตี้ย */}
          <path d="M82 370 H97 L98 382 H80 Z" fill={accentColor} />
          <path d="M103 370 H118 L120 382 H102 Z" fill={accentColor} />
        </>
      )}

      {style === "casual" && (
        <>
          {/* กางเกงยีนส์เอวสูง ขาตรง */}
          <path d="M74 186 H126 L124 250 L120 372 H104 L100 250 L96 372 H80 L76 250 Z" fill={accentColor} />
          {/* ขอบเอว */}
          <rect x="74" y="184" width="52" height="11" rx="3" fill={accentColor} />
          <path d="M74 195 H126" stroke={DENIM_SEAM} strokeWidth="1.5" />
          {/* ตะเข็บกลางและกระเป๋าหน้า */}
          <path d="M100 195 V250" stroke={DENIM_SEAM} strokeWidth="1.5" />
          <path d="M80 198 Q88 210 96 200" stroke={DENIM_SEAM} strokeWidth="1.5" fill="none" />
          <path d="M120 198 Q112 210 104 200" stroke={DENIM_SEAM} strokeWidth="1.5" fill="none" />

          {/* เสื้อยืดทรงกล่อง ชายคลุมสะโพก */}
          <path
            d="M68 108 Q100 99 132 108 L134 182 Q100 190 66 182 Z"
            fill={mainColor}
          />
          {/* คอกลม */}
          <path d="M87 103 Q100 117 113 103 Q100 109 87 103 Z" fill={SKIN} />
          <path d="M87 103 Q100 117 113 103" stroke={LINE} strokeWidth="2" fill="none" />

          {/* แขนสั้น มีชายแขนให้เห็นทรง */}
          <path d="M68 108 L57 144 L75 150 L79 106 Z" fill={mainColor} />
          <path d="M132 108 L143 144 L125 150 L121 106 Z" fill={mainColor} />
          <path d="M57 144 L75 150" stroke={LINE} strokeWidth="2.5" />
          <path d="M143 144 L125 150" stroke={LINE} strokeWidth="2.5" />

          {/* ชายเสื้อ */}
          <path d="M66 182 Q100 190 134 182 L134 186 Q100 194 66 186 Z" fill={LINE} />

          {/* รองเท้าผ้าใบ */}
          <path d="M79 366 H97 V378 H76 Q74 370 79 366 Z" fill={SHOE} stroke={SOLE} strokeWidth="1.5" />
          <path d="M103 366 H121 Q126 370 124 378 H103 Z" fill={SHOE} stroke={SOLE} strokeWidth="1.5" />
          <path d="M76 378 H97 V382 H76 Z" fill={SOLE} />
          <path d="M103 378 H124 V382 H103 Z" fill={SOLE} />
        </>
      )}

      {style === "hoodie" && (
        <>
          {/* กางเกงขากว้าง */}
          <path d="M72 196 H128 L128 250 L124 372 H105 L102 250 L98 372 H79 L74 250 Z" fill={accentColor} />
          <path d="M100 200 V250" stroke={LINE} strokeWidth="1.5" />

          {/* ตัวฮู้ดดี้ทรงโอเวอร์ไซส์ */}
          <path
            d="M62 116 Q100 106 138 116 L140 196 Q100 204 60 196 Z"
            fill={mainColor}
          />

          {/* ฮู้ดด้านหลังคอ */}
          <path d="M74 114 Q100 88 126 114 Q100 128 74 114 Z" fill={mainColor} />
          <path d="M78 113 Q100 96 122 113 Q100 122 78 113 Z" fill={LINE} />

          {/* เชือกฮู้ด */}
          <path d="M92 120 V142" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M108 120 V142" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="92" cy="144" r="2.6" fill={accentColor} />
          <circle cx="108" cy="144" r="2.6" fill={accentColor} />

          {/* กระเป๋าหน้าแบบจิงโจ้ */}
          <path d="M76 156 H124 V180 Q100 187 76 180 Z" fill={accentColor} opacity="0.75" />
          <path d="M76 156 H124" stroke={LINE} strokeWidth="2" />

          {/* แขนยาวและปลายแขนจีบ */}
          <path d="M62 116 L52 176 L70 180 L74 114 Z" fill={mainColor} />
          <path d="M138 116 L148 176 L130 180 L126 114 Z" fill={mainColor} />
          <rect x="51" y="176" width="20" height="9" rx="3" fill={mainColor} />
          <rect x="129" y="176" width="20" height="9" rx="3" fill={mainColor} />

          {/* ชายเสื้อจีบ */}
          <path d="M60 190 Q100 198 140 190 L140 198 Q100 206 60 198 Z" fill={mainColor} />
          <path d="M60 194 Q100 202 140 194" stroke={LINE} strokeWidth="1.5" fill="none" />

          {/* รองเท้าผ้าใบพื้นหนา */}
          <path d="M76 362 H98 V376 H73 Q70 368 76 362 Z" fill={SHOE} stroke={SOLE} strokeWidth="1.5" />
          <path d="M102 362 H124 Q130 368 127 376 H102 Z" fill={SHOE} stroke={SOLE} strokeWidth="1.5" />
          <rect x="72" y="376" width="27" height="7" rx="3" fill={SOLE} />
          <rect x="101" y="376" width="27" height="7" rx="3" fill={SOLE} />
        </>
      )}

      {/* ---------- แขนและมือ (วาดทับชุด) ---------- */}
      {style === "dress" && (
        <>
          <path
            d="M69 132 C62 156, 60 178, 64 196"
            stroke={SKIN}
            strokeWidth="11"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M131 132 C138 156, 140 178, 136 196"
            stroke={SKIN}
            strokeWidth="11"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse cx="64" cy="200" rx="6.5" ry="7.5" fill={SKIN} />
          <ellipse cx="136" cy="200" rx="6.5" ry="7.5" fill={SKIN} />
        </>
      )}

      {style === "casual" && (
        <>
          <path
            d="M66 148 C60 166, 59 184, 63 198"
            stroke={SKIN}
            strokeWidth="11"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M134 148 C140 166, 141 184, 137 198"
            stroke={SKIN}
            strokeWidth="11"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse cx="63" cy="202" rx="6.5" ry="7.5" fill={SKIN} />
          <ellipse cx="137" cy="202" rx="6.5" ry="7.5" fill={SKIN} />
        </>
      )}

      {style === "hoodie" && (
        <>
          <ellipse cx="61" cy="190" rx="6.5" ry="7.5" fill={SKIN} />
          <ellipse cx="139" cy="190" rx="6.5" ry="7.5" fill={SKIN} />
        </>
      )}

      {/* ---------- หู ---------- */}
      <ellipse cx="70" cy="56" rx="5" ry="7.5" fill={SKIN} />
      <ellipse cx="130" cy="56" rx="5" ry="7.5" fill={SKIN} />

      {/* ---------- ใบหน้า ---------- */}
      <ellipse cx="100" cy="52" rx="31" ry="35" fill={SKIN} />

      {/* ผมหน้าม้าแสกข้าง */}
      <path
        d="M69 48 Q70 17 100 17 Q130 17 131 50 Q126 32 106 28 Q96 42 78 40 Q71 42 69 48 Z"
        fill={HAIR}
      />
      {/* ไฮไลต์ผม */}
      <path
        d="M84 24 Q94 20 104 23"
        stroke={HAIR_SHINE}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* คิ้ว */}
      <path d="M84 44 Q89 41 94 44" stroke={HAIR} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M106 44 Q111 41 116 44" stroke={HAIR} strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* ตา — ทรงอัลมอนด์พร้อมขนตา ให้ดูเป็นคนมากกว่าจุดกลม */}
      <path d="M83 54 Q89 48 95 54 Q89 59 83 54 Z" fill="#FFFFFF" />
      <path d="M105 54 Q111 48 117 54 Q111 59 105 54 Z" fill="#FFFFFF" />
      <circle cx="89" cy="53.5" r="3.4" fill={INK} />
      <circle cx="111" cy="53.5" r="3.4" fill={INK} />
      <circle cx="90.2" cy="52.2" r="1.2" fill="#FFFFFF" />
      <circle cx="112.2" cy="52.2" r="1.2" fill="#FFFFFF" />
      <path d="M83 53 Q89 47.5 95 53" stroke={INK} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M105 53 Q111 47.5 117 53" stroke={INK} strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* จมูก */}
      <path d="M100 58 Q102 62 99 63" stroke={SKIN_SHADE} strokeWidth="1.6" strokeLinecap="round" fill="none" />

      {/* แก้ม */}
      <ellipse cx="79" cy="63" rx="6" ry="3.6" fill="#FFA9BF" opacity="0.55" />
      <ellipse cx="121" cy="63" rx="6" ry="3.6" fill="#FFA9BF" opacity="0.55" />

      {/* ปาก */}
      <path d="M94 70 Q100 75 106 70" stroke={INK} strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* ---------- ประกายรอบตัว ---------- */}
      {showSparkles && (
        <g fill={accentColor}>
          <circle cx="32" cy="70" r="4" className="animate-twinkle" />
          <circle
            cx="170"
            cy="120"
            r="3.2"
            className="animate-twinkle"
            style={{ animationDelay: "0.7s" }}
          />
          <circle
            cx="36"
            cy="250"
            r="2.8"
            className="animate-twinkle"
            style={{ animationDelay: "1.3s" }}
          />
        </g>
      )}
    </svg>
  );
}
