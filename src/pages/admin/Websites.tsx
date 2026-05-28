import VantaBackground from "@/components/VantaBackground";

export default function AdminWebsites() {
    return (
        <VantaBackground>
            <div className="min-h-screen px-8 py-16 text-white">
                <h1 className="text-3xl mb-4">Manage Website Previews</h1>
                <p className="text-white/60">
                    This section will allow admins to add preview links.
                </p>

                <div className="mt-8 bg-black/40 p-6 rounded-xl">
                    <p className="italic text-white/40">
                        Backend integration coming soon.
                    </p>
                </div>
            </div>
        </VantaBackground>
    );
}
