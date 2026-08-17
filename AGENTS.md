# AGENT.md

# Project Overview

ERP Lite แบบ Monolith Web Application  
พัฒนาด้วย Next.js และใช้ MVC + Service Layer Architecture

Project Goals:

- อ่านโค้ดง่าย
- maintain ง่าย
- scale ได้
- reusable component
- แยก responsibility ชัดเจน

---

# Tech Stack

Frontend:
- Next.js
- React
- TypeScript
- TailwindCSS
- shadcn/ui
- TanStack Query
- React Hook Form
- Zod
- Zustand

Backend:
- Next.js Route Handler
- Prisma ORM
- SQLite

---

# Architecture

```txt
MVC + Service Layer
```

Flow:

```txt
User
 ↓
View (page.tsx)
 ↓
Controller (route.ts)
 ↓
Service
 ↓
Repository
 ↓
SQLite Database
```

---

# Folder Structure

```txt
src/
│
├── app/
│   │
│   ├── api/                         # Controller
│   │   ├── auth/
│   │   ├── products/
│   │   ├── orders/
│   │   └── customers/
│   │
│   ├── dashboard/
│   ├── products/
│   ├── orders/
│   ├── customers/
│   ├── login/
│   │   ├── _components/             # Page-specific components
│   │   │   └── login-form.tsx
│   │   └── page.tsx
│   ├── register/
│   │
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   │
│   ├── ui/                         # shadcn/ui│ 
│
├── server/
│   │
│   ├── repositories/
│   ├── services/
│   ├── validations/
│   └── helpers/
│
├── hooks/
├── stores/
├── lib/
├── types/
├── constants/
│
└── middleware.ts
```

---

# MVC Responsibility

## Model

อยู่ใน:

```txt
prisma/schema.prisma
```

หน้าที่:
- schema
- database structure
- entity definition
- ใช้ Prisma เป็น single source of truth

---

## View

อยู่ใน:

```txt
src/app
src/components
```

หน้าที่:
- UI
- form
- table
- dialog
- dashboard

---

## Controller

อยู่ใน:

```txt
src/app/api
```

หน้าที่:
- รับ request
- validate request
- เรียก service
- return response

---

# Database

ใช้:

```txt
SQLite + Prisma
```

Database File:

```txt
prisma/dev.db
```

---

# Prisma

schema:

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}
```

---

# UI Library

ใช้:

- shadcn/ui

Component Location:

```txt
src/components/ui
```

ตัวอย่าง:

```tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
```

---

# UI Design Rules

Design Style:
- Minimal
- Neutral
- Soft Contrast
- ERP Dashboard
- No Gradient

ห้าม:
- gradient
- neon color
- glassmorphism
- shadow หนัก
- สีสดเกิน

---

---

# Layout Rules

Sidebar:
- dark slate

Content:
- soft gray background

Card:
- white background

Spacing:
- gap-4
- gap-6

Shadow:
- shadow-sm
- shadow

---

# Form Rules

ใช้:
- react-hook-form
- zod
- shadcn form components

Form Location:

```txt
app/[page]/_components/   ← page-specific form
components/               ← shared form เท่านั้น
```

ตัวอย่าง:

```txt
app/login/_components/login-form.tsx
app/products/_components/product-form.tsx
app/customers/_components/customer-form.tsx
```

---

# Form Example

```tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
})

type FormData = z.infer<typeof formSchema>

export function ProductForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  const onSubmit = (data: FormData) => {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save Product</Button>
      </form>
    </Form>
  )
}
```

---

# Validation

ใช้:

```txt
Zod
```

ตัวอย่าง:

```ts
import { z } from "zod"

export const productSchema = z.object({
  name: z.string().min(1),
  price: z.number().min(1),
})
```

---

# API Convention

Response Format:

```ts
type ApiResponse<T> = {
  success: boolean
  message: string
  data?: T
}
```

Rules:
- validate ทุก request
- ห้าม return raw error
- route.ts ห้ามมี business logic หนัก

---

# Repository Rules

Repository มีหน้าที่:
- query database เท่านั้น

ห้าม:
- business logic

ตัวอย่าง:

```ts
import prisma from "@/lib/prisma"

