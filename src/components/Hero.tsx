
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
  // Reference for the elevator scene video (carries its own elevator audio)
  const videoRef = useRef<HTMLVideoElement | null>(null);
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

  // Start the elevator scene once the reveal has fully cleared: after the
  // loading overlay on first visit, or after the page transition when coming
  // back to home. The video carries its own elevator audio, so it is started
  // unmuted — the audio and picture can never drift apart.
  useEffect(() => {
    if (!loadingComplete || isMobile) return;

    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    let started = false;

    const startVideo = async () => {
      if (cancelled || started) return;
      started = true;
      if (hasPlayedAudioRef.current) return; // already started via a click
      try {
        video.volume = 1;
        video.muted = false;
        await video.play();
        hasPlayedAudioRef.current = true;
        setAudioPlayed(true);
        setAudioPlaying(true);
      } catch {
        // Browsers block audible autoplay on a truly fresh visit. Play muted so
        // the visual still runs, and let the gesture fallback below release the
        // sound (restarting the scene so the audio is heard from the start).
        video.muted = true;
        video.play().catch(() => undefined);
        setAudioPlaying(false);
      }
    };

    const tryStart = () => {
      if (!cancelled && !started) void startVideo();
    };

    // Coming back to home runs a page transition: wait for it to finish before
    // starting the scene so the video is never playing behind the reveal.
    window.addEventListener('lumon:transition-complete', tryStart);

    // If no transition is running (first visit after the preloader), the
    // overlay is already transparent — start right away.
    const probe = window.setTimeout(() => {
      const overlay = document.querySelector<HTMLElement>('.page-transition-overlay');
      const covered = !!overlay && overlay.style.opacity !== '0';
      if (!covered) tryStart();
    }, 120);

    // Safety net in case the event is missed (e.g. a cached back-nav).
    const fallback = window.setTimeout(tryStart, 1800);

    return () => {
      cancelled = true;
      window.removeEventListener('lumon:transition-complete', tryStart);
      window.clearTimeout(probe);
      window.clearTimeout(fallback);
    };
  }, [loadingComplete, isMobile]);

  // Browsers block audible autoplay until the user has interacted, so on a
  // fresh visit (no prior interaction) we release the elevator audio on the
  // first real gesture. Active for the whole time home is mounted — including
  // during the preloader and the return-home transition — so a click on the
  // preloader hint works too. The video is hidden behind the opaque reveal
  // while it starts, so nothing is shown mid-transition. Never fires on
  // navigation links, so the sound never rings while leaving home.
  useEffect(() => {
    if (isMobile) return;

    const handleGesture = (e: PointerEvent | KeyboardEvent) => {
      if (hasPlayedAudioRef.current) return;
      const target = e.target as Element | null;
      if (target?.closest('a[href], [data-nav-link="true"]')) return;
      const video = videoRef.current;
      if (!video) return;
      if (video.ended) video.currentTime = 0;
      video.muted = false;
      video.play()
        .then(() => {
          hasPlayedAudioRef.current = true;
          setAudioPlayed(true);
          setAudioPlaying(true);
        })
        .catch(() => undefined);
    };

    document.addEventListener('pointerdown', handleGesture, true);
    document.addEventListener('keydown', handleGesture, true);
    return () => {
      document.removeEventListener('pointerdown', handleGesture, true);
      document.removeEventListener('keydown', handleGesture, true);
    };
  }, [isMobile]);

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

  const handleVideoEnded = () => {
    setAudioPlaying(false);
    if (hasPlayedAudioRef.current) {
      setAudioComplete(true);
    }
  };

  return (
    <section
      id="home"
      className={cn(
        "relative min-h-screen pt-16 sm:pt-20 pb-8 sm:pb-12 flex items-end overflow-hidden",
        "elevator-scene", // Elevator scene classes
        audioPlaying && "audio-playing", // Add class when audio is playing
        audioComplete && "audio-complete", // Add class when audio is complete
        isMobile && "hero-mobile" // Add mobile-specific class
      )}
    >
      {/* Background motion: elevator scene video (outie → innie), desktop only.
          No loop: the video pauses on its last frame. Started muted-free once
          the page reveal has finished (see effect above). */}
      {!isMobile && (
        <div className="absolute inset-0 z-[1] overflow-hidden">
          <video
            id="hero-video"
            ref={videoRef}
            preload="auto"
            playsInline
            disablePictureInPicture
            onEnded={handleVideoEnded}
            aria-hidden="true"
          >
            <source src="/elevator-scene.mp4" type="video/mp4" />
          </video>
        </div>
      )}

      {/* Fallback background image (hidden when the video works) */}
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

      <div className="relative z-10 w-full px-6 sm:px-12 lg:px-[72px]">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 lg:gap-8">
          {/* Primary headline, bottom-left, 48-64px */}
          <div className="lg:max-w-xl overflow-hidden">
            <div
              ref={mainHeadingRef}
              className="severance-opening"
              data-scroll
              data-scroll-speed="1"
              data-scroll-delay="0.1"
            >
              <div className="severance-opening__text">
                <h1 className="severance-opening__text-inner font-trap font-trap-bold leading-none tracking-tighter text-severance-frost"
                    style={{ fontSize: 'clamp(48px, 5.5vw, 64px)' }}>
                  SEVERED LIVES
                </h1>
              </div>
            </div>
          </div>

          {/* Description and CTA, bottom-right */}
          <div
            className="lg:max-w-xl lg:text-right overflow-hidden"
            data-scroll
            data-scroll-speed="1.2"
          >
            <AnimatedText
              text="Experience complete separation between work and personal life with our revolutionary procedure. Your work self and home self remain distinct entities, creating perfect balance."
              className="font-jakarta text-xs sm:text-sm md:text-base font-light text-severance-frost/90 leading-tight tracking-wide"
              delay={0.02}
              loadingComplete={loadingComplete}
            />

            <div className={`opacity-0 ${loadingComplete ? 'animate-fade-in animate-delay-300' : ''} mt-6 sm:mt-8 lg:flex lg:justify-end`}>
              <Link to="/join-us" className="group">
                <span className="lumon-button primary jetbrains-mono-button flex items-center px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm bg-severance-frost text-severance-midnight hover:bg-severance-frost/90 transition-all duration-300 shadow-md">
                  Apply for Severance
                  <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
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
