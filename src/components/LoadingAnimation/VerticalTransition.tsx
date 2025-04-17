import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './VerticalTransition.css';

interface VerticalTransitionProps {
  isActive: boolean;
  onTransitionComplete: () => void;
}

const VerticalTransition: React.FC<VerticalTransitionProps> = ({
  isActive,
  onTransitionComplete
}) => {
  const overlayPathRef = useRef<SVGPathElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // SVG paths for the transition
  const paths = {
    step1: {
      unfilled: 'M 0 100 V 100 Q 50 100 100 100 V 100 z',
      inBetween: {
        curve1: 'M 0 100 V 50 Q 50 0 100 50 V 100 z',
        curve2: 'M 0 100 V 50 Q 50 100 100 50 V 100 z'
      },
      filled: 'M 0 100 V 0 Q 50 0 100 0 V 100 z',
    },
    step2: {
      filled: 'M 0 0 V 100 Q 50 100 100 100 V 0 z',
      inBetween: {
        curve1: 'M 0 0 V 50 Q 50 0 100 50 V 0 z',
        curve2: 'M 0 0 V 50 Q 50 100 100 50 V 0 z'
      },
      unfilled: 'M 0 0 V 0 Q 50 0 100 0 V 0 z',
    }
  };

  // Trigger the transition when isActive changes to true
  useEffect(() => {
    if (isActive && !isAnimating && overlayPathRef.current) {
      setIsAnimating(true);

      // Adjust durations for mobile devices
      const duration1 = isMobile ? 0.6 : 0.8; // Slightly faster on mobile
      const duration2 = isMobile ? 0.15 : 0.2; // Slightly faster on mobile
      const duration3 = isMobile ? 0.8 : 1.0; // Slightly faster on mobile

      // Animation timeline
      gsap.timeline({
        onComplete: () => {
          setIsAnimating(false);
          onTransitionComplete();
        }
      })
      .set(overlayPathRef.current, {
        attr: { d: paths.step1.unfilled }
      })
      .to(overlayPathRef.current, {
        duration: duration1,
        ease: isMobile ? 'power3.in' : 'power4.in', // Smoother ease on mobile
        attr: { d: paths.step1.inBetween.curve1 }
      }, 0)
      .to(overlayPathRef.current, {
        duration: duration2,
        ease: 'power1',
        attr: { d: paths.step1.filled }
      })
      .set(overlayPathRef.current, {
        attr: { d: paths.step2.filled }
      })
      .to(overlayPathRef.current, {
        duration: duration2,
        ease: 'sine.in',
        attr: { d: paths.step2.inBetween.curve1 }
      })
      .to(overlayPathRef.current, {
        duration: duration3,
        ease: isMobile ? 'power3.out' : 'power4', // Smoother ease on mobile
        attr: { d: paths.step2.unfilled }
      });
    }
  }, [isActive, isAnimating, onTransitionComplete, isMobile]);

  // Detect if we're on a large screen or mobile device
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsLargeScreen(width >= 1280);
      setIsMobile(width <= 768);
    };

    // Check initially
    checkScreenSize();

    // Add resize listener
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <svg
      className={`vertical-transition-overlay ${isActive ? 'active' : ''} ${isLargeScreen ? 'large-screen' : ''} ${isMobile ? 'mobile' : ''}`}
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <path
        ref={overlayPathRef}
        className="vertical-transition-overlay__path"
        vector-effect="non-scaling-stroke"
        d={paths.step1.unfilled}
      />
    </svg>
  );
};

export default VerticalTransition;
