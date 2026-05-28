import { useState } from "react";

const VideoForm = () => {
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");

    return (
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg text-cyan-400 mb-4">Add Video</h2>

            <div className="space-y-4">
                <input
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white outline-none focus:border-cyan-400"
                    placeholder="Video Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <input
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white outline-none focus:border-cyan-400"
                    placeholder="Video URL (YouTube / Vimeo)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />

                <button
                    className="w-full py-2 rounded-lg border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition"
                >
                    Add to Playlist
                </button>
            </div>
        </div>
    );
};

export default VideoForm;
