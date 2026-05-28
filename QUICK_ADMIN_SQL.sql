-- ============================================================
-- QUICK SQL COMMANDS FOR SUPABASE
-- ============================================================
-- Copy and paste these into Supabase SQL Editor

-- 1. Convert bharath.reddy3297@gmail.com to ADMIN (run this first)
UPDATE "User"
SET "role" = 'ADMIN'
WHERE "email" = 'bharath.reddy3297@gmail.com';

-- 2. Verify the change worked
SELECT "id", "name", "email", "role", "createdAt"
FROM "User"
WHERE "email" = 'bharath.reddy3297@gmail.com';

-- 3. View all admin users
SELECT "id", "name", "email", "role", "createdAt"
FROM "User"
WHERE "role" IN ('ADMIN', 'SUPER_ADMIN')
ORDER BY "createdAt" DESC;

-- ============================================================
-- IF YOU WANT TO MAKE THEM SUPER_ADMIN INSTEAD:
-- ============================================================
-- UPDATE "User"
-- SET "role" = 'SUPER_ADMIN'
-- WHERE "email" = 'bharath.reddy3297@gmail.com';

-- ============================================================
-- STORAGE BUCKETS SETUP (create manually in Supabase Dashboard)
-- ============================================================
-- Go to Storage → New bucket → Create two buckets:
-- 1. pdf-courses (for lesson PDFs)
-- 2. instructor-avatars (for profile pictures)
-- Both public so files can be accessed
