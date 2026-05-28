export type PreviewData = {
    title: string;
    description: string;
    image?: string;
    favicon?: string;
    url: string;
};

export async function getPreview(url: string): Promise<PreviewData> {
    const res = await fetch(
        `https://api.microlink.io/?url=${encodeURIComponent(url)}`
    );

    const json = await res.json();

    if (!json?.data) {
        throw new Error("Preview fetch failed");
    }

    return {
        title: json.data.title,
        description: json.data.description,
        image: json.data.image?.url,
        favicon: json.data.logo?.url,
        url: json.data.url,
    };
}
