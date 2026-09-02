import Link from "next/link";
import { redirect } from "next/navigation";
import { CuteCharacter } from "@/components/CuteCharacter";
import {
  OUTFIT_STYLE_LABELS,
  getDailyCharm,
  getDailyLooks,
  getLuckyDay,
  type OutfitLook,
} from "@/lib/lucky-color";
import { getViewer } from "@/lib/viewer";
import { formatThaiFullDate, getThaiToday } from "@/lib/thai-date";

// วันที่ต้องสดใหม่ทุกครั้งที่เปิด ห้ามให้ Next.js แคชหน้านี้ไว้ข้ามวัน
export const dynamic = "force-dynamic";

const FEATURE_LINKS = [
  {
    href: "/horoscope",
    emoji: "🔮",
    title: "ดวงราศี",
    detail: "รายวัน รายสัปดาห์ รายเดือน",
    className: "bg-lilac",
  },
  {
    href: "/siamsi",
    emoji: "🥢",
    title: "เสี่ยงเซียมซี",
    detail: "วัดดัง 4 ภาค เขย่าเองได้",
    className: "bg-mint",
  },
  {
    href: "/tarot",
    emoji: "🃏",
    title: "ไพ่ทาโรต์",
    detail: "เปิด 1 ใบ หรือ 3 ใบ",
    className: "bg-sky",
  },
];

