import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll, Variants } from 'framer-motion';
import { FunkyHeading } from "@/components/ui/FunkyHeading";

// --- Logo Imports ---
import azureLogo from '@/assets/azure-color-removebg-preview.png';
import dockerLogo from '@/assets/docker_logo-removebg-preview.png';
import k8sLogo from '@/assets/OIP-removebg-preview.png';
import gitLogo from '@/assets/git-removebg-preview.png';
import jenkinsLogo from '@/assets/Jenkins-removebg-preview.png';
import terraformLogo from '@/assets/terraform-logo-removebg-preview.png';
import linuxLogo from '@/assets/linux-tux-logo-png-transparent-svg-vector-bie-supply-14.png';
import pythonLogo from '@/assets/python logo.png';
import helmLogo from '@/assets/helm_logo-removebg-preview.png';
import prometheusLogo from '@/assets/prometheous_logo-removebg-preview.png';
import grafanaLogo from '@/assets/Grafana-removebg-preview.png';
import vsCodeLogo from '@/assets/vsc_logo-removebg-preview.png';
import azureBoardsLogo from '@/assets/azure-boards-removebg-preview.png';
import azureReposLogo from '@/assets/azure_repos.png';
import azurePipelinesLogo from '@/assets/azure-pipelines-removebg-preview.png';
import azureTestPlansLogo from '@/assets/Icon-AzureTestPlans.png';
import azureArtifactsLogo from '@/assets/azure-artifacts.png';
import istioLogo from '@/assets/Istio-removebg-preview.png';

const tools = [
  { name: 'Azure', logo: azureLogo, size: 100, mobileSize: 70, glow: 'rgba(0, 120, 212, 0.6)' },
  { name: 'Docker', logo: dockerLogo, size: 75, mobileSize: 50, glow: 'rgba(36, 150, 237, 0.5)' },
  { name: 'Linux', logo: linuxLogo, size: 75, mobileSize: 50, glow: 'rgba(255, 215, 0, 0.4)' },
  { name: 'Git', logo: gitLogo, size: 65, mobileSize: 38, glow: 'rgba(240, 80, 50, 0.5)' },
  { name: 'VS Code', logo: vsCodeLogo, size: 72, mobileSize: 42, glow: 'rgba(0, 122, 204, 0.5)' },
  { name: 'Kubernetes', logo: k8sLogo, size: 85, mobileSize: 55, glow: 'rgba(50, 108, 230, 0.5)' },
  { name: 'Terraform', logo: terraformLogo, size: 70, mobileSize: 45, glow: 'rgba(132, 73, 229, 0.5)' },
  { name: 'Python', logo: pythonLogo, size: 70, mobileSize: 45, glow: 'rgba(55, 115, 165, 0.5)' },
  { name: 'Helm', logo: helmLogo, size: 65, mobileSize: 38, glow: 'rgba(15, 172, 230, 0.5)' },
  { name: 'Prometheus', logo: prometheusLogo, size: 70, mobileSize: 45, glow: 'rgba(230, 82, 44, 0.5)' },
  { name: 'Grafana', logo: grafanaLogo, size: 70, mobileSize: 45, glow: 'rgba(244, 104, 34, 0.5)' },
  { name: 'Azure Boards', logo: azureBoardsLogo, size: 70, mobileSize: 45, glow: 'rgba(0, 120, 212, 0.5)' },
  { name: 'Azure Repos', logo: azureReposLogo, size: 70, mobileSize: 45, glow: 'rgba(255, 80, 0, 0.5)' },
  { name: 'Azure Pipelines', logo: azurePipelinesLogo, size: 70, mobileSize: 45, glow: 'rgba(0, 100, 200, 0.5)' },
  { name: 'Azure Test Plans', logo: azureTestPlansLogo, size: 70, mobileSize: 45, glow: 'rgba(0, 180, 0, 0.5)' },
  { name: 'Azure Artifacts', logo: azureArtifactsLogo, size: 70, mobileSize: 45, glow: 'rgba(200, 50, 200, 0.5)' },
  { name: 'Istio', logo: istioLogo, size: 70, mobileSize: 45, glow: 'rgba(70, 107, 186, 0.5)' },
];



