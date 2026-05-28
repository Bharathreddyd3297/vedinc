import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type ProfileData = {
    name: string;
    title?: string;
    bio?: string;
    avatar?: string;
};

export default function Profile() {
    const [form, setForm] = useState<ProfileData>({
        name: "",
        title: "",
        bio: "",
        avatar: "",
    });

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await api.getMyProfile();
                setForm(data);
                setPreview(data.avatar || null);
            } catch (err) {
                console.error(err);
            }
        };

        loadProfile();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const file = e.target.files[0];
        setAvatarFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("name", form.name);
            if (form.title) formData.append("title", form.title);
            if (form.bio) formData.append("bio", form.bio);
            if (avatarFile) formData.append("avatar", avatarFile);

            await api.updateMyProfile(formData);

            alert("Profile updated successfully 🚀");
        } catch (err) {
            alert("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B1120] flex items-center justify-center px-6 py-16">
            <div className="bg-[#151e2b] border border-white/10 rounded-2xl p-8 w-full max-w-xl shadow-xl">

                <h2 className="text-2xl font-bold text-white mb-8">
                    My Profile
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Avatar Preview */}
                    <div className="flex flex-col items-center gap-4">
                        {preview ? (
                            <img
                                src={preview}
                                alt="Avatar Preview"
                                className="w-24 h-24 rounded-full object-cover border border-white/20"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                                {form.name?.charAt(0) || "U"}
                            </div>
                        )}

                        <label className="cursor-pointer bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition">
                            Upload Avatar
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Name */}
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#0B1120] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-400"
                    />

                    {/* Title */}
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full bg-[#0B1120] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-400"
                    />

                    {/* Bio */}
                    <textarea
                        name="bio"
                        placeholder="Bio"
                        value={form.bio}
                        onChange={handleChange}
                        rows={4}
                        className="w-full bg-[#0B1120] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-400"
                    />

                    {/* Save Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>

                </form>
            </div>
        </div>
    );
}