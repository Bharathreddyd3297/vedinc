import Particles from "@/components/Particles";

const ParticlesBackground = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Particles
                particleColors={["#ffffff"]}
                particleCount={200}
                particleSpread={20}
                speed={0.05}
                particleBaseSize={100}
                alphaParticles={false}
                disableRotation={false}
            />
        </div>
    );
};

export default ParticlesBackground;