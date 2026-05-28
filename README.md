# Vedinc Website

Unified full-stack project — Express + Supabase backend and Vite + React frontend, both run with a single command.

---

## Project Layout

```
Vedinc-Website/
├── package.json              # Root - orchestrates both apps
├── .env                      # SINGLE env file (shared by both)
├── .env.example              # Template
├── database.sql              # Schema - run this in Supabase SQL editor
├── vedinc-backend/           # Express API (uses @supabase/supabase-js)
└── vedinc-launchpad-main/    # Vite + React frontend
```

A single `.env` at the repo root is read by **both** apps:

- Backend loads it via `dotenv` from `vedinc-backend/src/config/env.ts`.
- Frontend Vite loads it via `envDir: '..'` in `vite.config.ts`.

---

## Prerequisites

- Node.js 18+
- A Supabase project

---

## Setup

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Create the `.env` file

```bash
cp .env.example .env
```

Fill in:

- `SUPABASE_URL` — your project URL (Project Settings → API)
- `SUPABASE_SERVICE_ROLE_KEY` — service-role secret (Project Settings → API). **Server-only.**
- `JWT_SECRET` — any long random string
- (Optional) `EMAIL_USER`, `EMAIL_PASS`, `ADMIN_EMAIL` for Nodemailer
- `VITE_API_URL` — keep as `http://localhost:5000/api` for local dev

### 3. Create the database schema in Supabase

Open the Supabase dashboard → **SQL editor** → **New query** → paste the contents of [database.sql](database.sql) → **Run**.

This creates all tables (`User`, `Category`, `Course`, `CourseObjective`, `Module`, `Lesson`, `Enrollment`, `Resource`), the `UserRole` / `LessonType` enums, FKs and indexes.

### 4. Create storage buckets (one-time)

In the Supabase dashboard → **Storage** → **New bucket**:

- `pdf-courses` — for lesson PDFs
- `instructor-avatars` — for instructor profile photos (set Public ON)

### 5. (Optional) Seed default users

```bash
npm run seed
```

Creates a super admin (`admin@vedinc.in` / `admin123`) and a test user (`user@vedinc.in` / `user@123`).

---

## Run

Backend (port 5000) and frontend (port 8080) together:

```bash
npm run dev
```

Or individually:

```bash
npm run dev:backend
npm run dev:frontend
```

---

## Build

```bash
npm run build
```

---

## Notes

- The backend uses `@supabase/supabase-js` with the service-role key for all DB and Storage access — no Prisma, no direct Postgres connection.
- The backend serves uploaded files from `vedinc-backend/uploads/` (local-only; gitignored).
- Backend CORS already allows `FRONTEND_URL` (default `http://localhost:8080`).
