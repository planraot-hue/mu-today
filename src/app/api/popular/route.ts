import { NextResponse, type NextRequest } from "next/server";
import { bumpFeatureClick, getMostPopular } from "@/lib/popular";
import { getViewer } from "@/lib/viewer";

/**
 * ยอดคลิกฟีเจอร์
 *
 * GET  — ถามว่าตอนนี้ฟีเจอร์ไหนคนดูมากที่สุด (ส่ง ?exclude=id เพื่อตัดหน้าที่เปิดอยู่)
 * POST — นับหนึ่งคลิกให้ฟีเจอร์ แล้วคืนตัวที่มาแรงที่สุดกลับไปในคำตอบเดียวกัน
 *        รวมสองอย่างไว้ที่เดียวเพื่อให้เปลี่ยนหน้าแต่ละครั้งยิงแค่ request เดียว
 *
 * ตัวเลขนี้เป็นยอดรวมของทุกคน ไม่ผูกกับผู้ใช้คนไหน จึงไม่มีข้อมูลส่วนตัวหลุด
 */

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { canView } = await getViewer();
  if (!canView) {
    return NextResponse.json({ error: "ยังไม่ได้เข้าสู่ระบบ" }, { status: 401 });
  }

  const exclude = request.nextUrl.searchParams.get("exclude");
  const top = await getMostPopular(exclude);

  return NextResponse.json({ top });
}

export async function POST(request: NextRequest) {
  const { canView } = await getViewer();
  if (!canView) {
    return NextResponse.json({ error: "ยังไม่ได้เข้าสู่ระบบ" }, { status: 401 });
  }

  let featureId: string | null = null;

  try {
    const body = await request.json();
    if (typeof body?.id === "string") featureId = body.id;
  } catch {
    // ไม่มี body หรือ body ไม่ใช่ JSON — ถือว่าแค่มาถามยอด ไม่ได้มานับ
  }

  // bumpFeatureClick กรอง id ที่ไม่รู้จักทิ้งเองอยู่แล้ว
  if (featureId) await bumpFeatureClick(featureId);

  const top = await getMostPopular(featureId);

  return NextResponse.json({ top });
}
