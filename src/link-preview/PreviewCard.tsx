import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPreview, PreviewData } from "./preview.service";

type Props = {
    url: string;
};

export function PreviewCard({ url }: Props) {
    const [data, setData] = useState<PreviewData | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        getPreview(url).then(setData).catch(() => null);
    }, [url]);

    if (!data) {
        return (
            <div className="h-64 rounded-xl bg-black/30 border border-white/10 animate-pulse" />
        );
    }

    return (
        <div className="rounded-xl overflow-hidden bg-black/50 border border-white/20">
            {data.image && (
                <img src={data.image} className="h-40 w-full object-cover" />
            )}

            <div className="p-4 text-white">
                <div className="flex items-center gap-2 text-sm opacity-70">
                    {data.favicon && <img src={data.favicon} className="h-4 w-4" />}
                    {data.url}
                </div>

                <h3 className="mt-2 font-bold">{data.title}</h3>
                <p className="text-sm opacity-80 line-clamp-2">
                    {data.description}
                </p>

                <a
                    href={data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block px-3 py-2 bg-white text-black rounded-lg text-sm font-medium"
                >
                    Open Website
                </a>
            </div>
        </div>
    );
}
