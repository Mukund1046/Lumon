import { useEffect, useRef } from 'react';

interface UseLenisScrollOptions {
  lerp?: number;
  smoothWheel?: boolean;
  wheelMultiplier?: number;
  touchMultiplier?: number;
  infinite?: boolean;
}

export const useLenisScroll = ({
  lerp = 0.1,
  smoothWheel = true,
  wheelMultiplier = 1,
  touchMultiplier = 1,
  infinite = false,
}: UseLenisScrollOptions = {}) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Check if Lenis is available in the window object
    if (typeof window !== 'undefined' && window.Lenis) {
      // Initialize Lenis
      lenisRef.current = new window.Lenis({
        lerp,
        smoothWheel,
        wheelMultiplier,
        touchMultiplier,
        infinite,
      });

      // Connect Lenis to ScrollTrigger
      if (window.ScrollTrigger) {
        lenisRef.current.on('scroll', () => window.ScrollTrigger.update());
      }

      // Create the animation frame loop
      const scrollFn = (time) => {
        if (lenisRef.current) {
          lenisRef.current.raf(time);
        }
        requestAnimationFrame(scrollFn);
      };
      
      // Start the animation frame loop
      requestAnimationFrame(scrollFn);

      // Cleanup function
      return () => {
        if (lenisRef.current) {
          lenisRef.current.destroy();
          lenisRef.current = null;
        }
      };
    } else {
      console.warn('Lenis is not available. Make sure to include the Lenis library in your project.');
    }
  }, [lerp, smoothWheel, wheelMultiplier, touchMultiplier, infinite]);

  return lenisRef;
};
