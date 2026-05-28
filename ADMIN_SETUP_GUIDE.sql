-- =============================================================
-- ADMIN USER MANAGEMENT & LOGIN GUIDE
-- =============================================================
-- This file contains all SQL queries needed to set up and manage
-- admin users in Supabase. Copy these queries and run them in your
-- Supabase SQL editor one by one.
-- =============================================================

-- =============================================================
-- PART 1: UNDERSTAND THE ADMIN SYSTEM
-- =============================================================
/*
THREE ROLE LEVELS (in /lib/types.ts):
  1. USER (default role for all new signups)
     - Can enroll in courses
     - Can view their profile
     - Cannot create/edit courses

  2. ADMIN
     - Can create, edit, delete courses
     - Can create, edit, delete modules and lessons
     - Can create categories
     - Can upload PDFs and images
     - Can view all enrollments
     - Cannot manage users or delete other enrollments (limited)

  3. SUPER_ADMIN
     - Can do EVERYTHING
     - Can manage admin users (create, delete)
     - Can change user roles
     - Can delete enrollments
     - Full system access

LOGIN FLOW (same for all roles):
  1. User enters email & password
  2. API endpoint: POST /api/auth?action=login
  3. System checks User table for matching email
  4. Compares password hash using bcrypt
  5. If valid: returns JWT token with role (USER/ADMIN/SUPER_ADMIN)
  6. Frontend stores token in localStorage
  7. All API calls include token in Authorization header
  8. Backend verifies token and checks role for permissions
*/

-- =============================================================
-- PART 2: CONVERT EXISTING USER TO ADMIN
-- =============================================================
-- Run this query to convert bharath.reddy3297@gmail.com to ADMIN:

UPDATE "User"
SET "role" = 'ADMIN'
WHERE "email" = 'bharath.reddy3297@gmail.com';

-- Verify the change:
SELECT "id", "name", "email", "role", "createdAt"
FROM "User"
WHERE "email" = 'bharath.reddy3297@gmail.com';

-- =============================================================
-- PART 3: CREATE ADDITIONAL ADMINS (if needed)
-- =============================================================
-- First, create a user account via signup, then convert to ADMIN:

UPDATE "User"
SET "role" = 'ADMIN'
WHERE "email" = 'another.admin@example.com';

-- =============================================================
-- PART 4: CREATE SUPER_ADMIN (highest privilege)
-- =============================================================
-- Make someone a SUPER_ADMIN (can manage other admins):

UPDATE "User"
SET "role" = 'SUPER_ADMIN'
WHERE "email" = 'bharath.reddy3297@gmail.com';

-- =============================================================
-- PART 5: VIEW ALL ADMIN USERS
-- =============================================================
-- List all admins and super admins:

SELECT "id", "name", "email", "role", "createdAt"
FROM "User"
WHERE "role" IN ('ADMIN', 'SUPER_ADMIN')
ORDER BY "role" DESC, "createdAt" ASC;

-- =============================================================
-- PART 6: VIEW ALL USERS WITH THEIR ROLES
-- =============================================================
SELECT "id", "name", "email", "role", "createdAt"
FROM "User"
ORDER BY "role", "createdAt" DESC;

-- =============================================================
-- PART 7: ADMIN FEATURES & WHAT THEY CAN DO
-- =============================================================
/*
ADMIN CAN DO:

1. COURSE MANAGEMENT
   - Create courses: POST /api/courses
   - Edit courses: PUT /api/courses/{id}
   - Delete courses: DELETE /api/courses/{id}
   - Upload course thumbnails

2. CATEGORIES
   - Create categories: POST /api/categories
   - Delete categories: DELETE /api/categories/{id}

3. MODULES & LESSONS
   - Create modules: POST /api/modules
   - Delete modules: DELETE /api/modules/{id}
   - Create lessons with PDF: POST /api/lessons
   - Delete lessons: DELETE /api/lessons/{id}

4. INSTRUCTORS
   - Create instructors: POST /api/instructor
   - Edit instructors: PUT /api/instructor/{id}
   - Delete instructors: DELETE /api/instructor/{id}
   - Upload instructor avatars

5. VIEW ENROLLMENTS
   - See all course enrollments

ADMIN CANNOT DO:
   - Delete users
   - Delete enrollments
   - Create other admins
   - Change user roles
*/

