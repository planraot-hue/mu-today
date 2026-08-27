# ระบบภายใน — Next.js + Fixed Password

เว็บ Next.js ที่ล็อกด้วยรหัสผ่านค่าคงที่ตัวเดียว ไม่มีระบบสมาชิก ไม่มีฐานข้อมูล
สร้างตามข้อกำหนดใน [docs/plan.txt](docs/plan.txt)

## Deploy ขึ้น Vercel

ไม่ต้องติดตั้งอะไรในเครื่อง — Vercel จะรัน `npm install` และ `npm run build` ให้เอง

1. **push โค้ดขึ้น GitHub**

   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   ```

   `.env.local` ถูก `.gitignore` ไว้แล้ว รหัสผ่านจะไม่ติดขึ้นไปด้วย

2. **import ที่ [vercel.com/new](https://vercel.com/new)** → เลือก repo นี้
   Vercel จะตรวจเจอว่าเป็น Next.js เองโดยไม่ต้องตั้งค่า build อะไรเพิ่ม

3. **ตั้ง Environment Variables** (สำคัญ — ถ้าไม่ตั้ง เว็บจะล็อกอินไม่ได้)

   ในหน้า import หรือที่ Settings → Environment Variables ใส่สองตัวนี้ ให้ติ๊กครบทั้ง
   Production / Preview / Development

   | ชื่อ | ค่า |
   |---|---|
   | `APP_PASSWORD` | รหัสผ่านที่คุณจะใช้เข้าเว็บ |
   | `SESSION_SECRET` | ข้อความสุ่มยาว 32 ตัวอักษรขึ้นไป |

   ค่าเริ่มต้นสำหรับทดสอบดูได้ใน [.env.local](.env.local) — **ควรเปลี่ยนก่อนใช้งานจริง**
   สร้าง `SESSION_SECRET` ใหม่ได้ที่ [generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)
   หรือรัน `openssl rand -base64 32`

4. กด **Deploy** แล้วเปิดลิงก์ที่ได้ → จะเจอหน้า login

> เปลี่ยนรหัสผ่านทีหลัง: แก้ค่า `APP_PASSWORD` ใน Vercel แล้วสั่ง **Redeploy**
> (env var จะมีผลก็ต่อเมื่อ deploy ใหม่)

## รันในเครื่อง (ถ้าติดตั้ง Node.js แล้ว)

ต้องมี Node.js 18.18 ขึ้นไป

```bash
npm install
npm run dev
```

เปิด http://localhost:3000 — ค่า env อ่านจาก `.env.local` อัตโนมัติ

## โครงสร้างโค้ด

```
src/
├── middleware.ts              กันทุกเส้นทางยกเว้น /login
├── lib/
│   ├── session.ts             สร้าง/ตรวจ JWT (ใช้ได้ทั้ง Edge และ Node)
│   ├── session-cookie.ts      อ่าน/เขียน/ลบ session cookie
│   └── auth.ts                เทียบรหัสผ่าน + rate limit
└── app/
    ├── actions.ts             Server Action: login / logout
    ├── page.tsx               หน้าหลัก (ต้องล็อกอิน)
    └── login/                 หน้า login + ฟอร์ม
```

### การเพิ่มหน้าใหม่

สร้างโฟลเดอร์ใน `src/app/` ได้เลย — middleware จะกันให้อัตโนมัติทุกหน้า
แนะนำให้เรียก `getSession()` ในหน้านั้นด้วย เพื่อตรวจซ้ำอีกชั้น (ดูตัวอย่างใน `src/app/page.tsx`)

## เรื่องความปลอดภัยที่ทำไว้

- รหัสผ่านถูกตรวจฝั่ง server เท่านั้น ไม่เคยถูกส่งไปที่ browser
- เทียบรหัสด้วย `timingSafeEqual` บน SHA-256 digest — กัน timing attack
- session cookie เป็น `httpOnly` + `sameSite=lax` + `secure` บน production
- กันเดารหัส: ผิดเกิน 5 ครั้งใน 5 นาทีจะถูกหน่วงไว้
  **ข้อจำกัด:** ตัวนับเก็บในหน่วยความจำของแต่ละ serverless instance จึงไม่ถูกแชร์ข้าม
  instance และรีเซ็ตเมื่อ instance ถูกรีไซเคิล ถ้าต้องการของจริงให้เปลี่ยนไปใช้
  Upstash Redis โดยแก้แค่ 3 ฟังก์ชันท้ายไฟล์ `src/lib/auth.ts`
- กัน open redirect ที่พารามิเตอร์ `next`
- ตั้ง `robots: noindex` ไม่ให้ search engine เก็บหน้าเว็บ
