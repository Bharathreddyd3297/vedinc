// Database types - mirrors database.sql at the repo root.

export const UserRole = {
    USER: "USER",
    ADMIN: "ADMIN",
    SUPER_ADMIN: "SUPER_ADMIN",
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];

export const LessonType = {
    VIDEO: "VIDEO",
    PDF: "PDF",
} as const;
export type LessonType = typeof LessonType[keyof typeof LessonType];

export type UserRow = {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    passwordHash: string;
    role: UserRole;
    bio: string | null;
    title: string | null;
    avatar: string | null;
    createdAt: string;
};

export type CategoryRow = {
    id: string;
    name: string;
    createdAt: string;
};

export type CourseRow = {
    id: string;
    title: string;
    description: string;
    price: number;
    thumbnail: string | null;
    instructorId: string | null;
    categoryId: string;
    level: string | null;
    duration: string | null;
    createdAt: string;
};

export type CourseObjectiveRow = {
    id: string;
    text: string;
    courseId: string;
    createdAt: string;
};

export type ModuleRow = {
    id: string;
    title: string;
    courseId: string;
    createdAt: string;
};

export type LessonRow = {
    id: string;
    title: string;
    type: LessonType;
    contentUrl: string | null;
    duration: string | null;
    moduleId: string;
    createdAt: string;
};

export type EnrollmentRow = {
    id: string;
    userId: string;
    courseId: string;
    status: string;
    fullName: string;
    email: string;
    phone: string;
    createdAt: string;
};

export type ResourceRow = {
    id: string;
    title: string;
    fileUrl: string;
    categoryId: string;
    createdAt: string;
};
