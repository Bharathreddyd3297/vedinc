import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import {
    Plus,
    Trash2,
    Eye,
    FolderPlus,
    Pencil,
    X,
} from "lucide-react";
import ParticlesBackground from "@/components/ParticlesBackground";

type Category = {
    id: string;
    name: string;
};

type Instructor = {
    id: string;
    name: string;
};

type Course = {
    id: string;
    title: string;
    description: string;
    price: number;
    level?: string;
    duration?: string;
    category: {
        id?: string;
        name: string;
    };
    instructor?: {
        id?: string;
        name: string;
    };
};

export default function Courses() {
    const navigate = useNavigate();

    const [categories, setCategories] = useState<Category[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [instructors, setInstructors] = useState<Instructor[]>([]);

    const [newCategory, setNewCategory] = useState("");

    /* CREATE COURSE STATE */
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [instructorId, setInstructorId] = useState("");
    const [level, setLevel] = useState("");
    const [duration, setDuration] = useState("");

    /* EDIT STATE */
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [levelOpen, setLevelOpen] = useState(false);
    const [instructorOpen, setInstructorOpen] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);

    /* ================= LOAD DATA ================= */

    useEffect(() => {
        loadCategories();
        loadCourses();
        loadInstructors();
    }, []);

    const loadCategories = async () => {
        const data = await api.listCategories();
        setCategories(data);
        if (data.length > 0) setCategoryId(data[0].id);
    };

    const loadCourses = async () => {
        const data = await api.listCourses();
        setCourses(data);
    };

    const loadInstructors = async () => {
        const data = await api.listAdmins();
        const onlyAdmins = data.filter(
            (u: any) => u.role === "ADMIN" || u.role === "SUPER_ADMIN"
        );
        setInstructors(onlyAdmins);
    };

    /* ================= CATEGORY ================= */

    const createCategory = async () => {
        if (!newCategory) return;
        await api.createCategory(newCategory);
        setNewCategory("");
        loadCategories();
    };

    const deleteCategory = async (id: string) => {
        if (!confirm("Delete this category?")) return;
        await api.deleteCategory(id);
        loadCategories();
    };

    /* ================= CREATE COURSE ================= */

    const createCourse = async () => {
        if (!title || !price || !categoryId) return;

        const newCourse = await api.createCourse({
            title,
            description,
            price: Number(price),
            categoryId,
            instructorId: instructorId || undefined,
            level,
            duration,
        });

        /* reset form */
        setTitle("");
        setDescription("");
        setPrice("");
        setLevel("");
        setDuration("");
        setInstructorId("");

        navigate(`/admin/courses/${newCourse.id}/curriculum`);
    };

    /* ================= DELETE ================= */

    const deleteCourse = async (id: string) => {
        if (!confirm("Delete this course?")) return;
        await api.deleteCourse(id);
        loadCourses();
    };

    /* ================= EDIT ================= */

    const openEditModal = (course: Course) => {
        setEditingCourse({
            ...course,
            category: { id: course.category?.id, name: course.category?.name },
            instructor: course.instructor
                ? { id: course.instructor.id, name: course.instructor.name }
                : undefined,
        });
        setEditModalOpen(true);
    };

    const updateCourse = async () => {
        if (!editingCourse) return;

        await api.updateCourse(editingCourse.id, {
            title: editingCourse.title,
            description: editingCourse.description,
            price: Number(editingCourse.price),
            level: editingCourse.level,
            duration: editingCourse.duration,
            categoryId: editingCourse.category?.id,
            instructorId: editingCourse.instructor?.id,
        });

        setEditModalOpen(false);
        loadCourses();
    };

    /* ================= UI ================= */

    return (
        <div className="bg-black min-h-screen text-slate-200 p-10">
            <ParticlesBackground />
            <h1 className="text-4xl font-bold text-white mb-8">
                Course Management
            </h1>

            {/* ================= CATEGORY SECTION ================= */}

            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-10">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FolderPlus size={18} className="text-cyan-400" />
                    Manage Categories
                </h2>

                <div className="flex gap-4 mb-4">
                    <input
                        placeholder="New Category Name"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-2"
                    />
                    <button
                        onClick={createCategory}
                        className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 rounded-xl font-semibold"
                    >
                        Add
                    </button>
                </div>

                <div className="space-y-2">
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            className="flex justify-between items-center bg-black/30 px-4 py-2 rounded-xl border border-white/5"
                        >
                            <span>{cat.name}</span>
                            <button
                                onClick={() => deleteCategory(cat.id)}
                                className="text-red-400"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* ================= CREATE COURSE ================= */}

            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-10">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Plus size={18} className="text-cyan-400" />
                    Create Course
                </h2>

                <div className="grid gap-4">

                    <input
                        placeholder="Course Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-black/30 border border-white/10 rounded-xl px-4 py-3"
                    />

                    <div className="relative w-full">
                        <button
                            type="button"
                            onClick={() => setCategoryOpen(!categoryOpen)}
                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-left text-slate-200"
                        >
                            {categories.find(c => c.id === categoryId)?.name || "Select Category"}
                        </button>

                        {categoryOpen && (
                            <div className="absolute left-0 mt-2 w-full bg-[#1e293b] border border-white/10 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
                                {categories.map((cat) => (
                                    <div
                                        key={cat.id}
                                        onClick={() => {
                                            setCategoryId(cat.id);
                                            setCategoryOpen(false);
                                        }}
                                        className="px-4 py-3 hover:bg-cyan-500/20 cursor-pointer text-slate-300"
                                    >
                                        {cat.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative w-full">
                        <button
                            type="button"
                            onClick={() => setInstructorOpen(!instructorOpen)}
                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-left text-slate-200"
                        >
                            {instructors.find(i => i.id === instructorId)?.name || "Select Instructor (Optional)"}
                        </button>

                        {instructorOpen && (
                            <div className="absolute left-0 mt-2 w-full bg-[#1e293b] border border-white/10 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
                                <div
                                    onClick={() => {
                                        setInstructorId("");
                                        setInstructorOpen(false);
                                    }}
                                    className="px-4 py-3 hover:bg-cyan-500/20 cursor-pointer text-slate-300"
                                >
                                    None
                                </div>

                                {instructors.map((inst) => (
                                    <div
                                        key={inst.id}
                                        onClick={() => {
                                            setInstructorId(inst.id);
                                            setInstructorOpen(false);
                                        }}
                                        className="px-4 py-3 hover:bg-cyan-500/20 cursor-pointer text-slate-300"
                                    >
                                        {inst.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative w-full">
                        <button
                            type="button"
                            onClick={() => setLevelOpen(!levelOpen)}
                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-left text-slate-200"
                        >
                            {level || "Select Level"}
                        </button>

                        {levelOpen && (
                            <div className="absolute left-0 mt-2 w-full bg-[#1e293b] border border-white/10 rounded-xl shadow-xl z-50">
                                {["Beginner", "Intermediate", "Advanced"].map((lvl) => (
                                    <div
                                        key={lvl}
                                        onClick={() => {
                                            setLevel(lvl);
                                            setLevelOpen(false);
                                        }}
                                        className="px-4 py-3 hover:bg-cyan-500/20 cursor-pointer text-slate-300"
                                    >
                                        {lvl}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <input
                        placeholder="Duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="bg-black/30 border border-white/10 rounded-xl px-4 py-3"
                    />

                    <input
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="bg-black/30 border border-white/10 rounded-xl px-4 py-3"
                    />

                    <textarea
                        placeholder="Course description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 h-28"
                    />

                    <button
                        onClick={createCourse}
                        className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-3 rounded-xl"
                    >
                        Create Course
                    </button>
                </div>
            </div>

            {/* ================= ACTIVE CATALOG ================= */}

            <div className="bg-white/[0.03] border border-white/10 rounded-2xl">
                <div className="p-6 border-b border-white/5">
                    <h2 className="text-lg font-semibold text-white">
                        Active Catalog
                    </h2>
                </div>

                <div className="divide-y divide-white/5">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            className="flex justify-between items-center p-6 hover:bg-white/[0.02]"
                        >
                            <div>
                                <h3 className="font-semibold text-white">
                                    {course.title}
                                </h3>

                                <p className="text-sm text-slate-400">
                                    {course.category?.name}
                                    {course.level && ` • ${course.level}`}
                                    {course.duration && ` • ${course.duration}`}
                                    {" • ₹"}
                                    {course.price}
                                    {course.instructor && (
                                        <> • {course.instructor.name}</>
                                    )}
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() =>
                                        navigate(`/admin/courses/${course.id}/curriculum`)
                                    }
                                    className="p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20"
                                >
                                    <Eye size={18} />
                                </button>

                                <button
                                    onClick={() => openEditModal(course)}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-yellow-500/20"
                                >
                                    <Pencil size={18} />
                                </button>

                                <button
                                    onClick={() => deleteCourse(course.id)}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {courses.length === 0 && (
                        <div className="p-6 text-slate-400">
                            No courses available.
                        </div>
                    )}
                </div>
            </div>

            {/* ================= EDIT MODAL ================= */}

            {editModalOpen && editingCourse && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-[#1e293b] w-full max-w-4xl max-h-[90vh] overflow-y-auto p-10 rounded-2xl space-y-6">

                        {/* HEADER */}
                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                            <h2 className="text-2xl font-bold text-white">
                                Edit Course
                            </h2>

                            <button onClick={() => setEditModalOpen(false)}>
                                <X size={22} />
                            </button>
                        </div>

                        {/* GRID LAYOUT */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div className="space-y-4">
                                <label className="text-sm text-slate-400">Title</label>
                                <input
                                    value={editingCourse.title}
                                    onChange={(e) =>
                                        setEditingCourse({
                                            ...editingCourse,
                                            title: e.target.value,
                                        })
                                    }
                                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm text-slate-400">Price</label>
                                <input
                                    type="number"
                                    value={editingCourse.price}
                                    onChange={(e) =>
                                        setEditingCourse({
                                            ...editingCourse,
                                            price: Number(e.target.value),
                                        })
                                    }
                                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3"
                                />
                            </div>

                            <div className="relative w-full space-y-4">
                                <label className="text-sm text-slate-400">Level</label>

                                <button
                                    type="button"
                                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-left text-slate-200"
                                    onClick={() => setLevelOpen(!levelOpen)}
                                >
                                    {editingCourse.level || "Select Level"}
                                </button>

                                {levelOpen && (
                                    <div className="absolute left-0 mt-2 w-full bg-[#1e293b] border border-white/10 rounded-xl shadow-xl z-50">
                                        {["Beginner", "Intermediate", "Advanced"].map((lvl) => (
                                            <div
                                                key={lvl}
                                                onClick={() => {
                                                    setEditingCourse({
                                                        ...editingCourse,
                                                        level: lvl,
                                                    });
                                                    setLevelOpen(false);
                                                }}
                                                className="px-4 py-3 hover:bg-cyan-500/20 cursor-pointer"
                                            >
                                                {lvl}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm text-slate-400">Duration</label>
                                <input
                                    value={editingCourse.duration || ""}
                                    onChange={(e) =>
                                        setEditingCourse({
                                            ...editingCourse,
                                            duration: e.target.value,
                                        })
                                    }
                                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3"
                                />
                            </div>

                        </div>

                        {/* DESCRIPTION FULL WIDTH */}
                        <div className="space-y-4">
                            <label className="text-sm text-slate-400">Description</label>
                            <textarea
                                value={editingCourse.description}
                                onChange={(e) =>
                                    setEditingCourse({
                                        ...editingCourse,
                                        description: e.target.value,
                                    })
                                }
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-4 h-40"
                            />
                        </div>

                        {/* SAVE BUTTON */}
                        <div className="flex justify-end pt-4">
                            <button
                                onClick={updateCourse}
                                className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-8 py-3 rounded-xl"
                            >
                                Save Changes
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}