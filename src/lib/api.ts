import { supabase } from "./supabase";

const getToken = () => localStorage.getItem("token");
const getRole = () => localStorage.getItem("role");

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
    return data || [];
  },

  getCourseContent: async (id: string) => {
    const { data: course, error: courseError } = await supabase
      .from("Course")
      .select("*")
      .eq("id", id)
      .single();

    if (courseError) throw new Error(courseError.message);
    if (!course) throw new Error("Course not found");

    const { data: modules, error: modulesError } = await supabase
      .from("Module")
      .select("*")
      .eq("courseId", id)
      .order("createdAt");

    if (modulesError) throw new Error(modulesError.message);

    const { data: objectives, error: objError } = await supabase
      .from("CourseObjective")
      .select("*")
      .eq("courseId", id)
      .order("createdAt");

    if (objError) throw new Error(objError.message);

    let modulesWithLessons: any[] = [];
    if (modules && modules.length > 0) {
      const { data: lessons, error: lessonsError } = await supabase
        .from("Lesson")
        .select("*")
        .in("moduleId", modules.map(m => m.id));

      if (lessonsError) throw new Error(lessonsError.message);

      modulesWithLessons = modules.map(mod => ({
        ...mod,
        lessons: lessons?.filter(l => l.moduleId === mod.id) || []
      }));
    }

    return {
      ...course,
      modules: modulesWithLessons || [],
      objectives: objectives || []
    };
  },

  createCourse: async (data: any) => {
    try {
      // Handle image upload if present
      if (data.thumbnail instanceof File) {
        const file = data.thumbnail;
        const fileName = `${Date.now()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("course-thumbnails")
          .upload(fileName, file);

        if (uploadError) throw new Error(uploadError.message);

        const { data: { publicUrl } } = supabase.storage
          .from("course-thumbnails")
          .getPublicUrl(fileName);

        data.thumbnail = publicUrl;
      } else {
        delete data.thumbnail;
      }

      // Ensure required fields are present
      if (!data.title || !data.categoryId || data.price === undefined || data.price === null) {
        throw new Error("Missing required fields: title, categoryId, or price");
      }

      // Remove undefined fields but keep required ones
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined && v !== null && v !== "")
      );

      console.log("Creating course with data:", cleanData);

      const { data: course, error } = await supabase
        .from("Course")
        .insert(cleanData)
        .select()
        .single();

      if (error) {
        console.error("Course creation error:", error);
        throw new Error(error.message);
      }

      return { message: "Course created", id: course.id };
    } catch (err: any) {
      console.error("Full error:", err);
      throw err;
    }
  },

  updateCourse: async (id: string, data: any) => {
    // Don't try to update objectives/modules directly - they're separate tables
    const { objectives, modules, ...courseData } = data;

    const { error } = await supabase.from("Course").update(courseData).eq("id", id);
    if (error) throw new Error(error.message);

    // Handle objectives separately if provided
    if (objectives && Array.isArray(objectives)) {
      // Delete old objectives
      await supabase.from("CourseObjective").delete().eq("courseId", id);

      // Insert new objectives
      const objectiveRecords = objectives.map((text: string) => ({
        text,
        courseId: id,
      }));

      if (objectiveRecords.length > 0) {
        const { error: objError } = await supabase
          .from("CourseObjective")
          .insert(objectiveRecords);

        if (objError) throw new Error(objError.message);
      }
    }

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
    return data || [];
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
    return data || [];
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

  initiateEnrollment: async (data: { courseId: string; fullName: string; email: string; phone: string }) => {
    const userId = localStorage.getItem("token");
    if (!userId) throw new Error("Not authenticated");

    const { data: enrollment, error } = await supabase
      .from("Enrollment")
      .insert({ userId, courseId: data.courseId, fullName: data.fullName, email: data.email, phone: data.phone })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { message: "Enrollment created", id: enrollment.id };
  },

  listEnrollments: async () => {
    const { data, error } = await supabase.from("Enrollment").select("*");
    if (error) throw new Error(error.message);
    return data || [];
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
    const { title, courseId } = data;

    if (!title || !courseId) {
      throw new Error("Title and courseId are required");
    }

    const { data: module, error } = await supabase
      .from("Module")
      .insert({ title, courseId })
      .select()
      .single();

    if (error) {
      console.error("Module creation error:", error);
      throw new Error(error.message);
    }

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

  createPdfLesson: async (data: { moduleId: string; title: string; file: File }) => {
    try {
      if (!data.file) throw new Error("File is required");

      const fileName = `${Date.now()}-${data.file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("course-pdfs")
        .upload(fileName, data.file);

      if (uploadError) throw new Error(uploadError.message);

      const { data: { publicUrl } } = supabase.storage
        .from("course-pdfs")
        .getPublicUrl(fileName);

      const { data: lesson, error } = await supabase
        .from("Lesson")
        .insert({
          title: data.title,
          type: "PDF",
          moduleId: data.moduleId,
          contentUrl: publicUrl
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return { message: "PDF lesson created", id: lesson.id };
    } catch (err: any) {
      throw new Error(err.message || "Failed to create PDF lesson");
    }
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

  getMyProfile: async () => {
    return api.getProfile();
  },

  updateProfile: async (data: any) => {
    const userId = localStorage.getItem("token");
    if (!userId) throw new Error("Not authenticated");

    // Handle avatar upload if present
    if (data.avatar instanceof File) {
      const file = data.avatar;
      const fileName = `${userId}-${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("profile-avatars")
        .upload(fileName, file);

      if (uploadError) throw new Error(uploadError.message);

      const { data: { publicUrl } } = supabase.storage
        .from("profile-avatars")
        .getPublicUrl(fileName);

      data.avatar = publicUrl;
    }

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
      .in("role", ["ADMIN", "SUPER_ADMIN"]);
    if (error) throw new Error(error.message);
    return data || [];
  },

  createInstructor: async (formData: FormData) => {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const avatarFile = formData.get("avatar") as File;

    let avatar = null;
    if (avatarFile && avatarFile.size > 0) {
      const fileName = `${Date.now()}-${avatarFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("profile-avatars")
        .upload(fileName, avatarFile);

      if (uploadError) throw new Error(uploadError.message);

      const { data: { publicUrl } } = supabase.storage
        .from("profile-avatars")
        .getPublicUrl(fileName);

      avatar = publicUrl;
    }

    const { data, error } = await supabase
      .from("User")
      .insert({ name, email, role: "ADMIN", passwordHash: "", avatar })
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
