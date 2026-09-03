/**
 * ลายไอคอนแอป ใช้ร่วมกันทุกขนาด
 *
 * วาดด้วย div ล้วน ไม่ใช้ตัวอักษรหรืออีโมจิ เพราะ ImageResponse เรนเดอร์ด้วย satori
 * ซึ่งต้องโหลดฟอนต์เองถ้ามีตัวอักษร ถ้าไม่มีฟอนต์ภาษาไทยจะกลายเป็นสี่เหลี่ยมว่าง
 * ลายนี้เป็นลูกแก้วพยากรณ์: วงกลมขาวบนพื้นไล่สีชมพู-ม่วง มีแกนกลางไล่สีม่วง-ฟ้า
 */
export function AppIconArt() {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #FF9EC4 0%, #B98CF0 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "62%",
          height: "62%",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.93)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "48%",
            height: "48%",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #A98FEE 0%, #6FB3E8 100%)",
          }}
        />
      </div>
    </div>
  );
}
