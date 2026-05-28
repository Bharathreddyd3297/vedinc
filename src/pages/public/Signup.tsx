import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import VantaBackground from "@/components/VantaBackground";
import { FunkyHeading } from "@/components/ui/FunkyHeading";
import { api } from "@/lib/api";

const Signup = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await api.signup(name, email, password);

            if (!data.token) {
                setError(data.message || "Signup failed");
                return;
            }

            // ✅ auto login
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.user.role);

            navigate("/industry-hub");
            window.location.reload(); // refresh navbar state
        } catch {
            setError("Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <VantaBackground>
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8">

                    <FunkyHeading headingLevel="h1" className="text-3xl text-center mb-2">
                        Sign Up
                    </FunkyHeading>

                    <p className="text-center text-white/60 text-sm mb-8 italic tracking-wide">
                        Create your account
                    </p>

                    {error && (
                        <div className="mb-4 text-sm text-red-400 text-center">
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSignup}>
                        <div>
                            <label className="block text-xs text-white/60 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your Name"
                                required
                                className="w-full rounded-lg bg-black/30 border border-white/20 px-4 py-2 text-white outline-none focus:border-cyan-400"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-white/60 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@vedinc.in"
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full rounded-lg bg-black/30 border border-white/20 px-4 py-2 text-white outline-none focus:border-cyan-400"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 py-2 rounded-lg bg-cyan-400 text-black font-semibold hover:bg-cyan-300 transition disabled:opacity-50"
                        >
                            {loading ? "Creating account..." : "Sign Up"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-xs text-white/50">
                        Already have an account?{" "}
                        <Link to="/login" className="text-cyan-400 hover:underline">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </VantaBackground>
    );
};

export default Signup;
