import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three'; 

declare global {
  interface Window {
    VANTA: any;
  }
}

interface VantaBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

const VantaBackground = ({ children, className = '' }: VantaBackgroundProps) => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  useEffect(() => {
    const loadVanta = async () => {
      try {
        if (!vantaRef.current) return;

        // Import the NET effect
        const NET = await import('vanta/dist/vanta.net.min');

        // Only initialize if it hasn't been created yet
        if (!vantaEffect) {
          const effect = NET.default({
            el: vantaRef.current,
            THREE: THREE, 
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            // Updated colors and settings from your script
            color: 0x8ebde5,
            backgroundColor: 0x000000,
            showDots: false, // Turned off dots per your script
            points: 10.0,
            maxDistance: 20.0,
            spacing: 15.0
          });
          setVantaEffect(effect);
        }
      } catch (err) {
        console.error('Vanta Net init error:', err);
      }
    };

    loadVanta();

    // Cleanup on unmount
    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, [vantaEffect]);

  return (
    <div
      ref={vantaRef}
      className={`relative w-full min-h-screen ${className}`}
    >
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
};

export default VantaBackground;