const FloatingTool = ({ tool, index, pos, mouseX, mouseY, rotation = 0 }: any) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Scale and offset adjustment to keep tools visible and out of heading/footer
  const scale = isMobile ? 0.45 : 1;
  const horizontalSpread = isMobile ? 0.8 : 1.2;
  const verticalStretch = isMobile ? 0.8 : 0.7;

  const finalX = pos.x * scale * horizontalSpread;
  const finalY = pos.y * scale * verticalStretch + (isMobile ? 30 : 0);

  const springConfig = { stiffness: 40, damping: 30 };
  const x = useSpring(useTransform(mouseX, [-500, 500], [finalX - 15, finalX + 15]), springConfig);
  const y = useSpring(useTransform(mouseY, [-300, 300], [finalY - 10, finalY + 10]), springConfig);

  return (
    <motion.div
      style={{ x, y }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
    >
      <motion.div
        whileHover={{ scale: 1.1, zIndex: 100 }}
        className="relative group flex flex-col items-center cursor-pointer"
      >
        <div
          className="absolute inset-0 blur-[30px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ backgroundColor: tool.glow, transform: 'scale(1.3)' }}
        />

        <motion.div
          animate={{ y: [0, (index % 2 === 0 ? -5 : 5), 0] }}
          transition={{ duration: 4 + (index % 3), repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10"
        >
          <img
            src={tool.logo}
            alt={tool.name}
            style={{ width: isMobile ? tool.mobileSize : tool.size }}
            className="object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]"
          />
          <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-white text-[10px] md:text-xs font-semibold bg-[#0f172a]/95 border border-white/20 px-3 py-1.5 rounded-full transition-all duration-300 whitespace-nowrap backdrop-blur-md shadow-2xl">
            {tool.name}
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};



const ToolsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const positions = useMemo(() => {
    const posArr: { x: number; y: number }[] = [];

    const orbits = [
      { radius: 280, items: 6 },
      { radius: 460, items: 11 }
    ];

    let currentItem = 0;

    orbits.forEach((orbit, orbitIdx) => {
      for (let i = 0; i < orbit.items; i++) {
        if (currentItem >= tools.length) break;

        const angle = (2 * Math.PI * i) / orbit.items + (orbitIdx * 0.5);
        const radius = orbit.radius;

        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        posArr.push({ x, y });
        currentItem++;
      }
    });

    while (posArr.length < tools.length) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 600 + Math.random() * 100;
      posArr.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
    }

    return posArr;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - (rect.left + rect.width / 2));
      mouseY.set(e.clientY - (rect.top + rect.height / 2));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const sideX = useTransform(scrollYProgress, [0, 0.4], [-200, 0]);
  const sideOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="min-h-[120vh] relative bg-transparent overflow-x-hidden flex flex-col items-center justify-center py-20"
    >

      {/* Vertical Side Heading - Pure Scroll Parallax */}
      <div className="absolute left-8 md:left-16 top-0 bottom-0 flex items-center z-40">
        <motion.div
          style={{ x: sideX, opacity: sideOpacity }}
        >
          <h2
            className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-100 uppercase tracking-tighter whitespace-nowrap"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Tech Stack
          </h2>
        </motion.div>
      </div>

      <div className="relative h-[600px] md:h-[700px] w-full max-w-[90vw] z-20 flex items-center justify-center">
        {/* Central Azure Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="absolute z-50 pointer-events-none flex flex-col items-center"
        >
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            {/* Glow effect behind Azure */}
            <div className="absolute inset-0 blur-[60px] bg-blue-600/20 rounded-full scale-150" />
            <img
              src={azureLogo}
              alt="Azure"
              className="w-32 h-32 md:w-56 md:h-56 object-contain relative z-10 filter drop-shadow-[0_0_30px_rgba(0,120,212,0.3)]"
            />
          </motion.div>
        </motion.div>

        {/* Other Tools orbiting */}
        {tools.filter(t => t.name !== 'Azure').map((tool, index) => (
          <motion.div
            key={tool.name}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 * index, duration: 0.8, ease: "backOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <FloatingTool
              tool={tool}
              index={index}
              pos={positions[index]}
              mouseX={mouseX}
              mouseY={mouseY}
            />
          </motion.div>
        ))}
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,18,45,0.4),transparent_70%)] pointer-events-none" />
    </section>
  );
};
export default ToolsSection;