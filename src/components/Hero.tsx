
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

  // Function to play the elevator chime sound
  const playElevatorSound = useCallback(() => {
    if (audioRef.current && !audioPlayed) {
      console.log('Attempting to play elevator sound...');

      // Create a user interaction event to work around autoplay restrictions
      const userInteraction = () => {
        if (audioRef.current) {
          // Set audio playing state
          setAudioPlaying(true);

          // Set volume to maximum
          audioRef.current.volume = 1.0;

          // Make sure it's not muted
          audioRef.current.muted = false;

          // Load the audio
          audioRef.current.load();

          // Play the audio
          const playPromise = audioRef.current.play();

          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setAudioPlayed(true);
                console.log('Elevator chime sound played successfully');

                // Add event listener for when audio ends
                audioRef.current?.addEventListener('ended', () => {
                  setAudioPlaying(false);
                  setAudioComplete(true);
                  console.log('Elevator chime sound completed');
                });
              })
              .catch(error => {
                console.error('Error playing audio:', error);
                setAudioPlaying(false);

                // Try again with user interaction
                document.addEventListener('click', function playOnClick() {
                  if (audioRef.current) {
                    audioRef.current.play()
                      .then(() => {
                        setAudioPlayed(true);
                        console.log('Elevator chime sound played on click');
                      })
                      .catch(e => console.error('Still failed to play:', e));
                  }
                  document.removeEventListener('click', playOnClick);
                }, { once: true });
              });
          }
        }
      };

      // Execute immediately - this might work if the user has already interacted with the page
      userInteraction();
    }
  }, [audioPlayed]);

  // Initialize the Severance opening animation
  useEffect(() => {
    // Only run animation if loading is complete
    if (!loadingComplete) return;

    // Add animated class to trigger CSS transitions
    if (mainHeadingRef.current) {
      mainHeadingRef.current.classList.add('animated');
      console.log('Hero entrance animation started');

      // Check if this is the first load (after the loading animation)
      const isFirstLoad = sessionStorage.getItem('hasPlayedAudio') !== 'true';

      if (isFirstLoad) {
        // Mark that we've played the audio
        sessionStorage.setItem('hasPlayedAudio', 'true');

        // Wait a short moment for the animation to start before playing the sound
        setTimeout(() => {
          playElevatorSound();
        }, 100);
      }
    }
  }, [loadingComplete, playElevatorSound]); // Re-run when loadingComplete changes

  // Add a click handler to the document to enable audio playback
  useEffect(() => {
    // Only add the click handler if loading is complete and audio hasn't played yet
    if (!loadingComplete || audioPlayed) return;

    const handleUserInteraction = () => {
      if (audioRef.current && !audioPlayed) {
        // Try to play the audio on user interaction
        audioRef.current.play()
          .then(() => {
            setAudioPlayed(true);
            setAudioPlaying(true);
            console.log('Audio played on user interaction');
          })
          .catch(error => {
            console.error('Failed to play audio on user interaction:', error);
          });
      }
    };

    // Add the click handler to the document
    document.addEventListener('click', handleUserInteraction, { once: true });

    // Clean up the event listener
    return () => {
      document.removeEventListener('click', handleUserInteraction);
    };
  }, [loadingComplete, audioPlayed]);

  // Initialize the bulge effect
  useEffect(() => {
    // Only initialize after loading is complete
    if (!loadingComplete) return;

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
          image: '/Mark.jpg',
          strength: isMobile ? 2.0 : 2.5,  // Increased strength for more dramatic effect
          radius: isMobile ? 0.6 : 0.5     // Increased radius for more dramatic effect
        });

        // The Severance elevator chime is about 5 seconds long
        // We need to synchronize the bulge effect with the audio

        // Check if this is NOT the first load (we don't want to play the audio twice)
        const isFirstLoad = sessionStorage.getItem('hasPlayedAudio') === 'true';

        // If this is not the first load (e.g., coming back from another page),
        // then play the audio here
        if (!isFirstLoad) {
          // Don't play the audio here on first load, as it will be played by the
          // opening animation effect above
          console.log('Not playing audio in bulge effect - first load');
        }

        // If the bulge effect has a setStrength method, we can use it to create a pulsing effect
        // that matches the elevator chime sound
        if (bulgeEffect.setStrength && bulgeEffect.setRadius) {
          // Initial strength
          let initialStrength = isMobile ? 2.0 : 2.5;
          let initialRadius = isMobile ? 0.6 : 0.5;

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

        console.log(`Bulge effect initialized (${isMobile ? 'mobile' : 'desktop'} mode)`);

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
  }, [isMobile, loadingComplete, playElevatorSound]); // Add loadingComplete and playElevatorSound as dependencies
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
        preload="auto"
        className="hidden"
        playsInline
        controls={false}
      >
        <source src="/Severance.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Play button for the elevator sound effect */}
      <button
        onClick={() => {
          // Reset the audio played state in session storage
          sessionStorage.removeItem('hasPlayedAudio');
          // Play the elevator sound
          playElevatorSound();
        }}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          padding: '10px',
          background: 'rgba(0,0,0,0.5)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        Play Elevator Sound
      </button>
      {/* Background image with bulge effect */}
      <div
        className="absolute inset-0 z-0 overflow-hidden"
        data-scroll data-scroll-speed="-0.2"
      >
        <canvas id="hero-canvas" className="w-full h-full object-cover"></canvas>
      </div>

      {/* Fallback background image (hidden when WebGL works) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10 overflow-hidden"
        style={{
          backgroundImage: 'url(/Mark.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top', /* Position at top to show Mark's face looking up */
          width: '100%',
          height: '100%'
        }}
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
