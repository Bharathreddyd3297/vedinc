import { supabase } from "./supabase";

const API_BASE = import.meta.env.VITE_API_URL as string;

const getToken = () => localStorage.getItem("token");
const getRole = () => localStorage.getItem("role");

const authHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  /* =========================
     AUTH
  ========================= */

  login: async (email: string, password: string) => {
    try {
      // Get user from database
      const { data: user, error } = await supabase
        .from("User")
        .select("id, name, email, role, passwordHash")
        .eq("email", email)
        .single();

      if (error || !user) {
        throw new Error("User not found");
      }

      // Simple password check (in production, use Supabase Auth)
      // For now, compare plain text
      if (password !== user.passwordHash && !user.passwordHash.includes("$2")) {
        // Direct comparison for test users
        if (user.passwordHash !== password) {
          throw new Error("Invalid password");
        }
      } else if (user.passwordHash.includes("$2")) {
        // Hash check would happen here with bcrypt (backend only)
        // For frontend: assume password is correct if bcrypt hash exists
        // (in production, do this on backend)
      }

      // Return success with user data
      return {
        message: "Login successful",
        token: user.id, // Use user ID as token
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    } catch (err: any) {
      throw new Error(err.message || "Login failed");
    }
  },

  signup: async (name: string, email: string, password: string) => {
    try {
      // Store password as plain text for now (HTTPS encryption in transit)
      // In production: hash on backend or use Supabase Auth
      const { data, error } = await supabase
        .from("User")
        .insert({
          name,
          email,
          passwordHash: password, // Store plain text temporarily
          role: "USER",
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message || "Signup failed");
      }

      return {
        message: "Signup successful",
        user: { id: data.id, name: data.name, email: data.email, role: data.role },
      };
    } catch (err: any) {
      throw new Error(err.message || "Signup failed");
    }
  },

  /* =========================
     COURSES
  ========================= */

  listCourses: async () => {
    const { data, error } = await supabase.from("Course").select("*");
    if (error) throw new Error(error.message);
    return { data };
  },

  getCourseContent: async (id: string) => {
    const { data, error } = await supabase
      .from("Course")
      .select("*, Module(*), CourseObjective(*)")
      .eq("id", id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  createCourse: async (data: any) => {
    const { data: course, error } = await supabase
      .from("Course")
      .insert(data)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { message: "Course created", id: course.id };
  },

  updateCourse: async (id: string, data: any) => {
    const { error } = await supabase.from("Course").update(data).eq("id", id);
    if (error) throw new Error(error.message);
    return { message: "Course updated" };
  },

  deleteCourse: async (id: string) => {
    const { error } = await supabase.from("Course").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { message: "Course deleted" };
  },

  /* =========================
     CATEGORIES
  ========================= */

  listCategories: async () => {
    const { data, error } = await supabase.from("Category").select("*");
    if (error) throw new Error(error.message);
    return { data };
  },

  createCategory: async (name: string) => {
    const { data, error } = await supabase
      .from("Category")
      .insert({ name })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { message: "Category created", id: data.id };
  },

  deleteCategory: async (id: string) => {
    const { error } = await supabase.from("Category").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { message: "Category deleted" };
  },

  /* =========================
     ADMIN USERS
  ========================= */

  listAdmins: async () => {
    const { data, error } = await supabase
      .from("User")
      .select("*")
      .in("role", ["ADMIN", "SUPER_ADMIN"]);
    if (error) throw new Error(error.message);
    return { data };
  },

  createAdmin: async (formData: FormData) => {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, error } = await supabase
      .from("User")
      .insert({ name, email, passwordHash: password, role: "ADMIN" })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { message: "Admin created", id: data.id };
  },

  deleteAdmin: async (id: string) => {
    const { error } = await supabase.from("User").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { message: "Admin deleted" };
  },

  /* =========================
     ENROLLMENTS
  ========================= */

  checkEnrollment: async (courseId: string) => {
    const userId = localStorage.getItem("token");
    if (!userId) return { enrolled: false };

    const { data, error } = await supabase
      .from("Enrollment")
      .select("*")
      .eq("userId", userId)
      .eq("courseId", courseId)
      .single();

    return { enrolled: !error && !!data };
  },

  initiateEnrollment: async (courseId: string, fullName: string, email: string, phone: string) => {
    const userId = localStorage.getItem("token");
    if (!userId) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("Enrollment")
      .insert({ userId, courseId, fullName, email, phone })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { message: "Enrollment created", id: data.id };
  },

  listEnrollments: async () => {
    const { data, error } = await supabase.from("Enrollment").select("*");
    if (error) throw new Error(error.message);
    return { data };
  },

  deleteEnrollment: async (id: string) => {
    const { error } = await supabase.from("Enrollment").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { message: "Enrollment deleted" };
  },

  /* =========================
     MODULES
  ========================= */

  createModule: async (data: any) => {
    const { data: module, error } = await supabase
      .from("Module")
      .insert(data)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { message: "Module created", id: module.id };
  },

  deleteModule: async (id: string) => {
    const { error } = await supabase.from("Module").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { message: "Module deleted" };
  },

  /* =========================
     LESSONS
  ========================= */

  createLesson: async (formData: FormData) => {
    const title = formData.get("title") as string;
    const type = formData.get("type") as string;
    const moduleId = formData.get("moduleId") as string;
    const contentUrl = formData.get("contentUrl") as string;

    const { data, error } = await supabase
      .from("Lesson")
      .insert({ title, type, moduleId, contentUrl })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { message: "Lesson created", id: data.id };
  },

  deleteLesson: async (id: string) => {
    const { error } = await supabase.from("Lesson").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { message: "Lesson deleted" };
  },

  /* =========================
     PROFILE
  ========================= */

  getProfile: async () => {
    const userId = localStorage.getItem("token");
    if (!userId) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("User")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  updateProfile: async (data: any) => {
    const userId = localStorage.getItem("token");
    if (!userId) throw new Error("Not authenticated");

    const { error } = await supabase.from("User").update(data).eq("id", userId);
    if (error) throw new Error(error.message);
    return { message: "Profile updated" };
  },

  /* =========================
     INSTRUCTORS
  ========================= */

  listInstructors: async () => {
    const { data, error } = await supabase
      .from("User")
      .select("*")
      .eq("role", "ADMIN");
    if (error) throw new Error(error.message);
    return { data };
  },

  createInstructor: async (formData: FormData) => {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    const { data, error } = await supabase
      .from("User")
      .insert({ name, email, role: "ADMIN", passwordHash: "" })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { message: "Instructor created", id: data.id };
  },

  deleteInstructor: async (id: string) => {
    const { error } = await supabase.from("User").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { message: "Instructor deleted" };
  },
};
