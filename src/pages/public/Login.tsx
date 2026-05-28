import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import VantaBackground from "@/components/VantaBackground";
import { FunkyHeading } from "@/components/ui/FunkyHeading";
import { api } from "@/lib/api";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await api.login(email, password);

            if (!data.token) {
                throw new Error(data.message || "Login failed");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.user.role);

            if (data.user.role === "ADMIN" || data.user.role === "SUPER_ADMIN") {
                navigate("/admin");
            } else {
                navigate("/");
            }

        } catch (err: any) {
            setError(err.message || "Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <VantaBackground>
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8">

                    <FunkyHeading headingLevel="h1" className="text-3xl text-center mb-2">
                        Login
                    </FunkyHeading>

                    <p className="text-center text-white/60 text-sm mb-8 italic tracking-wide">
                        Welcome back
                    </p>

                    {error && (
                        <div className="mb-4 text-sm text-red-400 text-center">
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-xs text-white/60 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="user@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full rounded-lg bg-black/30 border border-white/20 px-4 py-2 text-white outline-none focus:border-cyan-400"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-white/60 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full rounded-lg bg-black/30 border border-white/20 px-4 py-2 text-white outline-none focus:border-cyan-400"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 py-2 rounded-lg bg-cyan-400 text-black font-semibold hover:bg-cyan-300 transition disabled:opacity-50"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                </div>
            </div>
        </VantaBackground>
    );
};

export default Login;