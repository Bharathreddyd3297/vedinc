import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FunkyHeadingProps {
  children: React.ReactNode;
  className?: string;
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  delay?: number;
}

export const FunkyHeading = ({ children, className, headingLevel = 'h2', delay = 0 }: FunkyHeadingProps) => {
  const Tag = headingLevel as any; // framer-motion supports motion.h1, etc. but easiest to just use a wrapper or dynamic component

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: delay,
      }}
      className={cn("relative", className)}
    >
      <Tag 
        className="font-black tracking-tighter text-white transform hover:skew-x-1 transition-transform duration-300 uppercase"
        style={{
            lineHeight: 1.1,
            WebkitTextStroke: "1px rgba(255,255,255,0.1)"
        }}
      >
        {children}
      </Tag>
    </motion.div>
  );
};
