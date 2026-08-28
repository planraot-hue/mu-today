import {
  getChineseProfile,
  getClashAnimal,
  type ChineseAnimal,
} from "@/lib/chinese";
import { getDayProfile, getWeekdayOf, type BirthDate } from "@/lib/birth";
import { getZodiacByDate, type Zodiac } from "@/lib/zodiac";
import { THAI_DAY_NAMES } from "@/lib/thai-date";

/**
 * ดวงสมพงศ์คู่รัก
 *
 * คะแนนรวมมาจาก 3 ด้านที่คนไทยนิยมดูกัน ถ่วงน้ำหนักต่างกันตามความสำคัญ
 * ทุกอย่างคำนวณจากวันเกิดล้วนๆ ไม่มีการสุ่ม คู่เดิมจึงได้ผลเดิมเสมอ
 */

export type CompatAspect = {
  key: string;
  title: string;
  emoji: string;
  /** 0–100 */
  score: number;
  headline: string;
  detail: string;
};

export type CompatResult = {
  totalScore: number;
  level: string;
  levelEmoji: string;
  summary: string;
  aspects: CompatAspect[];
  advice: string;
};

/* ---------------- ด้านที่ 1: วันเกิด ---------------- */

/**
 * คู่ธาตุตามวันเกิดแบบไทย ใช้ matchDays ที่ระบุไว้ในโปรไฟล์แต่ละวัน
 * ถ้าอยู่ในลิสต์ของกันและกันถือว่าเข้ากันมาก
 */
function scoreByDay(a: BirthDate, b: BirthDate): CompatAspect {
  const dayA = getWeekdayOf(a);
  const dayB = getWeekdayOf(b);
  const profileA = getDayProfile(dayA);
  const profileB = getDayProfile(dayB);

  const aLikesB = profileA.matchDays.includes(dayB);
  const bLikesA = profileB.matchDays.includes(dayA);

  let score: number;
  let headline: string;
  let detail: string;

  if (aLikesB && bLikesA) {
    score = 95;
    headline = "ถูกโฉลกกันทั้งสองฝ่าย";
    detail = `คนเกิดวัน${THAI_DAY_NAMES[dayA]}กับวัน${THAI_DAY_NAMES[dayB]}เข้ากันได้ดีมากตามตำราไทย ต่างฝ่ายต่างเติมเต็มสิ่งที่อีกคนขาด อยู่ด้วยกันแล้วสบายใจโดยไม่ต้องพยายาม`;
  } else if (aLikesB || bLikesA) {
    score = 78;
    headline = "เข้ากันได้ดี ฝ่ายหนึ่งเป็นคนเติม";
    detail = `มีฝ่ายหนึ่งที่ปรับเข้าหาอีกฝ่ายได้ง่ายกว่า ความสัมพันธ์จะราบรื่นถ้าอีกคนรู้ตัวและตอบแทนความใส่ใจนั้นกลับไปบ้าง`;
  } else if (dayA === dayB) {
    score = 70;
    headline = "วันเกิดเดียวกัน เข้าใจกันง่าย";
    detail = `เกิดวัน${THAI_DAY_NAMES[dayA]}เหมือนกัน นิสัยจึงคล้ายกันมาก เข้าใจกันง่ายแต่ก็มีจุดอ่อนชุดเดียวกัน ต้องช่วยกันเตือนในเรื่องที่ทั้งคู่พลาดเหมือนกัน`;
  } else {
    score = 58;
    headline = "ต่างกันพอสมควร ต้องปรับเข้าหากัน";
    detail = `คนเกิดวัน${THAI_DAY_NAMES[dayA]}กับวัน${THAI_DAY_NAMES[dayB]}มองโลกคนละมุม ไม่ได้แปลว่าไปด้วยกันไม่ได้ แต่ต้องคุยกันเยอะกว่าคู่อื่นเพื่อไม่ให้เข้าใจผิด`;
  }

  return { key: "day", title: "วันเกิด", emoji: "📅", score, headline, detail };
}

/* ---------------- ด้านที่ 2: ราศีและธาตุ ---------------- */

