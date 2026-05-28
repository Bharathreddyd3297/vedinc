import { motion } from 'framer-motion';
import VantaBackground from '../VantaBackground';
import vedinbg from '@/assets/vedinbg1.png';

const HeroSection = () => {
  const heroContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };

  const heroItem = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7 },
    },
  };

  return (
    <VantaBackground className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        <motion.div
          className="relative flex flex-col items-center"
          variants={heroContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Logo */}
          <motion.img
            variants={heroItem}
            src={vedinbg}
            alt="Vedinc Logo"
            className="h-24 md:h-40 lg:h-48 w-auto mx-auto object-contain"
            style={{
              marginBottom: '0.75rem',
            }}
          />

          {/* Subheading */}
          <motion.p
            variants={heroItem}
            className="text-base md:text-lg lg:text-xl text-white font-black font-sans tracking-[0.2em] md:tracking-[0.3em] uppercase opacity-90"
          >
            IT, SUPER SIMPLIFIED
          </motion.p>
        </motion.div>
      </motion.div>
    </VantaBackground>
  );
};

export default HeroSection;
