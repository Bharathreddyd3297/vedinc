import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/lib/api";
import {
    Plus,
    Trash2,
    ChevronDown,
    ChevronRight,
    FileText,
    Upload,
    ExternalLink,
} from "lucide-react";
import ParticlesBackground from "@/components/ParticlesBackground";

/* ================= TYPES ================= */

type Objective = {
    id: string;
    text: string;
};

type Lesson = {
    id: string;
    title: string;
    type: "PDF";
    contentUrl?: string;
};

type Module = {
    id: string;
    title: string;
    lessons: Lesson[];
};

type Course = {
    id: string;
    title: string;
    modules: Module[];
    objectives: Objective[];
};

/* ================= COMPONENT ================= */

export default function CourseEditor() {
    const { id } = useParams();

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);

    const [expandedModules, setExpandedModules] = useState<string[]>([]);

    /* MODULE STATE */
    const [newModuleTitle, setNewModuleTitle] = useState("");

    /* LESSON STATE */
    const [lessonTitle, setLessonTitle] = useState("");
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    /* OBJECTIVES STATE */
    const [objectives, setObjectives] = useState<string[]>([]);
    const [newObjective, setNewObjective] = useState("");

    /* ================= LOAD COURSE ================= */

    const loadCourse = async () => {
        if (!id) return;

        try {
            const data = await api.getCourseContent(id);
            setCourse(data);
            setObjectives(data.objectives?.map((o: Objective) => o.text) || []);
        } catch (err) {
            console.error(err);
        }

        setLoading(false);
    };

    useEffect(() => {
        loadCourse();
    }, [id]);

    /* ================= OBJECTIVES ================= */

    const addObjective = () => {
        if (!newObjective.trim()) return;
        setObjectives([...objectives, newObjective]);
        setNewObjective("");
    };

    const removeObjective = (index: number) => {
        setObjectives(objectives.filter((_, i) => i !== index));
    };

    const saveObjectives = async () => {
        if (!id) return;

        await api.updateCourse(id, { objectives });
        alert("Objectives updated ✅");
        loadCourse();
    };

    /* ================= MODULE ================= */

    const createModule = async () => {
        if (!newModuleTitle.trim() || !id) return;

        await api.createModule({
            title: newModuleTitle,
            courseId: id,
        });

        setNewModuleTitle("");
        loadCourse();
    };

    const deleteModule = async (moduleId: string) => {
        if (!confirm("Delete this module?")) return;

        await api.deleteModule(moduleId);
        loadCourse();
    };

    const toggleModule = (moduleId: string) => {
        setExpandedModules((prev) =>
            prev.includes(moduleId)
                ? prev.filter((m) => m !== moduleId)
                : [...prev, moduleId]
        );
    };

    /* ================= LESSON ================= */

    const createLesson = async (moduleId: string) => {
        if (!lessonTitle || !pdfFile) return;

        await api.createPdfLesson({
            moduleId,
            title: lessonTitle,
            file: pdfFile,
        });

        setLessonTitle("");
        setPdfFile(null);
        loadCourse();
    };

    const deleteLesson = async (lessonId: string) => {
        if (!confirm("Delete this lesson?")) return;

        await api.deleteLesson(lessonId);
        loadCourse();
    };

    /* ================= STATES ================= */

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f172a] text-white p-10">
                Loading...
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-[#0f172a] text-white p-10">
                Course not found.
            </div>
        );
    }

    /* ================= UI ================= */

    return (
        <div className="relative min-h-screen bg-black text-slate-200 p-10 space-y-12">
            <ParticlesBackground />

            <h1 className="text-3xl font-bold">
                Course Editor: {course.title}
            </h1>

            {/* ================= OBJECTIVES SECTION ================= */}
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 space-y-6">
                <h2 className="text-xl font-semibold">Learning Objectives</h2>

                {objectives.map((obj, index) => (
                    <div
                        key={index}
                        className="flex justify-between items-center bg-black/30 p-3 rounded-lg"
                    >
                        <span>{obj}</span>
                        <button
                            onClick={() => removeObjective(index)}
                            className="text-red-400"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}

                <div className="flex gap-4">
                    <input
                        value={newObjective}
                        onChange={(e) => setNewObjective(e.target.value)}
                        placeholder="New Learning Objective"
                        className="flex-1 bg-black/30 p-3 rounded-lg border border-white/10"
                    />

                    <button
                        onClick={addObjective}
                        className="bg-cyan-500 hover:bg-cyan-400 px-6 rounded-lg font-semibold text-black flex items-center gap-2"
                    >
                        <Plus size={16} /> Add
                    </button>
                </div>

                <button
                    onClick={saveObjectives}
                    className="bg-green-500 hover:bg-green-400 px-6 py-2 rounded-lg font-semibold text-black"
                >
                    Save Objectives
                </button>
            </div>

            {/* ================= MODULES SECTION ================= */}
            <div className="space-y-6">

                <div className="flex gap-4">
                    <input
                        value={newModuleTitle}
                        onChange={(e) => setNewModuleTitle(e.target.value)}
                        placeholder="New Module Title"
                        className="flex-1 bg-black/30 p-3 rounded-lg border border-white/10"
                    />

                    <button
                        onClick={createModule}
                        className="bg-cyan-500 hover:bg-cyan-400 px-6 rounded-lg font-semibold text-black flex items-center gap-2"
                    >
                        <Plus size={16} /> Add Module
                    </button>
                </div>

                {course.modules.map((module, index) => {
                    const expanded = expandedModules.includes(module.id);

                    return (
                        <div
                            key={module.id}
                            className="bg-white/[0.03] border border-white/10 rounded-xl"
                        >
                            <div className="flex justify-between items-center p-5">
                                <div
                                    className="flex items-center gap-3 cursor-pointer"
                                    onClick={() => toggleModule(module.id)}
                                >
                                    {expanded ? (
                                        <ChevronDown size={18} />
                                    ) : (
                                        <ChevronRight size={18} />
                                    )}
                                    <h2 className="font-semibold text-lg">
                                        Module {index + 1}: {module.title}
                                    </h2>
                                </div>

                                <button
                                    onClick={() => deleteModule(module.id)}
                                    className="text-red-400"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            {expanded && (
                                <div className="px-6 pb-6 space-y-6">

                                    {/* EXISTING LESSONS */}
                                    {module.lessons.map((lesson) => (
                                        <div
                                            key={lesson.id}
                                            className="bg-black/30 p-4 rounded-lg flex justify-between items-center"
                                        >
                                            <div className="flex items-center gap-3">
                                                <FileText size={16} className="text-purple-400" />
                                                {lesson.title}
                                            </div>

                                            <div className="flex gap-3">
                                                {lesson.contentUrl && (
                                                    <a
                                                        href={lesson.contentUrl}
                                                        target="_blank"
                                                        className="text-cyan-400"
                                                    >
                                                        <ExternalLink size={16} />
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => deleteLesson(lesson.id)}
                                                    className="text-red-400"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* ADD LESSON */}
                                    <div className="bg-black/30 p-6 rounded-xl space-y-4">
                                        <input
                                            placeholder="Lesson Title"
                                            value={lessonTitle}
                                            onChange={(e) => setLessonTitle(e.target.value)}
                                            className="w-full bg-black/50 p-3 rounded-lg border border-white/10"
                                        />

                                        <label className="flex items-center gap-3 bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg cursor-pointer w-fit">
                                            <Upload size={16} />
                                            {pdfFile ? pdfFile.name : "Choose PDF"}
                                            <input
                                                type="file"
                                                accept="application/pdf"
                                                onChange={(e) =>
                                                    setPdfFile(e.target.files?.[0] || null)
                                                }
                                                hidden
                                            />
                                        </label>

                                        <button
                                            onClick={() => createLesson(module.id)}
                                            className="bg-cyan-500 hover:bg-cyan-400 px-6 py-2 rounded-lg font-semibold text-black"
                                        >
                                            Add Lesson
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}