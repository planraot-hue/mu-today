import Link from "next/link";
import { redirect } from "next/navigation";
import { getViewer } from "@/lib/viewer";

export const metadata = {
  title: "ที่มาของข้อมูล · มูทูเดย์",
};

type SourceItem = {
  feature: string;
  href: string;
  basis: string;
  detail: string;
  /** ระดับความอิงตำรา */
  level: "ตำรา" | "ผสม" | "เขียนขึ้นเอง";
};

const LEVEL_STYLES: Record<
  SourceItem["level"],
  { bg: string; text: string; emoji: string }
> = {
  "ตำรา": { bg: "#D6F2E2", text: "#2E7D5B", emoji: "📜" },
  "ผสม": { bg: "#FFEFC2", text: "#9A6B00", emoji: "🧩" },
  "เขียนขึ้นเอง": { bg: "#E6E8F2", text: "#5B6180", emoji: "✍️" },
};

const SOURCES: SourceItem[] = [
  {
    feature: "สีมงคล / สีกาลกิณีประจำวัน",
    href: "/",
    level: "ตำรา",
    basis: "ทักษาปกรณ์ (โหราศาสตร์ไทย)",
    detail:
      "คำนวณจากลำดับดาวตามทักษา ๑ ๒ ๓ ๔ ๗ ๕ ๘ ๖ โดยเริ่มนับภูมิบริวารที่ดาวประจำวันเกิด สีเสริมดวงมาจากภูมิเดช ศรี มนตรี และสีต้องห้ามมาจากภูมิกาลกิณี ทั้งหมดคำนวณจากกฎในโค้ด ไม่ได้ฮาร์ดโค้ดคำตอบไว้ ดูตารางเต็มได้ที่หน้าดวงวันเกิด",
  },
  {
    feature: "ผูกทักษา 8 ภูมิ",
    href: "/birth",
    level: "ตำรา",
    basis: "ทักษาปกรณ์",
    detail:
      "บริวาร อายุ เดช ศรี มูละ อุตสาหะ มนตรี กาลกิณี พร้อมเรื่องที่แต่ละภูมิดูแล ตรงตามตำรา",
  },
  {
    feature: "ราศีจากวันเดือนเกิด",
    href: "/birth",
    level: "ตำรา",
    basis: "ราศีแบบโหราศาสตร์ไทย (สายสัมพันธ์กับระบบนิรายนะ)",
    detail:
      "ใช้ช่วงวันที่แบบไทยซึ่งเริ่มราศีช้ากว่าแบบสากลราวสองสัปดาห์ เช่น ราศีเมษเริ่ม 13 เมษายน ไม่ใช่ 21 มีนาคม",
  },
  {
    feature: "ดวงสมพงศ์คู่รัก (ด้านวันเกิด)",
    href: "/love",
    level: "ตำรา",
    basis: "ทักษาปกรณ์",
    detail:
      "ดูว่าดาวประจำวันเกิดของอีกฝ่ายตกภูมิใดของเรา ถ้าตกภูมิศรี เดช หรือมนตรี ถือว่าส่งเสริมกัน ถ้าตกภูมิกาลกิณีถือว่าต้องระวัง ส่วนน้ำหนักคะแนน 40/35/25 เป็นการให้ค่าของเว็บนี้เอง",
  },
  {
    feature: "นักษัตรจีน ธาตุประจำปี หยินหยาง",
    href: "/chinese",
    level: "ตำรา",
    basis: "ปฏิทินจีน รอบ 12 นักษัตร และรอบธาตุ 10 ปี",
    detail:
      "นักษัตรคำนวณจาก (ปี ค.ศ. − 4) mod 12 ธาตุจากรอบ 10 ปี และหยินหยางจากปีคู่ปีคี่ ตรวจสอบย้อนกลับได้ เช่น ปี 2567 = มะโรงธาตุไม้ ปี 2569 = มะเมียธาตุไฟ",
  },
  {
    feature: "ปีชง และสามฮะ",
    href: "/chinese",
    level: "ตำรา",
    basis: "ตำราจีน (สามฮะ 三合 และปีชง 沖)",
    detail:
      "ชงตรงคือนักษัตรที่ห่างกัน 6 ตำแหน่ง คัดชงคือห่างกัน 3 หรือ 9 ตำแหน่ง ส่วนสามฮะคือกลุ่มที่ห่างกัน 4 ตำแหน่ง ทั้งหมดคำนวณจากตำแหน่งจริงในวงล้อ",
  },
  {
    feature: "เลขศาสตร์ เลขชีวิต",
    href: "/birth",
    level: "ผสม",
    basis: "เลขศาสตร์สากล (Life Path Number)",
    detail:
      "วิธีคำนวณคือบวกเลขวันเดือนปีเกิดทุกหลักแล้วลดเหลือหลักเดียว ซึ่งเป็นวิธีมาตรฐาน ส่วนคำบรรยายความหมายเรียบเรียงขึ้นใหม่",
  },
  {
    feature: "ไพ่ทาโรต์ 78 ใบ",
    href: "/tarot",
    level: "ผสม",
    basis: "ระบบไรเดอร์-เวต (Rider–Waite)",
    detail:
      "โครงสร้างสำรับ ชื่อไพ่ ชุดไพ่ ธาตุประจำชุด และแนวความหมายทั้งไพ่ตั้งตรงและกลับหัว อิงตามระบบไรเดอร์-เวตที่ใช้กันทั่วโลก ส่วนถ้อยคำภาษาไทยเรียบเรียงขึ้นใหม่",
  },
  {
    feature: "นิสัยตามวันเกิด",
    href: "/birth",
    level: "ผสม",
    basis: "คติความเชื่อไทยเรื่องเทวดาประจำวัน",
    detail:
      "ดาวประจำวันและลักษณะเด่นอิงคติไทย แต่คำบรรยายนิสัย จุดแข็ง จุดอ่อน และอาชีพที่เหมาะ เรียบเรียงขึ้นเอง ไม่ได้คัดจากตำราเล่มใดเล่มหนึ่ง",
  },
  {
    feature: "ดวงราศีรายวัน / สัปดาห์ / เดือน",
    href: "/horoscope",
    level: "เขียนขึ้นเอง",
    basis: "ไม่ได้อิงตำรา",
    detail:
      "การพยากรณ์รายวันจริงต้องคำนวณจากตำแหน่งดาวจร ณ เวลานั้น ซึ่งต้องใช้ฐานข้อมูลดาราศาสตร์ที่เว็บนี้ยังไม่มี คำทำนายจึงมาจากคลังประโยคที่เขียนไว้ล่วงหน้า แล้วสุ่มด้วยรหัสจากราศีและวันที่ ทำให้ได้ผลเดิมตลอดช่วงนั้น",
  },
  {
    feature: "เซียมซี 4 ภาค",
    href: "/siamsi",
    level: "เขียนขึ้นเอง",
    basis: "เขียนใหม่ในรูปแบบเซียมซีไทย",
    detail:
      "ชื่อวัดเป็นวัดจริง แต่คำกลอนและคำทำนายเขียนขึ้นใหม่ทั้งหมด ไม่ได้คัดลอกจากใบเซียมซีของวัดใด และเป็นชุดย่อวัดละ 8 ใบ ขณะที่ของจริงมี 28 ใบ",
  },
  {
    feature: "ไพ่พรหมญาณ",
    href: "/phrom-yan",
    level: "เขียนขึ้นเอง",
    basis: "เขียนใหม่ในรูปแบบไพ่พยากรณ์ไทย",
    detail:
      "ไพ่พรหมญาณที่วางขายเป็นผลงานมีลิขสิทธิ์ของผู้จัดทำแต่ละสำนัก สำรับในเว็บนี้เขียนขึ้นใหม่ทั้งหมด ไม่ได้คัดลอกคำทำนายจากสำรับใด",
  },
  {
    feature: "ของนำโชค ทิศมงคล เลขนำโชคประจำวัน",
    href: "/",
    level: "เขียนขึ้นเอง",
    basis: "ไม่ได้อิงตำรา",
    detail:
      "สุ่มจากคลังที่เขียนไว้ด้วยรหัสจากวันที่ เป็นลูกเล่นเสริมเพื่อความสนุก",
  },
];

