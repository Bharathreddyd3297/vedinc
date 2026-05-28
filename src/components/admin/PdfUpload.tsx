import { useState } from "react";

const PdfUploadForm = () => {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState<File | null>(null);

    return (
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg text-cyan-400 mb-4">
                Upload PDF Resource
            </h2>

            <div className="space-y-4">
                <input
                    className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white outline-none focus:border-cyan-400"
                    placeholder="PDF Title (Notes, Assignment, Guide)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-white/70
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:bg-cyan-400 file:text-black
                      hover:file:bg-cyan-300"
                />

                {file && (
                    <p className="text-xs text-white/60">
                        Selected: {file.name}
                    </p>
                )}

                <button
                    className="w-full py-2 rounded-lg bg-cyan-400 text-black font-semibold hover:bg-cyan-300 transition"
                >
                    Upload PDF
                </button>
            </div>
        </div>
    );
};

export default PdfUploadForm;
