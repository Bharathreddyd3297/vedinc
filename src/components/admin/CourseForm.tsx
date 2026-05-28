import { useState } from "react";
import { api } from "@/lib/api";
import { Upload } from "lucide-react";

const CourseForm = () => {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [level, setLevel] = useState("BEGINNER");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setThumbnail(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        setError("");
        setLoading(true);

        try {
            const data = await api.createCourse({
                title,
                category,
                level,
                description,
                price: price ? parseFloat(price) : 0,
                thumbnail,
            });

            if (data.message && data.message !== "Course created successfully") {
                throw new Error(data.message);
            }

            // Reset on success
            setTitle("");
            setCategory("");
            setLevel("BEGINNER");
            setDescription("");
            setPrice("");
            setThumbnail(null);
            setThumbnailPreview(null);

            alert("Course created successfully");
        } catch (e: any) {
            setError(e.message || "Failed to create course");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg text-cyan-400 mb-4">Create Course</h2>

            {error && (
                <p className="text-red-400 text-sm mb-3">{error}</p>
            )}

            <div className="space-y-4">
                <input
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white"
                    placeholder="Course Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <input
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />

                <input
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white"
                    placeholder="Price (₹)"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />

                <select
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                </select>

                <textarea
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white"
                    rows={4}
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                {/* Thumbnail Upload */}
                <div className="space-y-2">
                    <label className="block text-sm text-white/60">Thumbnail Image</label>
                    {thumbnailPreview && (
                        <img
                            src={thumbnailPreview}
                            alt="Thumbnail preview"
                            className="w-full h-40 object-cover rounded-lg border border-white/20"
                        />
                    )}
                    <label className="flex items-center gap-2 w-full bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg cursor-pointer text-white font-medium transition">
                        <Upload size={18} />
                        {thumbnail ? thumbnail.name : "Choose Thumbnail"}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailChange}
                            className="hidden"
                        />
                    </label>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-2 rounded-lg bg-cyan-400 text-black font-semibold hover:bg-cyan-300 disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Save Course"}
                </button>
            </div>
        </div>
    );
};

export default CourseForm;