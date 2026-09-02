# 🔮 มูทูเดย์ (mu-today)

เว็บดูดวงประจำวันโทนพาสเทล สร้างด้วย Next.js 15 + Tailwind CSS v4
ระบบสมาชิกใช้ **Supabase Auth** (อีเมล + รหัสผ่าน)

ข้อกำหนดทั้งหมดอยู่ใน [docs/plan.txt](docs/plan.txt)

## ฟีเจอร์

| หน้า | ทำอะไร |
|---|---|
| `/` | สีมงคลประจำวัน + สีกาลกิณี + ไอเดียแต่งตัว 3 ลุค แต่ละลุคมีตัวการ์ตูนใส่ชุดให้ดู |
| `/horoscope` | ดวง 12 ราศี เลือกได้ทั้งรายวัน รายสัปดาห์ รายเดือน |
| `/siamsi` | เสี่ยงเซียมซีวัดดัง 4 ภาค กดค้างเขย่าหรือสะบัดมือถือจริงก็ได้ |
| `/tarot` | ไพ่ทาโรต์สำรับเต็ม 78 ใบ (ชุดใหญ่ 22 + ชุดเล็ก 56) เปิดแบบ 1 ใบ หรือ 3 ใบ |
| `/login` | เข้าสู่ระบบ / สมัครสมาชิก ด้วยอีเมล หรือเข้าแบบผู้เยี่ยมชม |
| ทุกหน้า | 💬 แชทกับ **น้องมู** ผู้ช่วย AI ที่รู้จักเว็บนี้ (ปุ่มลอยมุมขวาล่าง) |
| `/auth/callback` | ปลายทางของลิงก์ยืนยันอีเมล แลก code เป็น session |

> คำทำนายทั้งหมดเขียนไว้ในโค้ดเพื่อความบันเทิง ไม่ได้เชื่อมต่อ AI หรือ API ใดๆ

## ตั้งค่า Supabase (ทำก่อน deploy)

### 1. เอาค่าเชื่อมต่อ

Supabase Dashboard → **Project Settings → API** จะเจอ

| ค่าที่ต้องใช้ | เอาไปใส่เป็น env |
|---|---|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| anon / public key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |

ทั้งสองค่าเป็น `NEXT_PUBLIC` ได้อย่างปลอดภัย — anon key ออกแบบมาให้เปิดเผยต่อ browser อยู่แล้ว
ความปลอดภัยจริงมาจาก Row Level Security ที่ตั้งฝั่ง Supabase

> ⚠️ **ห้ามเอา `service_role` key มาใส่เด็ดขาด** key นั้นข้าม RLS ได้ทั้งหมด
> ถ้าหลุดขึ้น browser เท่ากับเปิดฐานข้อมูลทิ้งไว้

### 2. เปิดการล็อกอินด้วยอีเมล

**Authentication → Providers → Email** เปิดไว้

### 3. ตั้ง Redirect URL (ถ้าไม่ตั้ง ลิงก์ยืนยันอีเมลจะเด้งผิดที่)

**Authentication → URL Configuration**

- **Site URL**: `https://<โดเมนของคุณ>.vercel.app`
- **Redirect URLs**: เพิ่มทั้งสองอัน
  - `https://<โดเมนของคุณ>.vercel.app/auth/callback`
  - `http://localhost:3000/auth/callback`

### 4. ถ้าอยากทดสอบเร็วโดยไม่ต้องยืนยันอีเมล

**Authentication → Providers → Email** แล้วปิด *Confirm email*
สมัครเสร็จจะเข้าเว็บได้ทันที (โค้ดรองรับทั้งสองแบบอยู่แล้ว)

## ตั้งค่าแชทบอท น้องมู (Gemini)

