# 🔮 มูทูเดย์ (mu-today)

เว็บดูดวงประจำวันโทนพาสเทล สร้างด้วย Next.js 15 + Tailwind CSS v4
ไม่มีฐานข้อมูล ไม่มี service ภายนอก — deploy ขึ้น Vercel ได้ทันที

ข้อกำหนดทั้งหมดอยู่ใน [docs/plan.txt](docs/plan.txt)

## ฟีเจอร์

| หน้า | ทำอะไร |
|---|---|
| `/` | สีมงคลประจำวัน + สีกาลกิณี + ไอเดียแต่งตัวพร้อมตัวการ์ตูนที่เปลี่ยนชุดตามสีของวัน |
| `/horoscope` | ดวง 12 ราศี เลือกได้ทั้งรายวัน รายสัปดาห์ รายเดือน แยกหมวดความรัก/การงาน/การเงิน/สุขภาพ |
| `/siamsi` | เสี่ยงเซียมซีวัดดัง 4 ภาค กดค้างเขย่าหรือสะบัดมือถือจริงก็ได้ |
| `/tarot` | ไพ่ทาโรต์ชุดหลัก 22 ใบ เปิดแบบ 1 ใบ หรือ 3 ใบ (อดีต-ปัจจุบัน-อนาคต) |
| `/login` | ประตูทางเข้า ใช้รหัสผ่านค่าคงที่ตัวเดียว |

> คำทำนายทั้งหมดเขียนไว้ในโค้ดเพื่อความบันเทิง ไม่ได้เชื่อมต่อ AI หรือ API ใดๆ

## Deploy ขึ้น Vercel

โค้ดอยู่บน GitHub แล้วที่ `planraot-hue/mu-today`

1. เข้า [vercel.com/new](https://vercel.com/new) → เลือก repo **mu-today**
2. กางส่วน **Environment Variables** แล้วใส่สองตัวนี้ (ติ๊กครบทั้ง Production / Preview / Development)

   | ชื่อ | ค่า |
   |---|---|
   | `APP_PASSWORD` | รหัสผ่านที่จะใช้เข้าเว็บ |
   | `SESSION_SECRET` | ข้อความสุ่มยาว 32 ตัวอักษรขึ้นไป |

   ค่าตัวอย่างดูได้ใน [.env.local](.env.local) (ไฟล์นี้ไม่ถูก push ขึ้น GitHub)
   สร้าง `SESSION_SECRET` ใหม่ได้ที่ [generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)

3. กด **Deploy** — Vercel จะรัน `npm install` และ `npm run build` ให้เอง

> **ถ้าไม่ตั้ง env ทั้งสองตัว เว็บจะขึ้นแต่ล็อกอินไม่ผ่าน**
> เปลี่ยนรหัสทีหลังต้องสั่ง Redeploy ด้วย env ถึงจะมีผล

## รันในเครื่อง

ต้องมี Node.js 18.18 ขึ้นไป

```bash
npm install
npm run dev
```

## โครงสร้างโค้ด

```
src/
├── middleware.ts                 กันทุกเส้นทางยกเว้น /login
├── components/
│   ├── SiteHeader.tsx            เมนู 4 ฟีเจอร์ + ปุ่มออกจากระบบ
│   └── CuteCharacter.tsx         ตัวการ์ตูน SVG เปลี่ยนสีชุดได้
├── lib/
│   ├── thai-date.ts              วันที่ไทย ยึดเวลา Asia/Bangkok
│   ├── random.ts                 สุ่มแบบมี seed
│   ├── lucky-color.ts            สีมงคล 7 วัน + ไอเดียแต่งตัว
│   ├── zodiac.ts                 12 ราศี + คลังคำทำนาย
│   ├── siamsi.ts                 4 วัด × 8 ใบเซียมซี
│   ├── tarot.ts                  ไพ่ 22 ใบ
│   ├── session.ts / session-cookie.ts   JWT + cookie
│   └── auth.ts                   เทียบรหัสผ่าน + rate limit
└── app/
    ├── page.tsx                  หน้าแรก
    ├── horoscope/ siamsi/ tarot/ ฟีเจอร์ดูดวง
    └── login/                    หน้า login
```

### เรื่องเวลาที่ต้องระวัง

server ของ Vercel รันด้วยเวลา UTC ทุกหน้าที่เกี่ยวกับวันที่จึงต้องเรียกผ่าน
`getThaiToday()` ใน [src/lib/thai-date.ts](src/lib/thai-date.ts) ห้ามใช้ `new Date().getDay()` ตรงๆ
ไม่งั้นช่วงเที่ยงคืนถึง 7 โมงเช้าบ้านเราจะได้วันผิด

### เรื่องการสุ่ม

- **ดวงราศี** ใช้ seed จาก (ราศี + ช่วงเวลา + คีย์วันที่) → เปิดกี่ครั้งก็ได้คำทำนายเดิม
  คีย์วันที่คำนวณฝั่ง server แล้วส่งให้ client เพื่อไม่ให้เกิด hydration mismatch
- **เซียมซีและไพ่ทาโรต์** ใช้ `Math.random()` ฝั่ง client เพราะต้องได้ผลใหม่ทุกครั้งที่เสี่ยง
  และสุ่มหลังผู้ใช้กดเท่านั้น จึงไม่กระทบการ render ครั้งแรก

### จะเปิดเว็บให้คนทั่วไปเข้า

ตอนนี้ทุกหน้าอยู่หลังรหัสผ่าน ถ้าอยากให้คนอื่นเข้าดูได้โดยไม่ต้องล็อกอิน
ให้แก้ `matcher` ใน [src/middleware.ts](src/middleware.ts) ให้กันเฉพาะเส้นทางที่ต้องการ

## ความปลอดภัย

- รหัสผ่านตรวจฝั่ง server เท่านั้น ไม่เคยถูกส่งไป browser
- เทียบด้วย `timingSafeEqual` บน SHA-256 digest กัน timing attack
- session cookie เป็น `httpOnly` + `sameSite=lax` + `secure` บน production
- rate limit 5 ครั้ง / 5 นาที — **ข้อจำกัด:** ตัวนับเก็บในหน่วยความจำของแต่ละ serverless
  instance จึงไม่แชร์ข้าม instance และรีเซ็ตเมื่อ instance ถูกรีไซเคิล
  ถ้าต้องการของจริงให้เปลี่ยนไปใช้ Upstash Redis โดยแก้แค่ 3 ฟังก์ชันท้าย `src/lib/auth.ts`
- กัน open redirect ที่พารามิเตอร์ `next`
