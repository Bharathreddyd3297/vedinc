/* =========================
   API BASE (FROM .env)
========================= */

const API_BASE = import.meta.env.VITE_API_URL as string;

const getToken = () => localStorage.getItem("token");

const authHeader = () => {
    const token = getToken();
    return token
        ? { Authorization: `Bearer ${token}` }
        : {};
};

/* =========================
   API OBJECT
========================= */

export const api = {

    /* =========================
       AUTH
    ========================= */

    login: async (email: string, password: string) => {
        const res = await fetch(`${API_BASE}/auth?action=login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        return res.json();
    },

    signup: async (name: string, email: string, password: string) => {
        const res = await fetch(`${API_BASE}/auth?action=signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });
        return res.json();
    },

    /* =========================
       COURSES
    ========================= */

    listCourses: async () => {
        const res = await fetch(`${API_BASE}/courses`);
        return res.json();
    },

    getCourseContent: async (id: string) => {
        const res = await fetch(`${API_BASE}/courses/${id}`);
        return res.json();
    },

    createCourse: async (data: any) => {
        const res = await fetch(`${API_BASE}/courses/admin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authHeader(),
            },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    updateCourse: async (id: string, data: any) => {
        const res = await fetch(`${API_BASE}/courses/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...authHeader(),
            },
            body: JSON.stringify(data),
        });
        return res.json();
    },

    deleteCourse: async (id: string) => {
        const res = await fetch(`${API_BASE}/courses/${id}`, {
            method: "DELETE",
            headers: authHeader(),
        });
        return res.json();
    },

    /* =========================
       CATEGORIES
    ========================= */

    listCategories: async () => {
        const res = await fetch(`${API_BASE}/categories`);
        return res.json();
    },

    createCategory: async (name: string) => {
        const res = await fetch(`${API_BASE}/categories/admin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authHeader(),
            },
            body: JSON.stringify({ name }),
        });
        return res.json();
    },

    deleteCategory: async (id: string) => {
        const res = await fetch(`${API_BASE}/categories/${id}`, {
            method: "DELETE",
            headers: authHeader(),
        });
        return res.json();
    },

    /* =========================
       ADMIN USERS
    ========================= */

    listAdmins: async () => {
        const res = await fetch(`${API_BASE}/admin/users`, {
            headers: authHeader(),
        });
        return res.json();
    },

    createAdmin: async (formData: FormData) => {
        const res = await fetch(`${API_BASE}/admin/create-admin`, {
            method: "POST",
            headers: {
                ...authHeader(),
            },
            body: formData,
        });

        return res.json();
    },

    deleteAdmin: async (id: string) => {
        const res = await fetch(`${API_BASE}/admin/users/${id}`, {
            method: "DELETE",
            headers: authHeader(),
        });
        return res.json();
    },

    /* =========================
   ENROLLMENTS
========================= */

    checkEnrollment: async (courseId: string, email: string) => {
        const res = await fetch(
            `${API_BASE}/enrollments/check/${courseId}?email=${email}`
        );
        return res.json();
    },

    initiateEnrollment: async (data: {
        courseId: string;
        fullName: string;
        email: string;
        phone: string;
    }) => {
        const res = await fetch(`${API_BASE}/enrollments/initiate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        return res.json();
    },

    /* =========================
       MODULES
    ========================= */

    createModule: async (data: {
        title: string;
        courseId: string;
    }) => {
        const res = await fetch(`${API_BASE}/modules/admin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authHeader(),
            },
            body: JSON.stringify(data),
        });

        return res.json();
    },

    deleteModule: async (id: string) => {
        const res = await fetch(`${API_BASE}/modules/${id}`, {
            method: "DELETE",
            headers: authHeader(),
        });

        return res.json();
    },

    /* =========================
       LESSONS
    ========================= */

    createPdfLesson: async (data: {
        title: string;
        moduleId: string;
        file: File;
        duration?: string;
    }) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("type", "PDF");
        formData.append("moduleId", data.moduleId);

        if (data.duration) {
            formData.append("duration", data.duration);
        }

        formData.append("file", data.file);

        const res = await fetch(`${API_BASE}/lessons/admin`, {
            method: "POST",
            headers: authHeader(),
            body: formData,
        });

        return res.json();
    },

    deleteLesson: async (lessonId: string) => {
        const res = await fetch(`${API_BASE}/lessons/${lessonId}`, {
            method: "DELETE",
            headers: authHeader(),
        });

        return res.json();
    },

    /* =========================
       PROFILE
    ========================= */

    getMyProfile: async () => {
        const res = await fetch(`${API_BASE}/users/me`, {
            headers: authHeader(),
        });
        return res.json();
    },

    updateMyProfile: async (formData: FormData) => {
        const res = await fetch(`${API_BASE}/users/me`, {
            method: "PUT",
            headers: authHeader(),
            body: formData,
        });
        return res.json();
    },

    /* =========================
        ADMIN ENROLLMENTS
    ========================= */

    listAllEnrollments: async () => {
        const res = await fetch(`${API_BASE}/admin/enrollments`, {
            headers: authHeader(),
        });
        return res.json();
    },

    deleteEnrollment: async (id: string) => {
        const res = await fetch(`${API_BASE}/enrollments/${id}`, {
            method: "DELETE",
            headers: authHeader(),
        });
        return res.json();
    },
};