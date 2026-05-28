import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    GraduationCap,
    Shield,
    LogOut,
    ArrowRight,
    User
} from "lucide-react";
import ParticlesBackground from "@/components/ParticlesBackground";

const Dashboard = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <div className="relative min-h-screen text-slate-200 overflow-hidden bg-black">

            {/* 🔥 Particles Background */}
            <ParticlesBackground />

            {/* Optional subtle dark overlay for readability */}
            <div className="absolute inset-0 bg-black/30 pointer-events-none" />

            <div className="relative z-10 flex flex-col min-h-screen">

                {/* Top Navbar */}
                <nav className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10 px-6 py-4">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">

                        <div className="flex items-center gap-3">
                            <LayoutDashboard size={28} className="text-cyan-400" />
                            <h1 className="text-xl font-bold text-white">
                                Admin Panel
                            </h1>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-semibold text-white">
                                    {role}
                                </p>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-cyan-400 hover:bg-white/5 transition"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Main */}
                <main className="flex-grow p-6 md:p-12 max-w-7xl mx-auto w-full">

                    <div className="mb-12">
                        <h2 className="text-4xl font-extrabold text-white mb-3">
                            Dashboard Overview
                        </h2>
                        <p className="text-slate-400 text-lg">
                            Manage your platform modules from here.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        <DashboardCard
                            icon={<GraduationCap size={36} className="text-cyan-400" />}
                            title="Industry Learning Hub"
                            description="Upload and manage PDF courses."
                            buttonText="Manage Courses"
                            onClick={() => navigate("/admin/courses")}
                        />

                        <DashboardCard
                            icon={<User size={36} className="text-cyan-400" />}
                            title="My Profile"
                            description="View and update your profile information."
                            buttonText="Edit Profile"
                            onClick={() => navigate("/profile")}
                        />

                        {role === "SUPER_ADMIN" && (
                            <DashboardCard
                                icon={<Shield size={36} className="text-purple-400" />}
                                title="Admin Management"
                                description="Create and manage platform administrators."
                                buttonText="Manage Admins"
                                accent="purple"
                                onClick={() => navigate("/admin/admins")}
                            />
                        )}

                        {role === "SUPER_ADMIN" && (
                            <DashboardCard
                                icon={<Shield size={36} className="text-purple-400" />}
                                title="Student Enrollments"
                                description="View student enrollment details."
                                buttonText="View Enrollments"
                                accent="purple"
                                onClick={() => navigate("/admin/enrollments")}
                            />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;

/* ------------------------------------------------ */
/* Dashboard Card Component */
/* ------------------------------------------------ */

type CardProps = {
    icon: React.ReactNode;
    title: string;
    description: string;
    buttonText: string;
    onClick: () => void;
    accent?: "cyan" | "purple";
};

const DashboardCard = ({
    icon,
    title,
    description,
    buttonText,
    onClick,
    accent = "cyan",
}: CardProps) => {
    const accentStyles =
        accent === "purple"
            ? "bg-purple-600 hover:bg-purple-500 shadow-purple-500/30"
            : "bg-cyan-500 hover:bg-cyan-400 shadow-cyan-500/30";

    return (
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-8 flex flex-col justify-between hover:scale-[1.03] transition-all duration-300">

            <div>
                <div className="mb-6">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 inline-block">
                        {icon}
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3">
                    {title}
                </h3>

                <p className="text-slate-400 mb-10">
                    {description}
                </p>
            </div>

            <button
                onClick={onClick}
                className={`${accentStyles} text-slate-950 font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-2`}
            >
                {buttonText}
                <ArrowRight size={18} />
            </button>
        </div>
    );
};