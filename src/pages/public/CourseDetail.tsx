import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import {
    ChevronDown,
    ChevronRight,
    PlayCircle,
    FileText,
    Clock,
    BarChart3,
    CheckCircle
} from "lucide-react";
import ParticlesBackground from "@/components/ParticlesBackground";

/* ================= TYPES ================= */

type Lesson = {
    id: string;
    title: string;
    type: "VIDEO" | "PDF";
    duration?: string;
    contentUrl?: string;
};

type Module = {
    id: string;
    title: string;
    lessons: Lesson[];
};

type Instructor = {
    id: string;
    name: string;
    title?: string;
    bio?: string;
    avatar?: string;
};

type Objective = {
    id: string;
    text: string;
};

type Course = {
    id: string;
    title: string;
    description: string;
    price: number;
    level?: string;
    duration?: string;
    instructor?: Instructor;
    modules: Module[];
    objectives?: Objective[];
};

export default function CourseDetails() {
    const { id } = useParams();

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedModules, setExpandedModules] = useState<string[]>([]);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [enrolling, setEnrolling] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
    });

    /* ================= LOAD ================= */

    useEffect(() => {
        if (!id) return;

        const load = async () => {
            try {
                const data = await api.getCourseContent(id);
                setCourse(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id]);

    const toggleModule = (moduleId: string) => {
        setExpandedModules((prev) =>
            prev.includes(moduleId)
                ? prev.filter((m) => m !== moduleId)
                : [...prev, moduleId]
        );
    };

    /* ================= ENROLL ================= */

    const handleEnroll = async () => {

        if (!id) return;

        if (!formData.fullName || !formData.email || !formData.phone) {
            toast.error("Please fill all fields");
            return;
        }

        try {

            setEnrolling(true);

            const res = await api.initiateEnrollment({
                courseId: id,
                ...formData,
            });

            if (res && res.message) {

                toast.success("Enrollment successful 🎉");

                setIsEnrolled(true);
                setShowModal(false);

            } else {
                toast.error("Enrollment failed");
            }

        } catch (error: any) {
            toast.error(error?.message || "Enrollment failed");
        } finally {
            setEnrolling(false);
        }
    };

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center text-white bg-black">
                Loading...
            </div>
        );

    if (!course)
        return (
            <div className="min-h-screen flex items-center justify-center text-white bg-black">
                Course not found
            </div>
        );

    return (
        <div className="relative min-h-screen bg-black text-gray-300 overflow-hidden">
            <ParticlesBackground />

            <div className="relative z-10 px-6 py-20">
                <div className="max-w-[1280px] mx-auto grid lg:grid-cols-[1fr_380px] gap-16">

                    {/* LEFT SIDE */}
                    <div className="space-y-16">

                        {/* HERO */}
                        <div className="space-y-6">
                            <h1 className="text-5xl font-extrabold text-white leading-tight">
                                {course.title}
                            </h1>

                            <p className="text-lg text-gray-400 max-w-3xl">
                                {course.description}
                            </p>

                            {/* LEVEL + DURATION */}
                            <div className="flex gap-4 pt-4">

                                {course.level && (
                                    <div className="flex items-center gap-3 bg-[#151e2b] px-6 py-4 rounded-xl border border-white/10">
                                        <BarChart3 className="text-cyan-400" size={18} />
                                        <div>
                                            <p className="text-xs text-gray-400">Level</p>
                                            <p className="text-white font-semibold">{course.level}</p>
                                        </div>
                                    </div>
                                )}

                                {course.duration && (
                                    <div className="flex items-center gap-3 bg-[#151e2b] px-6 py-4 rounded-xl border border-white/10">
                                        <Clock className="text-purple-400" size={18} />
                                        <div>
                                            <p className="text-xs text-gray-400">Duration</p>
                                            <p className="text-white font-semibold">{course.duration}</p>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* INSTRUCTOR */}
                        {course.instructor && (
                            <div className="bg-[#151e2b] border border-white/10 rounded-xl p-8">
                                <h3 className="text-xl font-bold text-white mb-6">
                                    Instructor
                                </h3>

                                <div className="flex items-start gap-6">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold text-3xl">
                                        {course.instructor.name.charAt(0)}
                                    </div>

                                    <div>
                                        <h4 className="text-xl font-bold text-white">
                                            {course.instructor.name}
                                        </h4>

                                        {course.instructor.bio && (
                                            <p className="text-sm text-gray-400 mt-3 max-w-xl">
                                                {course.instructor.bio}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CURRICULUM */}
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-6">
                                Course Curriculum
                            </h3>

                            <div className="space-y-4">
                                {course.modules.map((module, index) => {
                                    const expanded = expandedModules.includes(module.id);

                                    return (
                                        <div
                                            key={module.id}
                                            className="bg-[#151e2b] border border-white/10 rounded-xl overflow-hidden"
                                        >
                                            <div
                                                className="flex justify-between items-center p-5 cursor-pointer hover:bg-white/5 transition"
                                                onClick={() => toggleModule(module.id)}
                                            >
                                                <div className="flex items-center gap-3 text-white font-semibold">
                                                    {expanded ? (
                                                        <ChevronDown size={18} />
                                                    ) : (
                                                        <ChevronRight size={18} />
                                                    )}
                                                    Module {index + 1}: {module.title}
                                                </div>

                                                <span className="text-xs text-gray-500">
                                                    {module.lessons.length} Lessons
                                                </span>
                                            </div>

                                            {expanded && (
                                                <div className="border-t border-white/10">
                                                    {module.lessons.map((lesson) => (
                                                        <div
                                                            key={lesson.id}
                                                            onClick={() => {

                                                                if (!isEnrolled) {
                                                                    toast.error("Please enroll to access lessons");
                                                                    return;
                                                                }

                                                                if (lesson.type === "PDF" && lesson.contentUrl) {
                                                                    window.open(lesson.contentUrl, "_blank");
                                                                }

                                                            }}
                                                            className={`flex justify-between items-center p-4 border-b border-white/5 last:border-0 transition
                                                            ${isEnrolled
                                                                    ? "cursor-pointer hover:bg-white/5"
                                                                    : "cursor-not-allowed opacity-60"
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-3 text-sm">
                                                                {lesson.type === "VIDEO" ? (
                                                                    <PlayCircle size={16} className="text-cyan-400" />
                                                                ) : (
                                                                    <FileText size={16} className="text-purple-400" />
                                                                )}

                                                                {lesson.title}
                                                            </div>

                                                            <span className="text-xs text-gray-400">
                                                                {lesson.duration || "Available"}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div className="self-start sticky top-28 h-fit">

                        <div className="bg-gradient-to-b from-[#1a2433] to-[#141c2a] border border-white/10 rounded-2xl p-8 space-y-6 shadow-2xl">

                            <div className="space-y-2">
                                <p className="text-sm text-gray-400">Course Price</p>
                                <span className="text-4xl font-extrabold text-white">
                                    ₹{course.price.toLocaleString()}
                                </span>
                            </div>

                            <button
                                onClick={() => setShowModal(true)}
                                disabled={isEnrolled}
                                className={`w-full h-14 rounded-xl font-bold text-white text-lg transition shadow-lg
                  ${isEnrolled
                                        ? "bg-green-600 cursor-not-allowed"
                                        : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
                                    }`}
                            >
                                {isEnrolled ? "Enrolled ✓" : "Enroll Now →"}
                            </button>

                            {course.objectives && course.objectives.length > 0 && (
                                <div className="pt-6 border-t border-white/10">
                                    <h3 className="text-lg font-semibold text-white mb-4">
                                        What You'll Learn
                                    </h3>

                                    <ul className="space-y-3 text-gray-300 text-sm">
                                        {course.objectives.map((obj) => (
                                            <li key={obj.id} className="flex gap-3">
                                                <CheckCircle size={16} className="text-green-400 mt-0.5" />
                                                <span>{obj.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                        </div>

                    </div>
                </div>
            </div>

            {/* ENROLL MODAL */}

            {showModal && (

                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

                    <div className="bg-[#151e2b] p-8 rounded-xl w-full max-w-lg space-y-4">

                        <h3 className="text-xl font-bold text-white">
                            Enter Your Details
                        </h3>

                        <input
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChange={(e) =>
                                setFormData({ ...formData, fullName: e.target.value })
                            }
                            className="w-full h-10 px-3 rounded-md bg-[#0B1120] border border-white/10 text-white"
                        />

                        <input
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                            className="w-full h-10 px-3 rounded-md bg-[#0B1120] border border-white/10 text-white"
                        />

                        <input
                            placeholder="Phone"
                            value={formData.phone}
                            onChange={(e) =>
                                setFormData({ ...formData, phone: e.target.value })
                            }
                            className="w-full h-10 px-3 rounded-md bg-[#0B1120] border border-white/10 text-white"
                        />

                        <div className="flex justify-end gap-4 pt-4">

                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-600 rounded-md"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleEnroll}
                                disabled={enrolling}
                                className="px-4 py-2 bg-blue-600 rounded-md"
                            >
                                {enrolling ? "Processing..." : "Confirm"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}