export default async function SourcesPage() {
  const viewer = await getViewer();
  if (!viewer.canView) redirect("/login");

  return (
    <main className="mx-auto max-w-4xl px-4 pb-8 pt-6 sm:px-5">
      <header className="mb-4">
        <h1 className="font-cute text-3xl text-ink">📚 ที่มาของข้อมูล</h1>
        <p className="text-sm leading-relaxed text-ink-soft">
          หน้านี้บอกตรงๆ ว่าคำทำนายแต่ละส่วนมาจากไหน
          ส่วนไหนคำนวณตามตำราจริง และส่วนไหนเขียนขึ้นเองเพื่อความบันเทิง
        </p>
      </header>

      <section className="rounded-blob border border-line bg-card/85 p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(LEVEL_STYLES) as SourceItem["level"][]).map((level) => (
            <span
              key={level}
              className="rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{
                backgroundColor: LEVEL_STYLES[level].bg,
                color: LEVEL_STYLES[level].text,
              }}
            >
              {LEVEL_STYLES[level].emoji} {level}
            </span>
          ))}
        </div>

        <p className="mt-3 text-xs leading-relaxed text-ink-soft">
          <strong>ตำรา</strong> = คำนวณจากกฎของตำราโดยตรง ตรวจสอบย้อนกลับได้ ·{" "}
          <strong>ผสม</strong> = โครงสร้างมาจากตำรา แต่ถ้อยคำเรียบเรียงใหม่ ·{" "}
          <strong>เขียนขึ้นเอง</strong> = ไม่ได้อ้างอิงตำรา
        </p>
      </section>

      <section className="mt-4 space-y-3">
        {SOURCES.map((item) => {
          const style = LEVEL_STYLES[item.level];

          return (
            <article
              key={item.feature}
              className="rounded-blob border border-line bg-card/85 p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h2 className="font-cute text-xl text-ink">{item.feature}</h2>
                <span
                  className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ backgroundColor: style.bg, color: style.text }}
                >
                  {style.emoji} {item.level}
                </span>
              </div>

              <p className="mt-1 text-sm font-medium text-ink">
                อ้างอิง: {item.basis}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                {item.detail}
              </p>

              <Link
                href={item.href}
                className="mt-2 inline-block text-xs text-blossom-deep underline underline-offset-2"
              >
                ไปที่ฟีเจอร์นี้ →
              </Link>
            </article>
          );
        })}
      </section>

      <section className="mt-4 rounded-blob border border-dashed border-blossom-deep/40 bg-blossom/20 p-5 text-sm leading-relaxed text-ink">
        <p className="font-semibold">ข้อจำกัดที่อยากบอกให้ชัด</p>
        <p className="mt-2">
          เว็บนี้ไม่ได้เชื่อมต่อฐานข้อมูลตำแหน่งดาว (ephemeris)
          จึงคำนวณดวงจากดาวจรตามเวลาจริงไม่ได้
          ส่วนที่ทำได้แม่นยำคือสิ่งที่คำนวณจากวันเดือนปีเกิดล้วนๆ เช่น
          ทักษา ราศี นักษัตรจีน และเลขศาสตร์ ซึ่งเป็นกฎตายตัวที่ตรวจสอบย้อนกลับได้
        </p>
        <p className="mt-2">
          ถ้าอยากได้การพยากรณ์ตามดาวจรจริง ต้องเพิ่มไลบรารีดาราศาสตร์
          และข้อมูลเวลาเกิดกับสถานที่เกิดเข้ามาด้วย
          ซึ่งยังไม่ได้ทำในเวอร์ชันนี้
        </p>
      </section>
    </main>
  );
}