const ELEMENT_FRIENDS: Record<Zodiac["element"], Zodiac["element"][]> = {
  "ไฟ": ["ไฟ", "ลม"],
  "ลม": ["ลม", "ไฟ"],
  "ดิน": ["ดิน", "น้ำ"],
  "น้ำ": ["น้ำ", "ดิน"],
};

function scoreByZodiac(a: BirthDate, b: BirthDate): CompatAspect {
  const zodiacA = getZodiacByDate(a.month, a.day);
  const zodiacB = getZodiacByDate(b.month, b.day);

  const sameSign = zodiacA.id === zodiacB.id;
  const friendly = ELEMENT_FRIENDS[zodiacA.element].includes(zodiacB.element);

  let score: number;
  let headline: string;
  let detail: string;

  if (sameSign) {
    score = 80;
    headline = "ราศีเดียวกัน เหมือนส่องกระจก";
    detail = `ทั้งคู่เป็นราศี${zodiacA.name}เหมือนกัน จึงเข้าใจความต้องการของกันและกันโดยไม่ต้องอธิบาย แต่ก็เจอปัญหาแบบเดียวกันพร้อมกันด้วย`;
  } else if (friendly) {
    score = 88;
    headline = `ธาตุ${zodiacA.element}กับธาตุ${zodiacB.element}ส่งเสริมกัน`;
    detail = `ราศี${zodiacA.name} (ธาตุ${zodiacA.element}) กับราศี${zodiacB.name} (ธาตุ${zodiacB.element}) เป็นธาตุที่หนุนกัน อยู่ด้วยกันแล้วต่างฝ่ายต่างได้พลังงานเพิ่ม ไม่ใช่ถูกดูดพลัง`;
  } else {
    score = 62;
    headline = `ธาตุ${zodiacA.element}กับธาตุ${zodiacB.element}ต่างขั้ว`;
    detail = `ราศี${zodiacA.name}กับราศี${zodiacB.name}มีจังหวะชีวิตต่างกัน ฝ่ายหนึ่งเร็วอีกฝ่ายช้า ถ้ายอมรับความต่างนี้ได้จะกลายเป็นคู่ที่เติมเต็มกันได้ดีมาก`;
  }

  return {
    key: "zodiac",
    title: "ราศีและธาตุ",
    emoji: "♈",
    score,
    headline,
    detail,
  };
}

/* ---------------- ด้านที่ 3: นักษัตรจีน ---------------- */

function scoreByChinese(a: BirthDate, b: BirthDate): CompatAspect {
  const animalA = getChineseProfile(a.year, a.month, a.day).animal;
  const animalB = getChineseProfile(b.year, b.month, b.day).animal;

  const clashOfA: ChineseAnimal = getClashAnimal(animalA);
  const isTriad = animalA.bestMatch.includes(animalB.index);
  const isClash = clashOfA.index === animalB.index;

  let score: number;
  let headline: string;
  let detail: string;

  if (isTriad) {
    score = 95;
    headline = "สามฮะ ถูกโฉลกกันที่สุด";
    detail = `ปี${animalA.name} (${animalA.animal}) กับปี${animalB.name} (${animalB.animal}) อยู่ในกลุ่มสามฮะเดียวกัน ตำราจีนถือว่าเป็นคู่ที่ส่งเสริมกันมากที่สุด ช่วยกันแล้วเจริญทั้งคู่`;
  } else if (isClash) {
    score = 45;
    headline = "ชงกันตามตำราจีน";
    detail = `ปี${animalA.name}กับปี${animalB.name}เป็นคู่ที่ชงกัน มักเห็นไม่ตรงกันในเรื่องสำคัญ ไม่ได้แปลว่าอยู่ด้วยกันไม่ได้ แต่ต้องใช้ความเข้าใจมากกว่าคู่อื่น และควรหลีกเลี่ยงการเอาชนะกัน`;
  } else if (animalA.index === animalB.index) {
    score = 72;
    headline = "นักษัตรเดียวกัน";
    detail = `เกิดปี${animalA.name}เหมือนกัน นิสัยคล้ายจนเข้าใจกันเร็ว แต่ก็แข่งกันเองได้ง่ายเพราะอยากได้อยากเป็นเหมือนกัน`;
  } else {
    score = 74;
    headline = "เข้ากันได้ตามปกติ";
    detail = `ปี${animalA.name}กับปี${animalB.name}ไม่ได้ถูกโฉลกเป็นพิเศษและไม่ได้ชงกัน ถือเป็นคู่ที่ไปกันได้เรื่อยๆ ขึ้นอยู่กับการปรับตัวของทั้งสองฝ่ายมากกว่าดวง`;
  }

  return {
    key: "chinese",
    title: "นักษัตรจีน",
    emoji: "🧧",
    score,
    headline,
    detail,
  };
}

