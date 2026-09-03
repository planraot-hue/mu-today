/**
 * ที่อยู่เว็บแบบเต็ม ใช้ทำ metadataBase
 *
 * og:image ต้องเป็น URL แบบเต็ม (มี https://) ตัวเก็บข้อมูลของ LINE และ Facebook
 * ไม่ตามลิงก์แบบสัมพัทธ์ ถ้าไม่ตั้ง metadataBase Next.js จะเตือนแล้วใส่ localhost ให้
 * ซึ่งพรีวิวจะไม่ขึ้นเลย
 *
 * ลำดับการหา:
 * 1. NEXT_PUBLIC_SITE_URL ที่ตั้งเอง ใช้เมื่อมีโดเมนของตัวเอง
 * 2. VERCEL_PROJECT_PRODUCTION_URL โดเมน production ที่คงที่
 * 3. VERCEL_URL โดเมนของ deployment นั้นๆ ซึ่งเปลี่ยนทุกครั้งที่ deploy
 * 4. localhost สำหรับตอนรันในเครื่อง
 */
export function getSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (production) return new URL(`https://${production}`);

  const deployment = process.env.VERCEL_URL;
  if (deployment) return new URL(`https://${deployment}`);

  return new URL("http://localhost:3000");
}
