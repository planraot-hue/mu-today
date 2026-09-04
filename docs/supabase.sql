-- ============================================================
-- มูทูเดย์ · สคริปต์ตั้งค่า Supabase
--
-- วิธีใช้: เปิด Supabase > SQL Editor > New query > วางทั้งไฟล์นี้ > Run
-- รันซ้ำได้ปลอดภัย ทุกคำสั่งเป็นแบบ if not exists / or replace
--
-- ระบบเข้าสู่ระบบไม่ต้องรันอะไรเลย Supabase Auth มีตารางของตัวเองอยู่แล้ว
-- ไฟล์นี้มีไว้สำหรับแท็บ "มาแรง" ที่นับยอดคลิกฟีเจอร์เท่านั้น
-- ถ้าไม่รัน เว็บยังใช้ได้ครบทุกอย่าง แค่แท็บมาแรงจะไม่ขึ้น
-- ============================================================


-- ------------------------------------------------------------
-- ตารางยอดคลิกฟีเจอร์
--
-- feature_id ตรงกับ id ใน src/lib/features.ts
-- เก็บเป็นยอดรวมอย่างเดียว ไม่เก็บว่าใครคลิก จึงไม่มีข้อมูลส่วนตัวในตารางนี้
-- ------------------------------------------------------------

create table if not exists public.feature_clicks (
  feature_id text primary key,
  clicks bigint not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.feature_clicks enable row level security;


-- ------------------------------------------------------------
-- สิทธิ์
--
-- อ่านได้ทุกคน เพราะเป็นตัวเลขรวมที่เว็บเอาไปโชว์อยู่แล้ว
-- แต่ **ไม่เปิด insert/update ตรงๆ** ให้เพิ่มยอดผ่านฟังก์ชันข้างล่างเท่านั้น
-- ถ้าเปิดให้ anon เขียนตารางได้ ใครก็ตั้งยอดเป็นเท่าไหร่ก็ได้ในคำสั่งเดียว
-- ------------------------------------------------------------

drop policy if exists "อ่านยอดคลิกได้ทุกคน" on public.feature_clicks;

create policy "อ่านยอดคลิกได้ทุกคน"
  on public.feature_clicks
  for select
  to anon, authenticated
  using (true);


-- ------------------------------------------------------------
-- ฟังก์ชันเพิ่มยอด
--
-- security definer = รันด้วยสิทธิ์เจ้าของฟังก์ชัน จึงข้าม RLS เขียนตารางได้
-- แต่เขียนได้อย่างเดียวคือ "บวกหนึ่ง" ให้ feature_id ที่ส่งมา
-- ที่แย่ที่สุดที่คนยิง API ตรงๆ ทำได้จึงคือปั่นยอดทีละหนึ่ง ไม่ใช่ตั้งค่าตามใจ
--
-- set search_path = public ปิดช่องโหว่คลาสสิกของ security definer
-- ที่ผู้เรียกสลับ search_path ไปชี้ตารางปลอมของตัวเอง
-- ------------------------------------------------------------

create or replace function public.bump_feature_click(p_feature_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- กันข้อมูลขยะ: id ยาวผิดปกติแปลว่าไม่ได้มาจากเว็บเรา
  if p_feature_id is null or length(p_feature_id) > 40 then
    return;
  end if;

  insert into public.feature_clicks as fc (feature_id, clicks, updated_at)
  values (p_feature_id, 1, now())
  on conflict (feature_id) do update
    set clicks = fc.clicks + 1,
        updated_at = now();
end;
$$;

grant execute on function public.bump_feature_click(text) to anon, authenticated;


-- ------------------------------------------------------------
-- คำสั่งที่อาจได้ใช้ทีหลัง
-- ------------------------------------------------------------

-- ดูยอดปัจจุบัน
-- select * from public.feature_clicks order by clicks desc;

-- ล้างยอดเริ่มนับใหม่
-- truncate public.feature_clicks;