/* ---------------- รวมคะแนน ---------------- */

const LEVELS: { min: number; level: string; emoji: string; summary: string }[] =
  [
    {
      min: 90,
      level: "เนื้อคู่กันแท้",
      emoji: "💖",
      summary:
        "คู่นี้ส่งเสริมกันแทบทุกด้าน อยู่ด้วยกันแล้วต่างฝ่ายต่างดีขึ้น เป็นคู่ที่คนรอบข้างมองแล้วอยากมีบ้าง",
    },
    {
      min: 80,
      level: "เข้ากันได้ดีมาก",
      emoji: "💕",
      summary:
        "พื้นฐานดวงหนุนกันดี มีบางจุดที่ต่างกันแต่เป็นความต่างที่เติมเต็มมากกว่าจะขัดกัน",
    },
    {
      min: 70,
      level: "ไปกันได้ดี",
      emoji: "💗",
      summary:
        "เข้ากันได้ในระดับที่ดี มีเรื่องต้องปรับบ้างแต่ไม่ใช่เรื่องใหญ่ ถ้าคุยกันตรงๆ จะไปได้ไกล",
    },
    {
      min: 60,
      level: "ต้องปรับเข้าหากัน",
      emoji: "💛",
      summary:
        "มีทั้งจุดที่หนุนและจุดที่ขัดกัน ความสัมพันธ์จะดีได้ถ้าทั้งคู่ยอมปรับ ไม่ใช่รอให้อีกฝ่ายเปลี่ยนคนเดียว",
    },
    {
      min: 0,
      level: "ท้าทายแต่ไม่ใช่ไปไม่ได้",
      emoji: "🤍",
      summary:
        "ดวงบอกว่าคู่นี้ต้องใช้ความเข้าใจมากกว่าคู่ทั่วไป แต่ดวงเป็นแค่ส่วนหนึ่ง ความตั้งใจของทั้งสองคนสำคัญกว่ามาก",
    },
  ];

const ADVICES = [
  "คุยกันเรื่องเล็กๆ ทุกวันดีกว่าเก็บไว้คุยทีเดียวตอนมีปัญหา",
  "ชมกันบ่อยๆ คำชมเล็กน้อยรักษาความสัมพันธ์ได้มากกว่าที่คิด",
  "ให้พื้นที่ส่วนตัวกันบ้าง การมีเวลาของตัวเองไม่ได้แปลว่าห่างกัน",
  "เวลาทะเลาะให้พักก่อนแล้วค่อยคุย อย่าตัดสินใจอะไรตอนกำลังโมโห",
  "ทำอะไรใหม่ด้วยกันปีละหลายๆ ครั้ง ความทรงจำใหม่ช่วยต่ออายุความสัมพันธ์",
];

export function getCompatibility(
  personA: BirthDate,
  personB: BirthDate,
): CompatResult {
  const aspects = [
    scoreByDay(personA, personB),
    scoreByZodiac(personA, personB),
    scoreByChinese(personA, personB),
  ];

  // ถ่วงน้ำหนัก: วันเกิด 40% ราศี 35% นักษัตร 25%
  const weights = [0.4, 0.35, 0.25];
  const totalScore = Math.round(
    aspects.reduce((sum, aspect, index) => sum + aspect.score * weights[index], 0),
  );

  const level = LEVELS.find((item) => totalScore >= item.min) ?? LEVELS[LEVELS.length - 1];

  return {
    totalScore,
    level: level.level,
    levelEmoji: level.emoji,
    summary: level.summary,
    aspects,
    // เลือกคำแนะนำจากคะแนน ไม่ใช่สุ่ม คู่เดิมจะได้คำแนะนำเดิมเสมอ
    advice: ADVICES[totalScore % ADVICES.length],
  };
}
