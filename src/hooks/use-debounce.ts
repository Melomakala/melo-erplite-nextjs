import { useState, useEffect } from "react";

/**
 * Debounce ค่าที่ส่งเข้ามา — จะ update เฉพาะหลังจากที่ค่าหยุดเปลี่ยนเป็นเวลา `delay` ms
 * @param value ค่าที่ต้องการ debounce
 * @param delay หน่วงเวลากี่ ms (default: 300)
 * @returns ค่าที่ถูก debounce แล้ว
 *
 * @example
 * const debouncedSearch = useDebounce(searchQuery, 300);
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}
