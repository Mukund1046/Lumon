
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import '../styles/textEffect.css';
import '../styles/heroMobile.css';
import '../styles/severanceOpening.css';
import '../styles/responsiveBackground.css';
import '../styles/elevatorEffect.css';
import AnimatedText from '../components/ui/AnimatedText';

interface HeroProps {
  loadingComplete?: boolean;
}

const Hero: React.FC<HeroProps> = ({ loadingComplete = false }) => {
  // State to track if we're on a mobile device
  const [isMobile, setIsMobile] = useState(false);
  // Reference for the audio element
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasPlayedAudioRef = useRef(false);
  // State to track if the audio has been played
  const [audioPlayed, setAudioPlayed] = useState(false);
  // State to track if the audio is currently playing
  const [audioPlaying, setAudioPlaying] = useState(false);
  // State to track if the audio has completed
  const [audioComplete, setAudioComplete] = useState(false);

  // Check if we're on a mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768 ||
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };

    // Check initially
    checkMobile();

    // Check on resize
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reference for the main heading
  const mainHeadingRef = useRef<HTMLDivElement>(null);

  // Browsers deliberately block audible autoplay. Calling this directly from a
  // tap/click/key press makes the first visit reliable without bypass attempts.
  const playElevatorSound = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || hasPlayedAudioRef.current) return;

    try {
      audio.volume = 1;
      audio.muted = false;
      await audio.play();
      hasPlayedAudioRef.current = true;
      setAudioPlayed(true);
      setAudioPlaying(true);
      audio.onended = () => {
        setAudioPlaying(false);
        setAudioComplete(true);
      };
    } catch {
      setAudioPlaying(false);
    }
  }, []);

  // Initialize the Severance opening animation
  useEffect(() => {
    // Only run animation if loading is complete
    if (!loadingComplete) return;

    // Add animated class to trigger CSS transitions
    if (mainHeadingRef.current) {
      mainHeadingRef.current.classList.add('animated');
      console.log('Hero entrance animation started');
    }
  }, [loadingComplete]);

  // The elevator chime is started by the bulge animation (below). Browsers
  // block audible autoplay until the user has interacted, so as a fallback we
  // retry on the next real gesture — but only while the home page is mounted
  // and never on navigation links, so the chime never rings while leaving home.
  useEffect(() => {
    if (!loadingComplete || isMobile) return;

    const handleGesture = (e: PointerEvent | KeyboardEvent) => {
      if (hasPlayedAudioRef.current) return;
      const target = e.target as Element | null;
      if (target?.closest('a[href], [data-nav-link="true"]')) return;
      void playElevatorSound();
    };

    document.addEventListener('pointerdown', handleGesture, true);
    document.addEventListener('keydown', handleGesture, true);
    return () => {
      document.removeEventListener('pointerdown', handleGesture, true);
      document.removeEventListener('keydown', handleGesture, true);
    };
  }, [loadingComplete, isMobile, playElevatorSound]);

  // Initialize the bulge effect
  useEffect(() => {
    // Only initialize after loading is complete
    if (!loadingComplete || isMobile) return;

    // Load the bulge effect script
    const script = document.createElement('script');
    script.src = '/assets/js/effects/bulgeEffect.js';
    script.async = true;
    document.head.appendChild(script);

    // Initialize the bulge effect when the script is loaded
    script.onload = () => {
      const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement;
      if (canvas && window.BulgeEffect) {
        // Parameters are defined directly in the BulgeEffect constructor

        // Create the bulge effect instance
        const bulgeEffect = new window.BulgeEffect({
          canvas,
          image: '/Mark-optimized.jpg',
          strength: 2.5,
          radius: 0.5
        });

        // The Severance elevator chime is about 5 seconds long
        // We need to synchronize the bulge effect with the audio

        // Start the elevator chime in sync with the bulge animation
        void playElevatorSound();

        // If the bulge effect has a setStrength method, we can use it to create a pulsing effect
        // that matches the elevator chime sound
        if (bulgeEffect.setStrength && bulgeEffect.setRadius) {
          // Initial strength
          const initialStrength = 2.5;
          const initialRadius = 0.5;

          // Create a timeline that matches the elevator chime sound
          // The chime has a distinctive pattern at around 0.5s, 1.5s, and 3s

          // First chime (0.5s) - increase strength
          setTimeout(() => {
            bulgeEffect.setStrength(initialStrength * 1.5);
            bulgeEffect.setRadius(initialRadius * 1.2);
          }, 500);

          // Return to normal (1.0s)
          setTimeout(() => {
            bulgeEffect.setStrength(initialStrength);
            bulgeEffect.setRadius(initialRadius);
          }, 1000);

          // Second chime (1.5s) - increase strength again
          setTimeout(() => {
            bulgeEffect.setStrength(initialStrength * 1.8);
            bulgeEffect.setRadius(initialRadius * 1.4);
          }, 1500);

          // Return to normal (2.0s)
          setTimeout(() => {
            bulgeEffect.setStrength(initialStrength);
            bulgeEffect.setRadius(initialRadius);
          }, 2000);

          // Third chime (3.0s) - maximum strength for the final transition
          setTimeout(() => {
            bulgeEffect.setStrength(initialStrength * 2.2);
            bulgeEffect.setRadius(initialRadius * 1.6);
          }, 3000);

          // Final return to normal (4.0s)
          setTimeout(() => {
            bulgeEffect.setStrength(initialStrength);
            bulgeEffect.setRadius(initialRadius);
          }, 4000);
        }

        console.log('Bulge effect initialized (desktop mode)');

        // Enhanced canvas sizing function
        const resizeCanvas = () => {
          // Get the parent container dimensions
          const container = canvas.parentElement;
          if (!container) return;

          const displayWidth = container.clientWidth;
          const displayHeight = container.clientHeight;

          // Update canvas dimensions if they don't match the display dimensions
          if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
            canvas.width = displayWidth;
            canvas.height = displayHeight;

            // Force redraw after resize
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            console.log(`Canvas resized to ${displayWidth}x${displayHeight}`);
          }
        };

        // Initial resize
        resizeCanvas();

        // Resize on window resize with debounce
        let resizeTimeout: number | null = null;
        const handleResize = () => {
          if (resizeTimeout) {
            window.clearTimeout(resizeTimeout);
          }
          resizeTimeout = window.setTimeout(() => {
            resizeCanvas();
          }, 100);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);

        // Return cleanup function
        return () => {
          window.removeEventListener('resize', handleResize);
          window.removeEventListener('orientationchange', handleResize);
          if (resizeTimeout) {
            window.clearTimeout(resizeTimeout);
          }
        };
      }
    };

    return () => {
      // Clean up the script when the component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [isMobile, loadingComplete, playElevatorSound]);
  return (
    <section
      id="home"
      className={cn(
        "relative min-h-screen pt-16 sm:pt-20 pb-8 sm:pb-12 flex items-center overflow-hidden",
        "elevator-scene elevator-zoom", // Add elevator scene classes
        audioPlaying && "audio-playing", // Add class when audio is playing
        audioComplete && "audio-complete", // Add class when audio is complete
        isMobile && "hero-mobile" // Add mobile-specific class
      )}
    >
      {/* Audio element for elevator chime sound */}
      <audio
        ref={audioRef}
        preload="metadata"
        className="hidden"
        controls={false}
      >
        <source src="/Severance.mp3" type="audio/mpeg" />
        <track kind="captions" src="/captions/elevator-chime.vtt" srcLang="en" label="English" />
        Your browser does not support the audio element.
      </audio>

      {/* Background image with bulge effect */}
      {!isMobile && (
        <div
          className="absolute inset-0 z-[1] overflow-hidden"
          data-scroll data-scroll-speed="-0.2"
        >
          <canvas id="hero-canvas" className="w-full h-full object-cover"></canvas>
        </div>
      )}

      {/* Fallback background image (hidden when WebGL works) */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: 'url(/Mark-optimized.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top', /* Position at top to show Mark's face looking up */
          width: '100%',
          height: '100%'
        }}
      ></div>

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 z-[2] opacity-30 mix-blend-overlay animate-noise"
        style={{ backgroundImage: 'url(/assets/noise.png)', backgroundRepeat: 'repeat' }}
        data-scroll data-scroll-speed="-0.15"
      ></div>

      {/* Simple dark overlay for text readability */}
      <div
        className="absolute inset-0 z-[3] bg-severance-midnight/50"
        data-scroll data-scroll-speed="-0.1"
      ></div>

      <div className="container-custom relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Primary headline with Severance opening animation - Increased text size and adjusted spacing */}
          <div className="mb-4 sm:mb-6 overflow-hidden">
            <div
              ref={mainHeadingRef}
              className="severance-opening"
              data-scroll
              data-scroll-speed="1"
              data-scroll-delay="0.1"
            >
              <div className="severance-opening__text">
                <h1 className="severance-opening__text-inner text-6xl xs:text-7xl sm:text-8xl md:text-9xl font-trap font-trap-bold leading-none tracking-tighter text-center whitespace-nowrap text-severance-frost">
                  SEVERED LIVES
                </h1>
              </div>
            </div>
          </div>

          {/* Subheading removed to reduce clutter */}

          {/* Shorter, lighter paragraph with better contrast - Consistent spacing */}
          <div
            className="mb-4 sm:mb-6 max-w-2xl mx-auto overflow-hidden px-4 sm:px-6"
            data-scroll
            data-scroll-speed="1.2"
          >
            <AnimatedText
              text="Experience complete separation between work and personal life with our revolutionary procedure. Your work self and home self remain distinct entities, creating perfect balance."
              className="font-jakarta text-xs sm:text-sm md:text-base font-light text-severance-frost/90 text-center leading-tight tracking-wide"
              delay={0.02}
              loadingComplete={loadingComplete}
            />
          </div>

          {/* Single centered CTA button */}
          <div
            className={`opacity-0 ${loadingComplete ? 'animate-fade-in animate-delay-300' : ''} flex justify-center`}
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