-- =============================================================
-- PART 8: SUPER_ADMIN EXCLUSIVE FEATURES
-- =============================================================
/*
SUPER_ADMIN CAN DO EVERYTHING THAT ADMINS CAN DO, PLUS:

1. USER MANAGEMENT
   - Create admin users: POST /api/admin/create-admin
   - View all users: GET /api/admin/users
   - Change user roles: PATCH /api/admin/users/{id}/role
   - Delete users: DELETE /api/admin/users/{id}

2. ENROLLMENT MANAGEMENT
   - Delete any enrollment: DELETE /api/enrollments/{id}

3. FULL SYSTEM ACCESS
   - All admin features
   - All user management features
*/

-- =============================================================
-- PART 9: LOGIN PROCESS FOR ADMINS
-- =============================================================
/*
ADMIN LOGIN STEPS (identical to regular user):

1. Admin navigates to Login page
2. Enters email: bharath.reddy3297@gmail.com
3. Enters password: (same password they used to sign up)
4. Clicks Login
5. System sends: POST /api/auth?action=login
   {
     "email": "bharath.reddy3297@gmail.com",
     "password": "their-password"
   }
6. API validates password and returns:
   {
     "message": "Login successful",
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": {
       "id": "uuid",
       "name": "Bharath",
       "email": "bharath.reddy3297@gmail.com",
       "role": "ADMIN"
     }
   }
7. Frontend stores token in localStorage
8. Frontend redirects to /admin dashboard
9. Admin can now access all admin features

NO SEPARATE ADMIN LOGIN - same login page for all users!
The role determines what features they can access.
*/

-- =============================================================
-- PART 10: RESET PASSWORD (if needed)
-- =============================================================
/*
If an admin forgets their password, they cannot use /api/auth/signup
because email is unique. Options:

1. Create new user account with different email (RECOMMENDED)
2. Delete the user (SQL below) and recreate

TO DELETE A USER (CAUTION: removes all related data):
*/

DELETE FROM "User"
WHERE "email" = 'bharath.reddy3297@gmail.com';

-- This will cascade-delete all their enrollments, courses they created, etc.

-- =============================================================
-- PART 11: ENABLE TWO-FACTOR AUTHENTICATION (future feature)
-- =============================================================
/*
Currently NOT implemented. To add 2FA in future:
- Add "twoFactorSecret" and "twoFactorEnabled" columns to User table
- Generate TOTP secret on admin request
- Verify code before issuing JWT token
*/

-- =============================================================
-- PART 12: AUDIT LOG (for tracking admin actions - optional)
-- =============================================================
/*
Currently NOT tracked. To add audit logging:
*/

CREATE TABLE IF NOT EXISTS "AuditLog" (
  "id"        uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  "adminId"   uuid        NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "action"    text        NOT NULL,
  "entityType" text       NOT NULL,
  "entityId"  uuid,
  "oldValue"  jsonb,
  "newValue"  jsonb,
  "timestamp" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "AuditLog_adminId_idx" ON "AuditLog"("adminId");
CREATE INDEX IF NOT EXISTS "AuditLog_timestamp_idx" ON "AuditLog"("timestamp");

-- Example: Insert audit log entry (replace UUIDs with real ones)
-- INSERT INTO "AuditLog" ("adminId", "action", "entityType", "entityId", "newValue")
-- VALUES (
--   (SELECT "id" FROM "User" WHERE "email" = 'bharath.reddy3297@gmail.com'),
--   'CREATE',
--   'Course',
--   'actual-course-uuid',
--   '{"title": "Python Basics", "price": 99.99}'::jsonb
-- );

-- =============================================================
-- SUMMARY: STEPS TO DEPLOY
-- =============================================================
/*
1. Run these SQL queries in Supabase SQL Editor:
   - Query to convert user to ADMIN (Part 2)
   - Any storage bucket setup (Part with storage buckets comment)

2. Test login:
   - Use email: bharath.reddy3297@gmail.com
   - Use password: same password from signup
   - Should see admin dashboard after login

3. Start creating content:
   - Create categories
   - Create courses
   - Create modules and lessons
   - Upload PDFs for lessons
   - Create instructor profiles

All done! Admin is ready to use the system.
*/
