/**
 * ตัวเรียก Gemini API — ใช้ได้เฉพาะฝั่ง server เท่านั้น
 *
 * ใช้ generateContent (แบบไม่เก็บสถานะ) ไม่ใช่ Interactions API ตัวใหม่
 * เพราะ Interactions API เก็บประวัติบทสนทนาไว้ฝั่ง Google โดยดีฟอลต์ (store=true)
 * แต่เว็บนี้อยากคุมประวัติแชทเองในเบราว์เซอร์ ไม่ต้องฝากบทสนทนาผู้ใช้ไว้ที่อื่น
 */

const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

/**
 * ห้ามตั้งชื่อ env ตัวนี้ขึ้นต้นด้วย NEXT_PUBLIC เด็ดขาด
 * เพราะ Next.js จะฝังค่าลง bundle ฝั่ง browser = แจก key ให้ทุกคนที่เปิดเว็บ
 * (ต่างจาก Supabase anon key ที่ออกแบบมาให้เปิดเผยได้)
 */
const API_KEY = process.env.GEMINI_API_KEY;

/**
 * gemini-2.0-flash ถูกปลดระวางไปแล้ว ห้ามใช้
 * flash-lite เร็วและประหยัดโควตาที่สุด เหมาะกับงานไกด์เว็บ
 * ถ้าชื่อรุ่นเปลี่ยนอีก แก้ที่ env ได้เลยโดยไม่ต้อง deploy โค้ดใหม่
 */
const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

export const isGeminiConfigured = Boolean(API_KEY);

export type ChatRole = "user" | "model";

export type ChatMessage = {
  role: ChatRole;
  text: string;
};

export class GeminiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "GeminiError";
    this.status = status;
  }
}

type GeminiPart = { text?: string };

type GeminiChunk = {
  candidates?: {
    content?: { parts?: GeminiPart[] };
    finishReason?: string;
  }[];
  promptFeedback?: { blockReason?: string };
};

/** ดึงข้อความออกจาก chunk หนึ่งก้อน */
function textOf(chunk: GeminiChunk): string {
  const parts = chunk.candidates?.[0]?.content?.parts ?? [];
  return parts.map((part) => part.text ?? "").join("");
}

/**
 * ส่งบทสนทนาไป Gemini แล้วคืนสตรีมข้อความล้วน
 *
 * คืนเป็นข้อความดิบไม่ห่อ JSON ฝั่ง client จึงแค่ต่อสตริงไปเรื่อยๆ
 */
export async function streamGeminiReply({
  messages,
  systemInstruction,
}: {
  messages: ChatMessage[];
  systemInstruction: string;
}): Promise<ReadableStream<Uint8Array>> {
  if (!API_KEY) {
    throw new GeminiError("ยังไม่ได้ตั้งค่า GEMINI_API_KEY", 503);
  }

  const response = await fetch(
    `${API_BASE}/${MODEL}:streamGenerateContent?alt=sse`,
    {
      method: "POST",
      headers: {
        // เอกสารของ Gemini ให้ส่ง key ทาง header ไม่ใช่ query param
        // ซึ่งดีกว่าเพราะ key จะไม่ไปโผล่ใน log ของ proxy หรือ access log
        "x-goog-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: messages.map((message) => ({
          role: message.role,
          parts: [{ text: message.text }],
        })),
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      }),
    },
  );

  if (!response.ok || !response.body) {
    const detail = await response.text().catch(() => "");
    console.error("Gemini API error", response.status, detail.slice(0, 500));

    if (response.status === 429) {
      throw new GeminiError(
        "ตอนนี้มีคนใช้เยอะจนเกินโควตาของ Gemini กรุณาลองใหม่อีกสักครู่",
        429,
      );
    }
    if (response.status === 400 || response.status === 403) {
      throw new GeminiError(
        "เชื่อมต่อ Gemini ไม่สำเร็จ อาจเป็นเพราะ API key ไม่ถูกต้องหรือชื่อรุ่นโมเดลไม่มีอยู่จริง",
        502,
      );
    }
    throw new GeminiError("เชื่อมต่อ Gemini ไม่สำเร็จ กรุณาลองใหม่", 502);
  }

  const upstream = response.body;
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.getReader();
      // เก็บเศษบรรทัดที่ยังไม่จบไว้ต่อกับก้อนถัดไป
      // เพราะ chunk จาก network ถูกตัดตรงไหนก็ได้ ไม่ได้ตัดตามบรรทัดเสมอ
      let buffer = "";
      let sentAnything = false;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          // บรรทัดสุดท้ายอาจยังไม่จบ เก็บไว้รอบหน้า
          buffer = lines.pop() ?? "";

          for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line.startsWith("data:")) continue;

            const payload = line.slice(5).trim();
            if (!payload || payload === "[DONE]") continue;

            let chunk: GeminiChunk;
            try {
              chunk = JSON.parse(payload) as GeminiChunk;
            } catch {
              // บรรทัดที่แยกไม่ออกให้ข้ามไป ดีกว่าทำให้ทั้งสตรีมพัง
              continue;
            }

            if (chunk.promptFeedback?.blockReason) {
              controller.enqueue(
                encoder.encode(
                  "ขออภัยค่ะ คำถามนี้ระบบความปลอดภัยของ Gemini ไม่อนุญาตให้ตอบ ลองถามใหม่ด้วยคำอื่นได้ไหมคะ",
                ),
              );
              sentAnything = true;
              continue;
            }

            const text = textOf(chunk);
            if (text) {
              controller.enqueue(encoder.encode(text));
              sentAnything = true;
            }

            if (chunk.candidates?.[0]?.finishReason === "SAFETY") {
              controller.enqueue(
                encoder.encode(
                  "\n\n(คำตอบถูกตัดกลางคันเพราะระบบความปลอดภัยค่ะ)",
                ),
              );
            }
          }
        }

        if (!sentAnything) {
          controller.enqueue(
            encoder.encode("ขออภัยค่ะ น้องมูตอบคำถามนี้ไม่ได้ ลองถามใหม่อีกครั้งนะคะ"),
          );
        }
      } catch (error) {
        console.error("Gemini stream error", error);
        controller.enqueue(
          encoder.encode("\n\n(การเชื่อมต่อขาดกลางคัน ลองถามใหม่อีกครั้งนะคะ)"),
        );
      } finally {
        reader.releaseLock();
        controller.close();
      }
    },
  });
}
