import Navbar from '@/components/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import VerticalsSection from '@/components/sections/VerticalsSection';
import ToolsSection from '@/components/sections/ToolsSection';
import MentorContactFusion from '@/components/sections/MentorContactFusion';
import Footer from '@/components/Footer';
import ParticlesBackground from '@/components/ParticlesBackground';

const Index = () => {
  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      <ParticlesBackground />
      <Navbar />

      <section id="hero">
        <HeroSection />
      </section>

      <section id="verticals">
        <VerticalsSection />
      </section>

      <section id="tools">
        <ToolsSection />
      </section>

      <section id="mentor-contact">
        <MentorContactFusion />
      </section>

      <Footer />

    </div>
  );
};

export default Index;
