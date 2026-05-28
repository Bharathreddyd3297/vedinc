import VantaBackground from "@/components/VantaBackground";
import { PreviewGrid } from "./PreviewGrid";

export default function PreviewListPage() {
    return (
        <VantaBackground>
            <div className="min-h-screen px-6 py-24">
                <h1 className="text-white text-3xl font-bold mb-8">
                    Website Previews
                </h1>
                <PreviewGrid />
            </div>
        </VantaBackground>
    );
}
