import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { FunkyHeading } from "@/components/ui/FunkyHeading";
import { useRef, useEffect } from 'react';
import { Linkedin, Mail } from 'lucide-react';

// Attempt to import - if this line causes the red error overlay, 
// check if the file is actually in src/assets/bharat_pic.jpeg
import mentorPic from '@/assets/bharat_pic.jpeg';

const MentorSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 80, damping: 30 };
  const floatX1 = useSpring(useTransform(mouseX, [-500, 500], [-20, 20]), springConfig);
  const floatY1 = useSpring(useTransform(mouseY, [-300, 300], [-15, 15]), springConfig);
  const floatX2 = useSpring(useTransform(mouseX, [-500, 500], [18, -18]), springConfig);
  const floatY2 = useSpring(useTransform(mouseY, [-300, 300], [12, -12]), springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const imageScale = useTransform(scrollYProgress, [0, 0.3], [0.9, 1]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen relative bg-gradient-dark overflow-hidden py-20"
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          
          {/* Image Section */}
          <motion.div 
            style={{ scale: imageScale, opacity: imageOpacity }}
            className="relative flex justify-center"
          >
            <div className="relative">
              {/* Certified Badge */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="absolute -top-3 -left-3 z-20"
              >
                {/* Replace the div inside the first motion.div with this */}
                <div className="bg-primary border border-primary/50 rounded px-3 py-1.5 shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                  <span className="text-primary-foreground text-xs font-bold tracking-wide">Azure Certified</span>
                </div>
              </motion.div>

              {/* Main Image Container */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="w-72 h-88 bg-card/60 backdrop-blur-sm border border-border/30 rounded-2xl overflow-hidden flex items-center justify-center"
              >
                {/* If mentorPic is undefined or the path is wrong, 
                  this will just show a blank box instead of crashing the whole page.
                */}
                <img 
                  src={mentorPic} 
                  alt="Bharath Reddy" 
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </motion.div>

              {/* Experience Badge */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="absolute -bottom-3 -right-3 z-20"
              >
                <div className="bg-primary text-primary-foreground rounded px-4 py-2 text-sm font-medium tracking-wide">
                  10+ Years Experience
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9 }}
              className="absolute -bottom-16 text-center"
            >
              <h3 className="text-xl font-display text-foreground tracking-wide">Bharath Reddy</h3>
              <p className="text-muted-foreground text-sm">DevOps Expert & Mentor</p>
            </motion.div>
          </motion.div>

          {/* Content Section */}
          <div className="relative">
            <FunkyHeading className="text-4xl md:text-5xl mb-8">
              Meet the <span className="text-cyan-400">Mentor</span>
            </FunkyHeading>

            <div className="relative space-y-6">
              <motion.div
                style={{ x: floatX1, y: floatY1 }}
                className="relative"
              >
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
                  className="bg-card/40 backdrop-blur-sm p-5 rounded-lg border-l-2 border-l-primary"
                >
                  <p className="text-text-blue text-base leading-relaxed italic">
                    "I believe in shifting from memorizing commands to truly understanding systems. 
                    When you understand the 'why' behind DevOps practices, everything else falls into place."
                  </p>
                </motion.div>
              </motion.div>

              <motion.div
                style={{ x: floatX2, y: floatY2 }}
                className="relative"
              >
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  animate={{ y: [0, -8, 0] }}
                  className="bg-card/40 backdrop-blur-sm p-5 rounded-lg border-r-2 border-r-primary"
                >
                  <p className="text-text-blue text-base leading-relaxed italic">
                    "My teaching approach focuses on real-world scenarios, hands-on projects, 
                    and the actual challenges you'll face in enterprise environments. 
                    No fluff, just practical knowledge that will make you job-ready."
                  </p>
                </motion.div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 mt-8"
            >
              <motion.a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-5 py-2.5 bg-card/40 backdrop-blur-sm border border-border/30 rounded text-foreground hover:bg-primary/10 transition-colors text-sm"
              >
                <Linkedin size={18} className="text-primary" />
                Connect on LinkedIn
              </motion.a>
              <motion.a
                href="mailto:bharath@vedinc.com"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-5 py-2.5 bg-card/40 backdrop-blur-sm border border-border/30 rounded text-foreground hover:bg-primary/10 transition-colors text-sm"
              >
                <Mail size={18} className="text-primary" />
                bharath@vedinc.com
              </motion.a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MentorSection;