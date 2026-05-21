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
│   ├── register/
│   │
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   │
│   ├── ui/                         # shadcn/ui
│   ├── forms/
│   ├── tables/
│   ├── dialogs/
│   ├── cards/
│   └── layout/
│
├── server/
│   │
│   ├── models/
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
src/server/models
```

หน้าที่:
- schema
- database structure
- entity definition

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
components/forms/
```

ตัวอย่าง:

```txt
login-form.tsx
product-form.tsx
customer-form.tsx
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

Examples:

```txt
product-form.tsx
use-product.ts
ProductTable.tsx
```

---

# Coding Rules

## DO

- แยก logic ออกจาก component
- ใช้ reusable component
- แยก service layer
- validate ทุก input
- ใช้ TypeScript strict mode

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