export default async function HomePage() {
  // ตรวจซ้ำอีกชั้นนอกเหนือจาก middleware
  const viewer = await getViewer();
  if (!viewer.canView) redirect("/login");

  const today = getThaiToday();
  const day = getLuckyDay(today.weekday);
  const looks = getDailyLooks(day, today.isoDate);
  const featuredLook = looks.find((look) => look.isFeatured) ?? looks[0];
  const charm = getDailyCharm(today.isoDate);

  const accent = day.lucky[0]?.hex ?? day.main.hex;

  return (
    <main className="mx-auto max-w-4xl px-4 pb-8 pt-6 sm:px-5">
      {/* ---------- สีมงคลวันนี้ ---------- */}
      <section
        className="rounded-blob border border-line bg-card/80 p-5 shadow-sm backdrop-blur-sm sm:p-7"
        style={{
          backgroundImage: `linear-gradient(160deg, ${day.main.hex}33 0%, transparent 55%)`,
        }}
      >
        <p className="text-sm text-ink-soft">{formatThaiFullDate(today)}</p>

        <h1 className="mt-1 font-cute text-3xl leading-snug text-ink sm:text-4xl">
          {day.emoji} สีมงคลของวัน{day.name}
        </h1>
        <p className="mt-1 text-sm text-ink-soft">{day.blessing}</p>

        <div className="mt-5 grid items-center gap-5 sm:grid-cols-[minmax(0,190px)_minmax(0,1fr)]">
          {/* ตัวการ์ตูนสูงและผอมกว่าเดิม จึงกำหนดด้วยความสูงแทนความกว้าง
              ไม่งั้นการ์ดจะยืดสูงเกินไป */}
          <div className="flex justify-center">
            <CuteCharacter
              mainColor={day.main.hex}
              accentColor={accent}
              style={featuredLook.style}
              className="animate-float-soft h-72 w-auto sm:h-80"
            />
          </div>

          <div>
            <div
              className="rounded-2xl border p-4"
              style={{
                borderColor: `${day.main.hex}80`,
                backgroundColor: `${day.main.hex}26`,
              }}
            >
              <p className="text-xs text-ink-soft">สีประจำวัน{day.name}</p>
              <p className="font-cute text-2xl text-ink">{day.main.name}</p>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className="h-8 w-8 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: day.main.hex }}
                />
                <span className="text-xs text-ink-soft">
                  ดาวประจำวัน · {day.planet}
                </span>
              </div>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <SwatchGroup
                title="สีเสริมดวง"
                hint="ใส่แล้วเฮง"
                colors={day.lucky}
              />
              <SwatchGroup
                title="สีกาลกิณี"
                hint="เลี่ยงไว้ก่อน"
                colors={day.avoid}
                muted
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- ไอเดียแต่งตัว ---------- */}
      <section className="mt-5 rounded-blob border border-line bg-card/80 p-5 shadow-sm sm:p-7">
        <h2 className="font-cute text-2xl text-ink">👗 แต่งตัวยังไงดีวันนี้</h2>
        <p className="text-sm text-ink-soft">
          3 ลุคที่ใช้สีมงคลของวัน{day.name} เลือกลุคที่ชอบแล้วแต่งตามได้เลย
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {looks.map((look) => (
            <LookCard key={look.title} look={look} />
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <CharmCard emoji="🍀" label="ของนำโชค" value={charm.charm} />
          <CharmCard emoji="🧭" label="ทิศมงคล" value={charm.direction} />
          <CharmCard
            emoji="🔢"
            label="เลขนำโชค"
            value={String(charm.luckyNumber)}
          />
        </div>
      </section>

      {/* ---------- ทางไปฟีเจอร์อื่น ---------- */}
      <section className="mt-5 grid gap-3 sm:grid-cols-3">
        {FEATURE_LINKS.map((feature) => (
          <Link
            key={feature.href}
            href={feature.href}
            className={`group rounded-blob border border-line ${feature.className} p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md`}
          >
            <span className="text-3xl" aria-hidden>
              {feature.emoji}
            </span>
            <p className="mt-2 font-cute text-xl text-ink">{feature.title}</p>
            <p className="text-xs text-ink-soft">{feature.detail}</p>
            <span className="mt-3 inline-block text-sm text-ink transition group-hover:translate-x-1">
              เข้าไปดู →
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}

/** การ์ดลุคหนึ่งลุค พร้อมตัวการ์ตูนใส่ชุดตามลุคนั้นจริงๆ */
function LookCard({ look }: { look: OutfitLook }) {
  return (
    <article
      className="relative flex flex-col rounded-2xl border bg-card p-4"
      style={{
        borderColor: look.isFeatured ? look.color.hex : undefined,
        borderWidth: look.isFeatured ? 2 : undefined,
      }}
    >
      {look.isFeatured && (
        <span
          className="absolute -top-2.5 left-4 rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-ink shadow-sm"
          style={{ backgroundColor: look.color.hex }}
        >
          ⭐ แนะนำวันนี้
        </span>
      )}

      <div
        className="mt-1 rounded-xl py-2"
        style={{ backgroundColor: `${look.color.hex}24` }}
      >
        <CuteCharacter
          mainColor={look.color.hex}
          accentColor={look.accent.hex}
          style={look.style}
          showSparkles={false}
          className="mx-auto h-52 w-auto"
        />
      </div>

      <p className="mt-3 text-xs text-ink-soft">
        {OUTFIT_STYLE_LABELS[look.style]}
      </p>
      <p className="font-cute text-lg leading-snug text-ink">{look.title}</p>
      <p className="mt-1 text-sm leading-relaxed text-ink-soft">
        {look.detail}
      </p>

      <ul className="mt-3 space-y-1.5">
        {look.items.map((item) => (
          <li key={item} className="flex items-start gap-1.5 text-xs text-ink">
            <span aria-hidden>·</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {/* สีที่ใช้ในลุคนี้ ดันไปชิดล่างเพื่อให้การ์ดทั้งสามใบจบเสมอกัน */}
      <div className="mt-auto flex items-center gap-2 pt-3">
        <span
          className="h-5 w-5 rounded-full border border-line"
          style={{ backgroundColor: look.color.hex }}
        />
        <span
          className="h-5 w-5 rounded-full border border-line"
          style={{ backgroundColor: look.accent.hex }}
        />
        <span className="text-[11px] text-ink-soft">
          {look.color.name} + {look.accent.name}
        </span>
      </div>
    </article>
  );
}

function SwatchGroup({
  title,
  hint,
  colors,
  muted,
}: {
  title: string;
  hint: string;
  colors: { name: string; hex: string }[];
  muted?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-line bg-card p-4">
      <p className="text-sm font-semibold text-ink">
        {title}{" "}
        <span className="font-normal text-xs text-ink-soft">· {hint}</span>
      </p>
      <ul className="mt-2 space-y-1.5">
        {colors.map((color) => (
          <li key={color.name} className="flex items-center gap-2">
            <span
              className={`h-5 w-5 rounded-full border border-line ${
                muted ? "opacity-55" : ""
              }`}
              style={{ backgroundColor: color.hex }}
            />
            <span
              className={`text-xs ${muted ? "text-ink-soft line-through" : "text-ink"}`}
            >
              {color.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CharmCard({
  emoji,
  label,
  value,
}: {
  emoji: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-butter/50 p-4">
      <p className="text-xs text-ink-soft">
        <span aria-hidden>{emoji}</span> {label}
      </p>
      <p className="mt-0.5 text-sm font-medium leading-snug text-ink">{value}</p>
    </div>
  );
}
