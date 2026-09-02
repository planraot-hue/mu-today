import { NextResponse, type NextRequest } from "next/server";
import {
  GeminiError,
  isGeminiConfigured,
  streamGeminiReply,
  type ChatMessage,
} from "@/lib/gemini";
import { buildSystemInstruction } from "@/lib/site-knowledge";
import { getThaiToday } from "@/lib/thai-date";
import { getViewer } from "@/lib/viewer";

/** ความยาวข้อความสูงสุดต่อครั้ง กันทั้งโควตาบานและ payload บวม */
const MAX_MESSAGE_LENGTH = 1000;

/** เก็บประวัติแค่ไม่กี่เทิร์นล่าสุด บทสนทนายาวไม่ได้ทำให้คำตอบดีขึ้นแต่เปลืองโควตา */
const MAX_HISTORY = 12;

/* ------------------------------------------------------------------ */
/* Rate limit                                                          */
/* ------------------------------------------------------------------ */

/**
 * ข้อจำกัดที่ยอมรับ: บน Vercel แต่ละ serverless instance มีหน่วยความจำของตัวเอง
 * ตัวนับจึงไม่ถูกแชร์ข้าม instance และหายเมื่อ instance ถูกรีไซเคิล
 * เป็นแค่การหน่วงคนที่ยิงรัว ไม่ใช่การกันแบบเด็ดขาด
 * ถ้าเริ่มมีคนใช้จริงจนโควตาหมด ให้เปลี่ยนมาใช้ Upstash Redis โดยแก้แค่ตรงนี้
 */
const MAX_PER_WINDOW = 20;
const WINDOW_MS = 60 * 60 * 1000;
const MAX_TRACKED_KEYS = 5000;

const usage = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string): { allowed: boolean; retryAfterMin: number } {
  const now = Date.now();

  if (usage.size > MAX_TRACKED_KEYS) {
    for (const [tracked, bucket] of usage) {
      if (now > bucket.resetAt) usage.delete(tracked);
    }
  }

  const bucket = usage.get(key);

  if (!bucket || now > bucket.resetAt) {
    usage.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterMin: 0 };
  }

  if (bucket.count >= MAX_PER_WINDOW) {
    return {
      allowed: false,
      retryAfterMin: Math.max(1, Math.ceil((bucket.resetAt - now) / 60000)),
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterMin: 0 };
}

/* ------------------------------------------------------------------ */

type IncomingBody = {
  messages?: unknown;
};

/** ตรวจและตัดข้อความจากผู้ใช้ให้อยู่ในรูปที่ส่งต่อได้ */
function parseMessages(raw: unknown): ChatMessage[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;

  const messages: ChatMessage[] = [];

  for (const item of raw) {
    if (typeof item !== "object" || item === null) return null;

    const candidate = item as Record<string, unknown>;
    const role = candidate.role;
    const text = candidate.text;

    if (role !== "user" && role !== "model") return null;
    if (typeof text !== "string") return null;

    const trimmed = text.trim();
    if (!trimmed) continue;

    messages.push({ role, text: trimmed.slice(0, MAX_MESSAGE_LENGTH) });
  }

  if (messages.length === 0) return null;

  // Gemini ต้องการให้ข้อความสุดท้ายมาจากผู้ใช้
  if (messages[messages.length - 1].role !== "user") return null;

  return messages.slice(-MAX_HISTORY);
}

export async function POST(request: NextRequest) {
  // ตรวจสิทธิ์ซ้ำอีกชั้นนอกเหนือจาก middleware
  const viewer = await getViewer();
  if (!viewer.canView) {
    return NextResponse.json(
      { error: "กรุณาเข้าสู่ระบบหรือเข้าแบบผู้เยี่ยมชมก่อนใช้งานแชท" },
      { status: 401 },
    );
  }

  if (!isGeminiConfigured) {
    return NextResponse.json(
      {
        error:
          "ยังไม่ได้ตั้งค่า GEMINI_API_KEY เจ้าของเว็บต้องเพิ่ม env ตัวนี้ใน Vercel ก่อนค่ะ",
      },
      { status: 503 },
    );
  }

  const forwarded = request.headers.get("x-forwarded-for");
  const clientKey = forwarded?.split(",")[0]?.trim() || "unknown";

  const limit = checkRateLimit(clientKey);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: `คุยกันเยอะแล้วนะคะ ขอพักสักครู่ ลองใหม่ในอีก ${limit.retryAfterMin} นาทีค่ะ`,
      },
      { status: 429 },
    );
  }

  let body: IncomingBody;
  try {
    body = (await request.json()) as IncomingBody;
  } catch {
    return NextResponse.json({ error: "รูปแบบข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }

  const messages = parseMessages(body.messages);
  if (!messages) {
    return NextResponse.json(
      { error: "ไม่พบข้อความที่จะส่ง กรุณาพิมพ์คำถามก่อนค่ะ" },
      { status: 400 },
    );
  }

  try {
    const stream = await streamGeminiReply({
      messages,
      // สร้าง system prompt ใหม่ทุกครั้ง เพื่อให้ "วันนี้" ตรงกับความเป็นจริงเสมอ
      systemInstruction: buildSystemInstruction(getThaiToday()),
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        // กัน proxy บางตัวหน่วง buffer จนสตรีมไม่ไหล
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    if (error instanceof GeminiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Chat route error", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง" },
      { status: 500 },
    );
  }
}
