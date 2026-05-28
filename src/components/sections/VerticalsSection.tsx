import { motion, useScroll, useTransform } from 'framer-motion';
import { FunkyHeading } from "@/components/ui/FunkyHeading";
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
const VerticalsSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Progress 0: Screen is blank
  // Animation stretched over 0.6 progress for a slower feel
  const headerY = useTransform(scrollYProgress, [0, 0.4], [800, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);

  const leftX = useTransform(scrollYProgress, [0.08, 0.48], [-800, 0]);
  const rightX = useTransform(scrollYProgress, [0.08, 0.48], [800, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0.08, 0.35], [0, 1]);

  const services = {
    left: {
      title: "Website Design & Development",
      description: "Your brand deserves more than just a website. It deserves a digital experience.",
      details: "At VedInc, we don't just build websites, we build brand trust, user confidence, and business credibility."
    },
    right: {
      title: "Industry-Ready Training Hub",
      items: [
        { name: "Azure DevOps with AI-900", launching: false },
        { name: "Azure Cloud PC with Citrix", launching: false },
        { name: "Full Stack Development", launching: true },
        { name: "Azure Data Engineering", launching: true },
        { name: "AWS DevOps", launching: true }
      ]
    }
  };

  return (
    <section
      ref={sectionRef}
      className="min-h-[100vh] relative bg-gradient-dark overflow-x-hidden font-sans pt-16 pb-24"
    >
      <div className="container mx-auto px-4 flex flex-col items-center">
        {/* Header */}
        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          className="mb-10 md:mb-16 z-70 relative text-center"
        >
          <h2 className="text-6xl md:text-6xl font-black text-white uppercase tracking-tighter">
            Verticals
          </h2>
        </motion.div>

        <div className="w-full max-w-6xl relative z-30">
          <div className="w-full px-6 md:px-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 w-full items-stretch">

              {/* Left Side Section */}
              <motion.div
                style={{ x: leftX, opacity: contentOpacity }}
                className="flex flex-col justify-between h-full"
              >
                <div className="text-left space-y-6">
                  <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">
                    {services.left.title}
                  </h3>
                  <p className="text-[#c1cbe0] text-lg font-medium">{services.left.description}</p>
                  <p className="text-[#c1cbe0] text-base leading-relaxed">{services.left.details}</p>
                </div>

                <div className="text-left mt-12 md:mt-20">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-bold text-sm tracking-widest uppercase shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-shadow"
                    onClick={() => {
                      document.getElementById('mentor-contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Learn More
                  </motion.button>
                </div>
              </motion.div>

              {/* Right Side Section */}
              <motion.div
                style={{ x: rightX, opacity: contentOpacity }}
                className="border-l-0 md:border-l border-white/10 pl-0 md:pl-16 mt-16 md:mt-0 flex flex-col justify-between h-full"
              >
                <div className="text-left space-y-6">
                  <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">
                    {services.right.title}
                  </h3>
                  <ul className="space-y-4">
                    {services.right.items.map((item, index) => (
                      <li key={index} className="flex items-center gap-4 text-[#c1cbe0] text-base">
                        <span className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.6)] flex-shrink-0" />
                        <span className="font-medium text-[#c1cbe0]">{item.name}</span>
                        {item.launching && (
                          <Star className="w-4 h-4 text-primary fill-primary animate-pulse flex-shrink-0" />
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-left flex flex-wrap items-center gap-6 mt-12 md:mt-20">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/industry-hub")}
                    className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-bold text-sm tracking-widest uppercase hover:bg-primary/10 transition-colors shadow-[0_0_15px_rgba(var(--primary),0.1)]"
                  >
                    Explore Courses
                  </motion.button>

                  <div className="flex items-center gap-2 text-primary text-[10px] font-black tracking-widest uppercase">
                    <Star className="w-3 h-3 fill-primary animate-pulse" />
                    Launching Soon
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerticalsSection;