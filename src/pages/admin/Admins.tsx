import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import ParticlesBackground from "@/components/ParticlesBackground";

type Admin = {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "SUPER_ADMIN";
    bio?: string;
    avatar?: string;
};

export default function AdminAdmins() {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [bio, setBio] = useState("");
    const [avatar, setAvatar] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    /* ================= LOAD ADMINS ================= */

    const loadAdmins = async () => {
        try {
            const data = await api.listAdmins();
            setAdmins(data);
        } catch (err) {
            console.error("Failed to load admins", err);
        }
    };

    useEffect(() => {
        loadAdmins();
    }, []);

    /* ================= CREATE ADMIN ================= */

    const createAdmin = async () => {
        if (!name || !email || !password) {
            alert("Name, Email and Password required");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("bio", bio);
            if (avatar) formData.append("avatar", avatar);

            const res = await api.createAdmin(formData);

            if (res.message && res.message !== "Instructor created successfully") {
                throw new Error(res.message);
            }

            setName("");
            setEmail("");
            setPassword("");
            setBio("");
            setAvatar(null);

            await loadAdmins();
        } catch (err: any) {
            alert(err.message || "Failed to create admin");
        } finally {
            setLoading(false);
        }
    };

    /* ================= DELETE ================= */

    const deleteAdmin = async (id: string) => {
        if (!confirm("Delete this admin?")) return;

        try {
            await api.deleteAdmin(id);
            await loadAdmins();
        } catch {
            alert("Failed to delete admin");
        }
    };

    /* ================= UI ================= */

    return (
        <div className="relative min-h-screen bg-black text-white overflow-hidden">

            {/* Starfield Background */}
            <ParticlesBackground />

            {/* Content Layer */}
            <div className="relative z-10 px-8 py-16">
                <div className="max-w-5xl mx-auto">

                    <h1 className="text-4xl font-bold mb-10">
                        Manage Instructors
                    </h1>

                    {/* ================= CREATE ================= */}

                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-2xl mb-12 shadow-xl">

                        <h2 className="text-2xl font-semibold mb-6">
                            Create Instructor (Admin)
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">

                            <input
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-black/40 border border-white/10 p-3 rounded-lg"
                            />

                            <input
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-black/40 border border-white/10 p-3 rounded-lg"
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-black/40 border border-white/10 p-3 rounded-lg"
                            />

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setAvatar(e.target.files?.[0] || null)
                                }
                                className="text-sm"
                            />

                            <textarea
                                placeholder="Instructor Bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="md:col-span-2 bg-black/40 border border-white/10 p-3 rounded-lg h-28"
                            />
                        </div>

                        <button
                            onClick={createAdmin}
                            disabled={loading}
                            className="mt-6 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl font-semibold transition disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create Instructor"}
                        </button>
                    </div>

                    {/* ================= LIST ================= */}

                    <div className="space-y-4">
                        {admins.map((a) => (
                            <div
                                key={a.id}
                                className="flex justify-between items-center backdrop-blur-lg bg-white/5 border border-white/10 p-5 rounded-xl"
                            >
                                <div className="flex items-center gap-4">

                                    {a.avatar ? (
                                        <img
                                            src={a.avatar}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center font-bold">
                                            {a.name.charAt(0)}
                                        </div>
                                    )}

                                    <div>
                                        <p className="font-semibold">
                                            {a.name}{" "}
                                            <span className="text-xs opacity-60">
                                                ({a.role})
                                            </span>
                                        </p>

                                        <p className="text-sm opacity-60">
                                            {a.email}
                                        </p>

                                        {a.bio && (
                                            <p className="text-xs opacity-50 mt-1 max-w-md">
                                                {a.bio}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {a.role !== "SUPER_ADMIN" && (
                                    <button
                                        onClick={() => deleteAdmin(a.id)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}