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
        duration: 0.8,
        ease: 'power4.in',
        attr: { d: paths.step1.inBetween.curve1 }
      }, 0)
      .to(overlayPathRef.current, { 
        duration: 0.2,
        ease: 'power1',
        attr: { d: paths.step1.filled }
      })
      .set(overlayPathRef.current, { 
        attr: { d: paths.step2.filled }
      })
      .to(overlayPathRef.current, { 
        duration: 0.2,
        ease: 'sine.in',
        attr: { d: paths.step2.inBetween.curve1 }
      })
      .to(overlayPathRef.current, { 
        duration: 1,
        ease: 'power4',
        attr: { d: paths.step2.unfilled }
      });
    }
  }, [isActive, isAnimating, onTransitionComplete]);

  return (
    <svg 
      className={`vertical-transition-overlay ${isActive ? 'active' : ''}`} 
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
