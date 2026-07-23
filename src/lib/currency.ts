/**
 * Currency utility functions
 *
 * Convention: ค่าที่เก็บใน DB จะเป็น integer (satang/cents)
 * เพื่อหลีกเลี่ยงปัญหา floating-point precision
 *
 * เช่น ราคา 99.99 บาท → เก็บเป็น 9999 satang
 */

/** แปลง บาท → satang (integer) เพื่อเก็บลง DB */
export function toCents(baht: number): number {
  return Math.round(baht * 100);
}

/** แปลง satang (integer) → บาท เพื่อแสดงผลหรือคำนวณ */
export function fromCents(cents: number): number {
  return cents / 100;
}

/** Format แสดงผลพร้อม currency symbol */
export function formatCurrency(
  cents: number,
  locale: string = "th-TH",
  currency: string = "THB"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(fromCents(cents));
}

/** Format แบบ compact ไม่มี symbol (เช่น "99.99") */
export function formatAmount(cents: number): string {
  return fromCents(cents).toFixed(2);
}
