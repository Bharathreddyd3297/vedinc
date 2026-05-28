import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { Search, Star } from "lucide-react";
import ParticlesBackground from "@/components/ParticlesBackground";

type Course = {
    id: string;
    title: string;
    description: string;
    price: number;
    category?: {
        name: string;
    };
};

export default function IndustryHub() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<Course[]>([]);
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        loadCourses();
        window.addEventListener("scroll", () => setScrollY(window.scrollY));
        return () =>
            window.removeEventListener("scroll", () =>
                setScrollY(window.scrollY)
            );
    }, []);

    const loadCourses = async () => {
        const data = await api.listCourses();
        setCourses(data);
    };

    const categories = [
        "All",
        ...Array.from(
            new Set(courses.map((c) => c.category?.name).filter(Boolean))
        ),
    ];

    const filteredCourses = courses.filter((course) => {
        const matchSearch = course.title
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchCategory =
            activeCategory === "All" ||
            course.category?.name === activeCategory;

        return matchSearch && matchCategory;
    });

    return (
        <div className="relative min-h-screen text-slate-200 overflow-hidden bg-black">
            {/* Particles */}
            <ParticlesBackground />

            <div className="relative z-20">

                {/* ===== HERO ===== */}
                <div
                    className={`border-b border-white/5 transition-all duration-500 ${scrollY > 100 ? "backdrop-blur-xl bg-black/20" : ""
                        }`}
                >
                    <div className="max-w-7xl mx-auto px-8 py-24 relative">

                        {/* Glow behind title */}
                        <div className="absolute inset-0 flex justify-center">
                            <div className="w-[500px] h-[300px] bg-cyan-500/10 blur-[150px] rounded-full" />
                        </div>

                        <h1 className="relative text-5xl font-extrabold text-white tracking-tight">
                            Industry Learning Modules
                        </h1>

                        <p className="text-slate-400 mt-4 max-w-2xl text-lg">
                            Production-grade learning experiences crafted for real-world
                            engineering standards.
                        </p>

                        {/* SEARCH */}
                        <div className="mt-10 relative max-w-xl group">
                            <Search
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                            />
                            <input
                                placeholder="Search courses..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-[#111827]/70 border border-white/10 rounded-xl px-12 py-4
                focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 outline-none
                transition backdrop-blur-md"
                            />
                        </div>

                        {/* CATEGORY FILTERS */}
                        <div className="flex gap-3 mt-6 flex-wrap">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 text-sm rounded-full transition ${activeCategory === cat
                                        ? "bg-cyan-500 text-black font-semibold shadow-lg shadow-cyan-500/20"
                                        : "bg-[#111827]/60 backdrop-blur-md border border-white/10 hover:border-cyan-400/40"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ===== COURSE GRID ===== */}
                <div className="max-w-7xl mx-auto px-8 py-24">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">

                        {filteredCourses.map((course, index) => (
                            <div
                                key={course.id}
                                style={{ animationDelay: `${index * 80}ms` }}
                                className="group relative bg-[#0f172a]/70 backdrop-blur-xl
                border border-white/5 rounded-2xl overflow-hidden
                transition duration-500 ease-out
                hover:-translate-y-3 hover:border-cyan-400/40
                hover:shadow-2xl hover:shadow-cyan-500/10
                animate-fadeInUp"
                            >
                                {/* Mouse Light Tracking */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
                                    <div className="absolute w-60 h-60 bg-cyan-400/10 blur-3xl rounded-full top-1/3 left-1/3" />
                                </div>

                                <div className="p-6">
                                    {course.category?.name && (
                                        <span className="text-xs uppercase tracking-wider text-cyan-400">
                                            {course.category.name}
                                        </span>
                                    )}

                                    <h2 className="text-xl font-semibold text-white mt-2">
                                        {course.title}
                                    </h2>

                                    <p className="text-slate-400 text-sm mt-3 line-clamp-3">
                                        {course.description}
                                    </p>

                                    <div className="flex justify-between items-center mt-6">
                                        <span className="text-lg font-semibold text-cyan-400">
                                            {course.price === 0
                                                ? "Free"
                                                : `₹${course.price}`}
                                        </span>

                                        <button
                                            onClick={() =>
                                                navigate(`/course/${course.id}`)
                                            }
                                            className="bg-cyan-500 hover:bg-cyan-400 text-black px-5 py-2 rounded-lg font-medium transition shadow-md shadow-cyan-500/20"
                                        >
                                            Explore
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredCourses.length === 0 && (
                        <div className="text-center text-slate-500 mt-20">
                            No courses found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}