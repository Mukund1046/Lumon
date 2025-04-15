
import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import '../styles/textEffect.css';
import { initTextAnimation } from '../scripts/textAnimation';
import AnimatedText from '../components/ui/AnimatedText';

const Hero: React.FC = () => {
  useEffect(() => {
    // Initialize the text animation when component mounts
    // Small delay to ensure DOM is fully loaded
    const timer = setTimeout(() => {
      initTextAnimation();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Initialize the bulge effect
  useEffect(() => {
    // Load the bulge effect script
    const script = document.createElement('script');
    script.src = '/assets/js/effects/bulgeEffect.js';
    script.async = true;
    document.head.appendChild(script);

    // Initialize the bulge effect when the script is loaded
    script.onload = () => {
      const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement;
      if (canvas && window.BulgeEffect) {
        // Create the bulge effect with optimal parameters
        new window.BulgeEffect({
          canvas,
          image: '/assets/severance126.jpg',
          strength: 2.0,  // Higher strength for more pronounced effect
          radius: 0.4     // Smaller radius for more focused effect
        });

        console.log('Bulge effect initialized');
      }
    };

    return () => {
      // Clean up the script when the component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);
  return (
    <section
      id="home"
      className="relative min-h-screen pt-16 sm:pt-20 pb-8 sm:pb-12 flex items-center overflow-hidden"
    >
      {/* Background image with bulge effect */}
      <div
        className="absolute inset-0"
        data-scroll data-scroll-speed="-0.2"
      >
        <canvas id="hero-canvas" className="w-full h-full object-cover"></canvas>
      </div>

      {/* Fallback background image (hidden when WebGL works) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: 'url(/assets/severance126.jpg)' }}
      ></div>

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay animate-noise"
        style={{ backgroundImage: 'url(/assets/noise.png)', backgroundRepeat: 'repeat' }}
        data-scroll data-scroll-speed="-0.15"
      ></div>

      {/* Simple dark overlay for text readability */}
      <div
        className="absolute inset-0 bg-severance-midnight/50"
        data-scroll data-scroll-speed="-0.1"
      ></div>

      <div className="container-custom relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Primary headline with increased contrast and hierarchy */}
          <div className="mb-2 sm:mb-4 overflow-hidden">
            <h1
              className="hero-text text-5xl xs:text-6xl sm:text-7xl md:text-8xl font-trap font-trap-bold leading-none tracking-tighter text-center"
              data-scroll
              data-scroll-speed="1"
              data-scroll-delay="0.1"
            >
              WORK-LIFE
              <span>WORK-LIFE</span>
            </h1>
          </div>

          {/* Refined secondary headline */}
          <div
            className="mb-3 sm:mb-4 overflow-hidden"
            data-scroll
            data-scroll-speed="1"
            data-scroll-delay="0.2"
          >
            <h2 className="text-xl xs:text-2xl sm:text-3xl font-trap font-trap-medium tracking-tight text-severance-frost/80 text-center transform translate-y-full animate-slide-up px-2">
              SEVERANCE TECHNOLOGY BY LUMON
            </h2>
          </div>

          {/* Shorter, lighter paragraph with better contrast */}
          <div
            className="mb-6 sm:mb-8 max-w-xl mx-auto overflow-hidden px-4 sm:px-6"
            data-scroll
            data-scroll-speed="1.2"
          >
            <AnimatedText
              text="Experience complete separation between work and personal life. Our revolutionary procedure ensures your work self and home self remain distinct entities."
              className="font-jakarta text-sm sm:text-base font-light text-severance-frost/80 text-center leading-relaxed"
              delay={0.02}
            />
          </div>

          {/* Single centered CTA button */}
          <div
            className="opacity-0 animate-fade-in animate-delay-300 flex justify-center"
            data-scroll
            data-scroll-speed="1.5"
          >
            <Link to="/join-us" className="group">
              <span className="lumon-button primary jetbrains-mono-button flex items-center px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm bg-severance-frost text-severance-midnight hover:bg-severance-frost/90 transition-all duration-300 shadow-md">
                Apply for Severance
                <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Simple decorative element */}
      <div
        className={cn(
          "absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-6xl h-px bg-gradient-to-r",
          "from-transparent via-severance-frost/30 to-transparent"
        )}
        data-scroll
        data-scroll-speed="2"
      ></div>
    </section>
  );
};

export default Hero;