1. ขอ API key ฟรีที่ [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. ใส่เป็น env ชื่อ **`GEMINI_API_KEY`**

> ⚠️ **ห้ามตั้งชื่อขึ้นต้นด้วย `NEXT_PUBLIC` เด็ดขาด**
> ต่างจาก Supabase anon key ที่ออกแบบมาให้เปิดเผยได้ — ถ้าใส่ `NEXT_PUBLIC` นำหน้า
> Next.js จะฝัง key ลง bundle ฝั่ง browser เท่ากับแจกให้ทุกคนเอาไปใช้จนโควตาหมด

3. ถ้าอยากเปลี่ยนรุ่นโมเดล ใส่ `GEMINI_MODEL` เพิ่ม (ไม่ใส่ก็ได้)

| ค่า | หมายเหตุ |
|---|---|
| `gemini-3.5-flash-lite` | ค่าเริ่มต้น เร็วและประหยัดโควตาที่สุด |
| `gemini-3.7-flash` | ฉลาดกว่าแต่กินโควตามากกว่า |

> `gemini-2.0-flash` **ถูกปลดระวางไปแล้ว** ใส่ไปจะเรียกไม่ติด

**ถ้าไม่ตั้ง `GEMINI_API_KEY`** เว็บยังใช้งานได้ปกติทุกอย่าง แค่แชทจะขึ้นข้อความ
บอกให้ตั้งค่าก่อน ไม่ได้พังทั้งเว็บ

### บอทรู้เรื่องเว็บได้ยังไง

[site-knowledge.ts](src/lib/site-knowledge.ts) ประกอบ system prompt ขึ้นจาก
ไลบรารีชุดเดียวกับที่หน้าเว็บใช้ (`getLuckyDay`, `ZODIACS`, `TEMPLES`, `BHUM_LIST` ฯลฯ)
ไม่ได้พิมพ์ความรู้ซ้ำด้วยมือ — เพิ่มวัดเซียมซีใหม่แล้วบอทรู้เองทันที
และสร้าง prompt ใหม่ทุก request ทำให้ข้อมูล "วันนี้" ถูกต้องเสมอ

บอทมีกฎกำกับว่า **ห้ามแต่งคำทำนายเอง** ถ้าถูกขอให้ดูดวงจะชวนไปหน้าที่คำนวณจริงแทน
เพื่อไม่ให้คำตอบของ AI ขัดกับผลที่คำนวณจากตำรา

## Deploy ขึ้น Vercel

1. เข้า [vercel.com/new](https://vercel.com/new) → เลือก repo **mu-today**
2. กางส่วน **Environment Variables** ใส่ `NEXT_PUBLIC_SUPABASE_URL` และ
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` (ติ๊กครบทั้ง Production / Preview / Development)
3. กด **Deploy** — Vercel จะรัน `npm install` และ `npm run build` ให้เอง
4. เอาโดเมนที่ได้กลับไปใส่ใน Supabase ตามข้อ 3 ด้านบน

> ถ้าไม่ตั้ง env ทั้งสองตัว หน้า `/login` จะขึ้นข้อความบอกให้ตั้งค่าแทนการพัง 500

## รันในเครื่อง

ต้องมี Node.js 18.18 ขึ้นไป

```bash
npm install
cp .env.example .env.local   # แล้วเติมค่าจริงลงไป
npm run dev
```

## โครงสร้างโค้ด

```
src/
├── middleware.ts                 เรียก updateSession ของ Supabase
├── components/
│   ├── SiteHeader.tsx            เมนู + อีเมลผู้ใช้ + ปุ่มออกจากระบบ
│   └── CuteCharacter.tsx         ตัวการ์ตูน SVG เปลี่ยนสีชุดได้
├── lib/
│   ├── supabase/
│   │   ├── env.ts                อ่านและตรวจค่า env
│   │   ├── client.ts             client ฝั่ง browser
│   │   ├── server.ts             client ฝั่ง server + getCurrentUser()
│   │   └── middleware.ts         ต่ออายุ session + กันเส้นทาง
│   ├── thai-date.ts              วันที่ไทย ยึดเวลา Asia/Bangkok
│   ├── random.ts                 สุ่มแบบมี seed
│   ├── lucky-color.ts            สีมงคล 7 วัน + ไอเดียแต่งตัว
│   ├── zodiac.ts                 12 ราศี + คลังคำทำนาย
│   ├── siamsi.ts                 4 วัด × 8 ใบเซียมซี
│   ├── tarot.ts                  รวมสำรับ 78 ใบ + ฟังก์ชันสับไพ่
│   └── tarot-types/major/minor.ts  ชนิดข้อมูล + ไพ่ชุดใหญ่ 22 + ชุดเล็ก 56
└── app/
    ├── actions.ts                Server Action: signIn / signUp / signOut
    ├── page.tsx                  หน้าแรก
    ├── horoscope/ siamsi/ tarot/ ฟีเจอร์ดูดวง
    ├── login/                    เข้าสู่ระบบ / สมัครสมาชิก
    └── auth/                     callback + หน้าแจ้ง error
```

## เรื่องที่ต้องระวังเวลาแก้โค้ด

**อย่าใช้ `getSession()` เพื่อตรวจสิทธิ์** — มันเชื่อ cookie ตรงๆ ซึ่งปลอมได้
ให้ใช้ `getUser()` เท่านั้น (ห่อไว้ใน `getCurrentUser()` ให้แล้ว) เพราะมันยืนยัน token กับ Supabase จริง

**ห้ามใส่โค้ดคั่นระหว่าง `createServerClient` กับ `getUser()` ใน middleware**
จะทำให้ผู้ใช้หลุดออกจากระบบแบบสุ่มและหาสาเหตุยากมาก

**เวลา redirect ใน middleware ต้องยกคุกกี้ไปด้วย** — ถ้าลืม token ที่เพิ่งรีเฟรชจะหายไป
กับ response ที่ถูกทิ้ง ดูฟังก์ชัน `redirectWithCookies` ใน `src/lib/supabase/middleware.ts`

**เรื่องเวลา** server ของ Vercel รันด้วย UTC ทุกหน้าที่เกี่ยวกับวันที่ต้องเรียกผ่าน
`getThaiToday()` ห้ามใช้ `new Date().getDay()` ตรงๆ ไม่งั้นช่วงเที่ยงคืนถึง 7 โมงเช้าจะได้วันผิด

**เรื่องการสุ่ม** ดวงราศีใช้ seed จาก (ราศี + ช่วงเวลา + คีย์วันที่) ที่คำนวณฝั่ง server
เพื่อไม่ให้เกิด hydration mismatch ส่วนเซียมซีกับไพ่ใช้ `Math.random()` ฝั่ง client
หลังผู้ใช้กดเท่านั้น จึงไม่กระทบการ render ครั้งแรก

## ความปลอดภัย

- รหัสผ่านไม่ถูกเก็บในโค้ดหรือฐานข้อมูลของเราเลย Supabase เป็นคนจัดการ hash ให้
- ตรวจสิทธิ์สองชั้น: middleware กันเส้นทาง + ทุกหน้าเรียก `getCurrentUser()` ซ้ำอีกรอบ
- session cookie จัดการโดย `@supabase/ssr` เป็น httpOnly
- กัน open redirect ทั้งที่พารามิเตอร์ `next` ของ Server Action และที่ `/auth/callback`
- rate limit การล็อกอินเป็นของ Supabase เอง ไม่ต้องทำเองแล้ว