export const productRepository = {
  async findAll() {
    return await prisma.product.findMany()
  },
}
```

---

# Service Rules

Service มีหน้าที่:
- business logic
- process data
- transaction
- workflow

ตัวอย่าง:

```ts
export const productService = {
  async createProduct(data: any) {
    return await productRepository.create(data)
  },
}
```

---

# Table Rules

ใช้:
- tanstack-table
- shadcn table

Features:
- pagination
- sorting
- search
- filter

Rules:
- debounce search 300ms
- loading skeleton
- reusable table component

---

# State Management

ใช้:

```txt
Zustand
```

ใช้เฉพาะ:
- global ui state
- sidebar state
- theme state
- auth user state

---

# Naming Convention

Files:
- kebab-case

Components:
- PascalCase

Hooks:
- useSomething

Database / Prisma Schema:
- Table names: `tbl_snake_case` (e.g., `tbl_user_account`)
- Field names: `snake_case` (e.g., `user_id`, `created_at`)

Examples:

```txt
product-form.tsx
use-product.ts
ProductTable.tsx
tbl_product
product_id
```

---

# Coding Rules

## DO

- แยก logic ออกจาก component
- ใช้ reusable component
- แยก service layer
- validate ทุก input
- ใช้ TypeScript strict mode
- ถ้าไม่ใช่ Sharing UI ให้สร้าง component ไว้ภายใต้ `_components` ของ page นั้นๆ

---

## DON'T

- query db ใน page.tsx
- business logic ใน route.ts
- ใช้ any มั่วๆ
- component ใหญ่เกิน
- duplicate code

---

# Authentication

ใช้:
- HttpOnly Cookie Session

Protected Routes:
- dashboard
- products
- orders
- customers
- inventory
- home/panel

Rules:
- check auth ใน middleware
- ห้ามเก็บ token ใน localStorage

---

# Loading State

ใช้:
- Skeleton

หลีกเลี่ยง:
- spinner เต็มจอนานๆ

---

# Git Convention

```txt
feat:
fix:
refactor:
style:
chore:
```

Examples:

```txt
feat: add product form
fix: pagination bug
refactor: split dashboard table
```

---

# Goal

ระบบต้อง:
- อ่านง่าย
- maintain ง่าย
- scale ได้
- reusable
- UI สบายตา
- เหมาะกับ ERP Lite
- เหมาะกับ Next.js Monolith

# Scope Discipline Rules

## หลักการสำคัญ: ทำเฉพาะที่ถูกขอเท่านั้น

###  ห้ามทำสิ่งเหล่านี้ หากไม่ได้รับคำสั่งโดยตรง

- ห้ามแก้ไขไฟล์ฝั่งหลังบ้าน (server/, api/, repositories/, services/, validations/) เว้นแต่ user สั่งชัดเจน
- ห้ามสร้างไฟล์ใหม่นอกเหนือจากที่ขอ
- ห้าม refactor โค้ดที่ไม่เกี่ยวกับ task ที่ได้รับ
- ห้ามเพิ่ม feature เพิ่มเติมที่ไม่ได้ถูกขอ แม้จะดูว่า "น่าจะดีถ้ามี"
- ห้ามแก้ไขหลายไฟล์พร้อมกันหาก task ระบุแค่ไฟล์เดียว

###  ให้ทำเฉพาะสิ่งที่ถูกขอ

- อ่าน request ให้ดีก่อน — ถ้าขอแค่ "เอา mock data ออก" ก็แก้แค่นั้น
- ถ้าไม่แน่ใจ scope ให้ถามก่อนลงมือเสมอ
- ถ้าพบว่า task ที่ขอต้องการ context จากไฟล์อื่น ให้แค่ "อ่าน" ไม่ใช่ "แก้"

### วิธีสั่ง AI ให้อยู่ใน scope

User สามารถใช้คำเหล่านี้เพื่อจำกัด scope ได้ชัดเจนขึ้น:
- `"แก้แค่ไฟล์นี้เท่านั้น"`
- `"ไม่ต้องยุ่งกับหลังบ้าน"`
- `"ทำเฉพาะ frontend"`
- `"แค่นี้พอ อย่าทำเพิ่ม"`