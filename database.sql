-- =============================================================
-- Vedinc Website - Supabase Schema
-- -------------------------------------------------------------
-- Run this in the Supabase SQL editor (Project -> SQL -> New query)
-- to create every table the backend expects.
-- Re-runnable: uses IF NOT EXISTS / DROP-CASCADE-safe constructs.
-- =============================================================

-- ---- Extensions ------------------------------------------------
create extension if not exists "pgcrypto";  -- for gen_random_uuid()

-- ---- Enums -----------------------------------------------------
do $$ begin
  create type "UserRole" as enum ('USER', 'ADMIN', 'SUPER_ADMIN');
exception when duplicate_object then null; end $$;

do $$ begin
  create type "LessonType" as enum ('VIDEO', 'PDF');
exception when duplicate_object then null; end $$;

-- =============================================================
-- User
-- =============================================================
create table if not exists "User" (
  "id"            uuid        primary key default gen_random_uuid(),
  "name"          text        not null,
  "email"         text        not null unique,
  "phone"         text,
  "passwordHash"  text        not null,
  "role"          "UserRole"  not null default 'USER',
  "bio"           text,
  "title"         text,
  "avatar"        text,
  "createdAt"     timestamptz not null default now()
);

create index if not exists "User_role_idx" on "User"("role");

-- =============================================================
-- Category
-- =============================================================
create table if not exists "Category" (
  "id"        uuid        primary key default gen_random_uuid(),
  "name"      text        not null unique,
  "createdAt" timestamptz not null default now()
);

-- =============================================================
-- Course
-- =============================================================
create table if not exists "Course" (
  "id"           uuid        primary key default gen_random_uuid(),
  "title"        text        not null,
  "description"  text        not null,
  "price"        double precision not null,
  "thumbnail"    text,
  "instructorId" uuid        references "User"("id") on delete set null,
  "categoryId"   uuid        not null references "Category"("id"),
  "level"        text,
  "duration"     text,
  "createdAt"    timestamptz not null default now()
);

create index if not exists "Course_categoryId_idx"   on "Course"("categoryId");
create index if not exists "Course_instructorId_idx" on "Course"("instructorId");

-- =============================================================
-- CourseObjective
-- =============================================================
create table if not exists "CourseObjective" (
  "id"        uuid        primary key default gen_random_uuid(),
  "text"      text        not null,
  "courseId"  uuid        not null references "Course"("id") on delete cascade,
  "createdAt" timestamptz not null default now()
);

create index if not exists "CourseObjective_courseId_idx" on "CourseObjective"("courseId");

-- =============================================================
-- Module
-- =============================================================
create table if not exists "Module" (
  "id"        uuid        primary key default gen_random_uuid(),
  "title"     text        not null,
  "courseId"  uuid        not null references "Course"("id") on delete cascade,
  "createdAt" timestamptz not null default now()
);

create index if not exists "Module_courseId_idx" on "Module"("courseId");

-- =============================================================
-- Lesson
-- =============================================================
create table if not exists "Lesson" (
  "id"         uuid         primary key default gen_random_uuid(),
  "title"      text         not null,
  "type"       "LessonType" not null,
  "contentUrl" text,
  "duration"   text,
  "moduleId"   uuid         not null references "Module"("id") on delete cascade,
  "createdAt"  timestamptz  not null default now()
);

create index if not exists "Lesson_moduleId_idx" on "Lesson"("moduleId");

-- =============================================================
-- Enrollment
-- =============================================================
create table if not exists "Enrollment" (
  "id"        uuid        primary key default gen_random_uuid(),
  "userId"    uuid        not null references "User"("id")   on delete cascade,
  "courseId"  uuid        not null references "Course"("id") on delete cascade,
  "status"    text        not null default 'ACTIVE',
  "fullName"  text        not null,
  "email"     text        not null,
  "phone"     text        not null,
  "createdAt" timestamptz not null default now(),
  constraint "Enrollment_userId_courseId_key" unique ("userId", "courseId")
);

create index if not exists "Enrollment_userId_idx"   on "Enrollment"("userId");
create index if not exists "Enrollment_courseId_idx" on "Enrollment"("courseId");

-- =============================================================
-- Resource
-- =============================================================
create table if not exists "Resource" (
  "id"         uuid        primary key default gen_random_uuid(),
  "title"      text        not null,
  "fileUrl"    text        not null,
  "categoryId" uuid        not null references "Category"("id") on delete cascade,
  "createdAt"  timestamptz not null default now()
);

create index if not exists "Resource_categoryId_idx" on "Resource"("categoryId");

-- =============================================================
-- Storage buckets (run once)
-- -------------------------------------------------------------
-- The app uploads to two buckets: pdf-courses and instructor-avatars.
-- These statements are commented because bucket creation must be
-- done via the Supabase dashboard OR with service-role permissions.
-- Create them manually in: Storage -> New bucket.
--
--   1. pdf-courses        (Public OFF if you want signed URLs only)
--   2. instructor-avatars (Public ON - served as public URLs)
-- =============================================================
