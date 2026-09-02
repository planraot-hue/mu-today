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

const SKIN = "#FBE3D2";
const SKIN_SHADE = "#EFC4AC";
const HAIR = "#6B4433";
const HAIR_DARK = "#573528";
const HAIR_SHINE = "#9A6A4E";
const EYE_OUTER = "#6B4A32";
const EYE_INNER = "#B0784F";
const PUPIL = "#33221C";
const LASH = "#3C2A25";
const MOUTH = "#B4685F";
/** เส้นรอยพับผ้า ใช้ทับสีชุดได้ทุกสี */
const FOLD = "#00000018";
const SHOE = "#FFFFFF";
const SOLE = "#DED8E6";

/**
 * ตัวการ์ตูนวาดด้วย SVG ล้วน ไม่มีไฟล์รูป
 *
 * สไตล์อนิเมะ: สัดส่วนราว 6.4 หัว ตาโตหลายชั้นพร้อมไฮไลต์ ผมยาวแยกช่อ
 * และเสื้อผ้ามีเส้นรอยพับ
 *
 * เหตุผลที่ยังเป็น SVG ไม่ใช่ไฟล์รูป: สีเสื้อผ้าต้องเปลี่ยนตามสีมงคล
 * ที่คำนวณจากทักษาปกรณ์ในแต่ละวัน ถ้าใช้ไฟล์รูปจะต้องมี 7 วัน x 3 ลุค = 21 รูป
 * และสีจะไม่ผูกกับผลคำนวณอีกต่อไป
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

  return (
    <svg
      viewBox="0 0 200 420"
      className={className}
      role="img"
      aria-label={`ตัวอย่างการแต่งตัว${styleLabel}ด้วยสีมงคลประจำวัน`}
    >
      {/* เงาใต้เท้า */}
      <ellipse cx="100" cy="409" rx="42" ry="6.5" fill={LASH} opacity="0.1" />

      {/* ---------- ผมด้านหลัง ---------- */}
      <path
        d="M60 72 Q56 18 100 18 Q144 18 140 72 L149 214 Q147 246 134 256 Q141 184 134 112 L66 112 Q59 184 66 256 Q53 246 51 214 Z"
        fill={HAIR}
      />
      {/* เงาผมด้านใน */}
      <path
        d="M66 112 Q59 184 66 256 Q60 246 57 214 L62 130 Z"
        fill={HAIR_DARK}
        opacity="0.5"
      />

      {/* ---------- ขา ---------- */}
      <path d="M86 198 H99 L98 300 L96 388 H86 L85 300 Z" fill={SKIN} />
      <path d="M101 198 H114 L115 300 L114 388 H104 L102 300 Z" fill={SKIN} />
      <path d="M98 250 L96 388 H94 L96 250 Z" fill={SKIN_SHADE} opacity="0.6" />

      {/* ---------- ลำตัว ---------- */}
      <path
        d="M72 108 Q100 100 128 108 L125 166 Q124 184 120 200 L80 200 Q76 184 75 166 Z"
        fill={SKIN}
      />

      {/* ---------- คอและเงาใต้คาง ---------- */}
      <path d="M91 78 H109 V100 Q100 108 91 100 Z" fill={SKIN} />
      <path d="M87 84 Q100 96 113 84 L113 96 H87 Z" fill={SKIN_SHADE} opacity="0.75" />

      {/* กระดูกไหปลาร้า ให้ดูเป็นคน */}
      <path
        d="M86 112 Q94 116 99 114"
        stroke={SKIN_SHADE}
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M114 112 Q106 116 101 114"
        stroke={SKIN_SHADE}
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />

      {/* ================= ชุด ================= */}

      {style === "dress" && (
        <>
          {/* กระโปรงบาน */}
          <path d="M78 168 H122 L141 272 Q100 284 59 272 Z" fill={mainColor} />
          {/* ระบายชายกระโปรง */}
          <path d="M59 272 Q100 284 141 272 L145 292 Q100 306 55 292 Z" fill={mainColor} />
          <path d="M59 272 Q100 284 141 272" stroke={FOLD} strokeWidth="1.8" fill="none" />
          <path d="M55 292 Q100 306 145 292" stroke={FOLD} strokeWidth="1.4" fill="none" />

          {/* รอยจีบกระโปรง */}
          <path d="M91 176 L82 274" stroke={FOLD} strokeWidth="1.4" />
          <path d="M100 176 L100 278" stroke={FOLD} strokeWidth="1.2" />
          <path d="M109 176 L118 274" stroke={FOLD} strokeWidth="1.4" />

          {/* ท่อนบนเข้ารูป คอตรงแบบเดรสสายเดี่ยว */}
          <path d="M78 118 Q100 113 122 118 L124 168 H76 Z" fill={mainColor} />
          <path d="M84 130 L82 162" stroke={FOLD} strokeWidth="1.2" />
          <path d="M116 130 L118 162" stroke={FOLD} strokeWidth="1.2" />

          {/* สายเดี่ยว */}
          <path d="M86 118 L83 106" stroke={mainColor} strokeWidth="4.5" strokeLinecap="round" />
          <path d="M114 118 L117 106" stroke={mainColor} strokeWidth="4.5" strokeLinecap="round" />

          {/* ตะเข็บเอว */}
          <rect x="76" y="163" width="48" height="7" rx="3.5" fill={accentColor} />

          {/* ลายจุดบนผ้า */}
          <g fill="#FFFFFF" opacity="0.45">
            <circle cx="90" cy="134" r="1.6" />
            <circle cx="106" cy="126" r="1.6" />
            <circle cx="112" cy="146" r="1.6" />
            <circle cx="88" cy="152" r="1.6" />
            <circle cx="78" cy="196" r="1.8" />
            <circle cx="98" cy="206" r="1.8" />
            <circle cx="120" cy="198" r="1.8" />
            <circle cx="88" cy="232" r="1.8" />
            <circle cx="112" cy="238" r="1.8" />
            <circle cx="100" cy="256" r="1.8" />
            <circle cx="72" cy="252" r="1.8" />
            <circle cx="128" cy="250" r="1.8" />
          </g>

          {/* กระเป๋าถือ */}
          <path d="M56 216 Q62 205 68 216" stroke={accentColor} strokeWidth="2.4" fill="none" />
          <rect x="53" y="214" width="18" height="16" rx="3.5" fill={accentColor} />
          <path d="M53 220 H71" stroke={FOLD} strokeWidth="1.4" />

          {/* รองเท้าส้นเตี้ย */}
          <path d="M84 386 H98 L99 398 H82 Z" fill={accentColor} />
          <path d="M102 386 H116 L118 398 H101 Z" fill={accentColor} />
        </>
      )}

      {style === "casual" && (
        <>
          {/* ยีนส์เอวสูงขาตรง */}
          <path d="M76 186 H124 L122 250 L118 388 H103 L100 250 L97 388 H82 L78 250 Z" fill={accentColor} />
          <rect x="76" y="184" width="48" height="11" rx="3" fill={accentColor} />
          <path d="M76 195 H124" stroke="#FFFFFF55" strokeWidth="1.5" />
          <path d="M100 196 V250" stroke="#FFFFFF55" strokeWidth="1.5" />
          <path d="M81 199 Q89 211 97 201" stroke="#FFFFFF55" strokeWidth="1.5" fill="none" />
          <path d="M119 199 Q111 211 103 201" stroke="#FFFFFF55" strokeWidth="1.5" fill="none" />
          {/* รอยยับที่เข่า */}
          <path d="M84 280 Q90 284 95 280" stroke={FOLD} strokeWidth="1.4" fill="none" />
          <path d="M105 280 Q110 284 116 280" stroke={FOLD} strokeWidth="1.4" fill="none" />

          {/* เสื้อยืดคอกลม */}
          <path d="M70 110 Q100 101 130 110 L132 184 Q100 192 68 184 Z" fill={mainColor} />
          <path d="M88 106 Q100 120 112 106 Q100 112 88 106 Z" fill={SKIN} />
          <path d="M88 106 Q100 120 112 106" stroke={FOLD} strokeWidth="2" fill="none" />
          {/* รอยพับเสื้อ */}
          <path d="M82 140 Q86 158 82 178" stroke={FOLD} strokeWidth="1.4" fill="none" />
          <path d="M118 140 Q114 158 118 178" stroke={FOLD} strokeWidth="1.4" fill="none" />

          {/* แขนสั้นพร้อมชายแขน */}
          <path d="M70 110 L59 148 L77 154 L81 108 Z" fill={mainColor} />
          <path d="M130 110 L141 148 L123 154 L119 108 Z" fill={mainColor} />
          <path d="M59 148 L77 154" stroke={FOLD} strokeWidth="2.6" />
          <path d="M141 148 L123 154" stroke={FOLD} strokeWidth="2.6" />

          {/* ชายเสื้อ */}
          <path d="M68 184 Q100 192 132 184 L132 188 Q100 196 68 188 Z" fill={FOLD} />

          {/* รองเท้าผ้าใบ */}
          <path d="M81 382 H97 V394 H78 Q76 386 81 382 Z" fill={SHOE} stroke={SOLE} strokeWidth="1.5" />
          <path d="M103 382 H119 Q124 386 122 394 H103 Z" fill={SHOE} stroke={SOLE} strokeWidth="1.5" />
          <path d="M78 394 H97 V398 H78 Z" fill={SOLE} />
          <path d="M103 394 H122 V398 H103 Z" fill={SOLE} />
        </>
      )}

      {style === "hoodie" && (
        <>
          {/* กางเกงขากว้าง */}
          <path d="M74 196 H126 L126 250 L122 388 H104 L101 250 L98 388 H80 L76 250 Z" fill={accentColor} />
          <path d="M100 202 V250" stroke={FOLD} strokeWidth="1.5" />
          <path d="M82 300 Q88 305 94 300" stroke={FOLD} strokeWidth="1.4" fill="none" />
          <path d="M106 300 Q112 305 118 300" stroke={FOLD} strokeWidth="1.4" fill="none" />

          {/* ตัวฮู้ดดี้โอเวอร์ไซส์ */}
          <path d="M64 118 Q100 108 136 118 L138 196 Q100 204 62 196 Z" fill={mainColor} />

          {/* ฮู้ดพับหลังคอ */}
          <path d="M76 116 Q100 90 124 116 Q100 130 76 116 Z" fill={mainColor} />
          <path d="M80 115 Q100 98 120 115 Q100 124 80 115 Z" fill={FOLD} />

          {/* เชือกฮู้ด */}
          <path d="M92 122 V146" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M108 122 V146" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" />
          <circle cx="92" cy="148" r="2.6" fill={accentColor} />
          <circle cx="108" cy="148" r="2.6" fill={accentColor} />

          {/* กระเป๋าจิงโจ้ */}
          <path d="M78 158 H122 V182 Q100 189 78 182 Z" fill={accentColor} opacity="0.7" />
          <path d="M78 158 H122" stroke={FOLD} strokeWidth="2" />

          {/* แขนยาวพร้อมปลายแขนจีบ */}
          <path d="M64 118 L54 178 L72 182 L76 116 Z" fill={mainColor} />
          <path d="M136 118 L146 178 L128 182 L124 116 Z" fill={mainColor} />
          <path d="M60 150 Q66 158 62 168" stroke={FOLD} strokeWidth="1.4" fill="none" />
          <path d="M140 150 Q134 158 138 168" stroke={FOLD} strokeWidth="1.4" fill="none" />
          <rect x="53" y="178" width="20" height="9" rx="3" fill={mainColor} />
          <rect x="127" y="178" width="20" height="9" rx="3" fill={mainColor} />

          {/* ชายเสื้อจีบ */}
          <path d="M62 190 Q100 198 138 190 L138 199 Q100 207 62 199 Z" fill={mainColor} />
          <path d="M62 194 Q100 202 138 194" stroke={FOLD} strokeWidth="1.5" fill="none" />

          {/* รองเท้าพื้นหนา */}
          <path d="M78 378 H98 V392 H75 Q72 384 78 378 Z" fill={SHOE} stroke={SOLE} strokeWidth="1.5" />
          <path d="M102 378 H122 Q128 384 125 392 H102 Z" fill={SHOE} stroke={SOLE} strokeWidth="1.5" />
          <rect x="74" y="392" width="25" height="7" rx="3" fill={SOLE} />
          <rect x="101" y="392" width="25" height="7" rx="3" fill={SOLE} />
        </>
      )}

      {/* ---------- แขนและมือ ---------- */}
      {style !== "hoodie" && (
        <>
          <path
            d={style === "dress" ? "M72 122 C64 152, 62 182, 66 208" : "M68 152 C62 172, 61 192, 65 210"}
            stroke={SKIN}
            strokeWidth="11"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={style === "dress" ? "M128 122 C136 152, 138 182, 134 208" : "M132 152 C138 172, 139 192, 135 210"}
            stroke={SKIN}
            strokeWidth="11"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse cx={style === "dress" ? 66 : 65} cy={style === "dress" ? 212 : 214} rx="6.5" ry="7.5" fill={SKIN} />
          <ellipse cx={style === "dress" ? 134 : 135} cy={style === "dress" ? 212 : 214} rx="6.5" ry="7.5" fill={SKIN} />
        </>
      )}

      {style === "hoodie" && (
        <>
          <ellipse cx="62" cy="192" rx="6.5" ry="7.5" fill={SKIN} />
          <ellipse cx="138" cy="192" rx="6.5" ry="7.5" fill={SKIN} />
        </>
      )}

      {/* ---------- ใบหน้า ---------- */}
      {/* ทรงหน้าปลายคางเรียวแบบอนิเมะ */}
      <path
        d="M70 50 Q70 20 100 20 Q130 20 130 50 Q130 72 120 84 Q110 94 100 94 Q90 94 80 84 Q70 72 70 50 Z"
        fill={SKIN}
      />
      {/* หู */}
      <ellipse cx="70" cy="58" rx="4.5" ry="7" fill={SKIN} />
      <ellipse cx="130" cy="58" rx="4.5" ry="7" fill={SKIN} />

      {/* ---------- ตา ---------- */}
      {/* ซ้าย */}
      <path d="M76 60 Q84 47 93 58 Q92 71 84 71 Q77 69 76 60 Z" fill="#FFFFFF" />
      <ellipse cx="85" cy="60" rx="6" ry="8" fill={EYE_OUTER} />
      <ellipse cx="85" cy="62" rx="4.4" ry="5.6" fill={EYE_INNER} />
      <ellipse cx="85" cy="60" rx="2.6" ry="3.6" fill={PUPIL} />
      <circle cx="87.4" cy="55.6" r="2.4" fill="#FFFFFF" />
      <circle cx="82" cy="65" r="1.2" fill="#FFFFFF" opacity="0.9" />
      <path d="M75 57 Q84 44 94 55" stroke={LASH} strokeWidth="3.2" strokeLinecap="round" fill="none" />
      <path d="M94 55 L98 50" stroke={LASH} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M77 44 Q85 39 94 43" stroke={HAIR_DARK} strokeWidth="2.2" strokeLinecap="round" fill="none" />

      {/* ขวา */}
      <path d="M124 60 Q116 47 107 58 Q108 71 116 71 Q123 69 124 60 Z" fill="#FFFFFF" />
      <ellipse cx="115" cy="60" rx="6" ry="8" fill={EYE_OUTER} />
      <ellipse cx="115" cy="62" rx="4.4" ry="5.6" fill={EYE_INNER} />
      <ellipse cx="115" cy="60" rx="2.6" ry="3.6" fill={PUPIL} />
      <circle cx="117.4" cy="55.6" r="2.4" fill="#FFFFFF" />
      <circle cx="112" cy="65" r="1.2" fill="#FFFFFF" opacity="0.9" />
      <path d="M125 57 Q116 44 106 55" stroke={LASH} strokeWidth="3.2" strokeLinecap="round" fill="none" />
      <path d="M106 55 L102 50" stroke={LASH} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M123 44 Q115 39 106 43" stroke={HAIR_DARK} strokeWidth="2.2" strokeLinecap="round" fill="none" />

      {/* จมูกและปาก */}
      <path d="M99 72 Q101.5 75 99 76.5" stroke={SKIN_SHADE} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M95 82 Q100 86.5 105 82" stroke={MOUTH} strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* แก้ม */}
      <ellipse cx="78" cy="72" rx="6.5" ry="3.6" fill="#FF9DB4" opacity="0.42" />
      <ellipse cx="122" cy="72" rx="6.5" ry="3.6" fill="#FF9DB4" opacity="0.42" />

      {/* ---------- ผมหน้าและช่อข้างแก้ม ---------- */}
      {/* หน้าม้าแสกกลางปลายแหลม */}
      <path
        d="M68 56 Q66 19 100 19 Q134 19 132 56 Q129 38 117 31 Q110 50 100 41 Q90 54 83 35 Q71 39 68 56 Z"
        fill={HAIR}
      />
      {/* ช่อผมข้างแก้มทิ้งลงหน้าไหล่ */}
      <path d="M69 46 Q62 96 66 158 Q68 190 63 214 Q56 168 57 112 Q58 70 69 46 Z" fill={HAIR} />
      <path d="M131 46 Q138 96 134 158 Q132 190 137 214 Q144 168 143 112 Q142 70 131 46 Z" fill={HAIR} />
      {/* ไฮไลต์ผม */}
      <path d="M78 34 Q100 24 122 34 Q100 30 78 34 Z" fill={HAIR_SHINE} opacity="0.8" />
      <path d="M64 96 Q61 140 64 180" stroke={HAIR_SHINE} strokeWidth="2.5" opacity="0.5" fill="none" />
      <path d="M136 96 Q139 140 136 180" stroke={HAIR_SHINE} strokeWidth="2.5" opacity="0.5" fill="none" />

      {/* ---------- ประกายรอบตัว ---------- */}
      {showSparkles && (
        <g fill={accentColor}>
          <circle cx="30" cy="76" r="4" className="animate-twinkle" />
          <circle
            cx="172"
            cy="126"
            r="3.2"
            className="animate-twinkle"
            style={{ animationDelay: "0.7s" }}
          />
          <circle
            cx="34"
            cy="268"
            r="2.8"
            className="animate-twinkle"
            style={{ animationDelay: "1.3s" }}
          />
        </g>
      )}
    </svg>
  );
}
