import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

type Course = {
    id: string;
    title: string;
    price: number;
    description: string;
};

export default function Checkout() {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "",
    });

    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!courseId) return;

        const loadCourse = async () => {
            const data = await api.getCourseContent(courseId);
            setCourse(data);
            setLoading(false);
        };

        loadCourse();
    }, [courseId]);

    const handleEnroll = async () => {
        if (!courseId) return;

        setProcessing(true);

        try {
            await api.initiateEnrollment({
                courseId,
                ...form,
            });

            alert("Enrollment successful!");
            navigate("/industry-hub");
        } catch (err) {
            alert("Enrollment failed");
        }

        setProcessing(false);
    };

    if (loading || !course) {
        return (
            <div className="min-h-screen bg-[#0f172a] text-white p-10">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0b1220] text-white px-6 py-16">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">

                {/* LEFT — Course Summary */}
                <div>
                    <h1 className="text-4xl font-bold mb-4">
                        Complete Your Enrollment
                    </h1>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mt-6">
                        <h2 className="text-2xl font-semibold">{course.title}</h2>
                        <p className="text-slate-400 mt-3">{course.description}</p>

                        <div className="mt-6 text-3xl font-bold text-cyan-400">
                            ₹{course.price}
                        </div>
                    </div>
                </div>

                {/* RIGHT — Billing Form */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-lg">

                    <h2 className="text-xl font-semibold mb-6">
                        Billing Information
                    </h2>

                    <div className="space-y-4">

                        <input
                            placeholder="Full Name"
                            className="w-full bg-black/30 border border-white/10 rounded-xl p-3"
                            onChange={(e) =>
                                setForm({ ...form, fullName: e.target.value })
                            }
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <input
                                placeholder="Email"
                                className="bg-black/30 border border-white/10 rounded-xl p-3"
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                            />
                            <input
                                placeholder="Phone"
                                className="bg-black/30 border border-white/10 rounded-xl p-3"
                                onChange={(e) =>
                                    setForm({ ...form, phone: e.target.value })
                                }
                            />
                        </div>

                        <input
                            placeholder="Address"
                            className="w-full bg-black/30 border border-white/10 rounded-xl p-3"
                            onChange={(e) =>
                                setForm({ ...form, address: e.target.value })
                            }
                        />

                        <div className="grid grid-cols-3 gap-4">
                            <input
                                placeholder="City"
                                className="bg-black/30 border border-white/10 rounded-xl p-3"
                                onChange={(e) =>
                                    setForm({ ...form, city: e.target.value })
                                }
                            />
                            <input
                                placeholder="State"
                                className="bg-black/30 border border-white/10 rounded-xl p-3"
                                onChange={(e) =>
                                    setForm({ ...form, state: e.target.value })
                                }
                            />
                            <input
                                placeholder="Country"
                                className="bg-black/30 border border-white/10 rounded-xl p-3"
                                onChange={(e) =>
                                    setForm({ ...form, country: e.target.value })
                                }
                            />
                        </div>

                        <button
                            onClick={handleEnroll}
                            disabled={processing}
                            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-4 rounded-xl mt-4 transition-all"
                        >
                            {processing ? "Processing..." : "Confirm & Enroll"}
                        </button>

                        <p className="text-xs text-slate-500 text-center mt-3">
                            Secure transaction • Receipt will be emailed
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
}
