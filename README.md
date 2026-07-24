# ERP Lite

ระบบ ERP Lite แบบ Monolith Web Application พัฒนาด้วย Next.js (App Router) และใช้ MVC + Service Layer Architecture

> **สถานะโครงการ: อยู่ระหว่างการพัฒนา (Work in Progress)**

---

## ภาพรวมสถานะระบบ (Project Status)

### ระบบยืนยันตัวตน (Authentication)
- [x] **Authentication System** - เสร็จแล้ว (Login, Register, HttpOnly Cookie Session)

---

## 6 โมดูลหลัก (Core Modules Status)

- [x] **1. Product (จัดการสินค้า)** - เสร็จแล้ว
- [ ] **2. Customer (จัดการลูกค้า)** - ยังไม่เสร็จ (กำลังพัฒนา)
- [ ] **3. Order (จัดการคำสั่งซื้อ)** - ยังไม่เสร็จ
- [ ] **4. Inventory (จัดการคลังสินค้า/สต๊อก)** - ยังไม่เสร็จ
- [ ] **5. Report (ระบบรายงาน)** - ยังไม่เสร็จ
- [ ] **6. Dashboard (ภาพรวมระบบ)** - ยังไม่เสร็จ

### ตารางสรุปสถานะโมดูล

| โมดูล (Module) | สถานะ (Status) | รายละเอียด (Progress) |
| :--- | :---: | :--- |
| **Product** | เสร็จแล้ว | CRUD สินค้า, ค้นหา, กรอง และจัดการข้อมูลสินค้า |
| **Customer** | ยังไม่เสร็จ | อยู่ระหว่างการพัฒนา |
| **Order** | ยังไม่เสร็จ | รอดำเนินการ |
| **Inventory** | ยังไม่เสร็จ | รอดำเนินการ |
| **Report** | ยังไม่เสร็จ | รอดำเนินการ |
| **Dashboard** | ยังไม่เสร็จ | รอดำเนินการ |

---

## Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript, TailwindCSS, shadcn/ui, TanStack Query, React Hook Form, Zod, Zustand
- **Backend:** Next.js Route Handler, Prisma ORM
- **Database:** SQLite (`prisma/dev.db`)

---

## Architecture

ใช้สถาปัตยกรรม **MVC + Service Layer Architecture**:

```txt
User -> View (page.tsx) -> Controller (route.ts) -> Service -> Repository -> SQLite Database
```

---

## Getting Started

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. เตรียม Database (Prisma)
```bash
npx prisma migrate dev
```

### 3. รัน Development Server
```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) บนบราวเซอร์เพื่อเริ่มต้นใช้งาน