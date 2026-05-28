import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Trash2 } from "lucide-react";
import ParticlesBackground from "@/components/ParticlesBackground";

type Enrollment = {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    status: string;
    createdAt: string;
    course: {
        id: string;
        title: string;
        price: number;
    };
};

export default function Enrollments() {
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await api.listAllEnrollments();
                setEnrollments(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const handleDeleteEnrollment = async (enrollmentId: string) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to remove this enrollment?"
        );

        if (!confirmDelete) return;

        try {
            setDeletingId(enrollmentId);

            const res = await api.deleteEnrollment(enrollmentId);

            if (res.message) {
                setEnrollments((prev) =>
                    prev.filter((e) => e.id !== enrollmentId)
                );
            } else {
                alert(res.message || "Failed to delete enrollment");
            }
        } catch {
            alert("Error deleting enrollment");
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-white">
                Loading enrollments...
            </div>
        );
    }

    return (
        <div className="p-8 text-white">
            <ParticlesBackground />
            <h1 className="text-2xl font-bold mb-6">
                Student Enrollments
            </h1>

            <div className="bg-[#151e2b] border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-[#1f2a3a] text-gray-400">
                        <tr>
                            <th className="p-4 text-left">Student</th>
                            <th className="p-4 text-left">Email</th>
                            <th className="p-4 text-left">Phone</th>
                            <th className="p-4 text-left">Course</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Date</th>
                            <th className="p-4 text-left">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {enrollments.map((e) => (
                            <tr
                                key={e.id}
                                className="border-t border-white/10 hover:bg-white/5 transition"
                            >
                                <td className="p-4">{e.fullName}</td>
                                <td className="p-4">{e.email}</td>
                                <td className="p-4">{e.phone}</td>
                                <td className="p-4">{e.course.title}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 text-xs rounded bg-green-600">
                                        {e.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    {new Date(e.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() =>
                                            handleDeleteEnrollment(e.id)
                                        }
                                        disabled={deletingId === e.id}
                                        className="text-red-500 hover:text-red-400 transition disabled:opacity-50"
                                        title="Remove Enrollment"
                                    >
                                        {deletingId === e.id ? (
                                            "..."
                                        ) : (
                                            <Trash2 size={18} />
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {enrollments.length === 0 && (
                    <div className="p-6 text-gray-400 text-center">
                        No enrollments yet.
                    </div>
                )}
            </div>
        </div>
    );
}