import React, { useCallback, useEffect, useRef, useState } from 'react';
import VerticalTransition from './VerticalTransition';
import './LoadingAnimation.css';
import { preloadManager } from '@/lib/preloadManager';

interface LoadingAnimationProps {
  onLoadingComplete: () => void;
}

// Guarantee the loading screen is visible long enough to be meaningful even
// when the page is fully cached, while still being driven by real progress.
const MIN_DISPLAY_MS = 1600;

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const startedAtRef = useRef(Date.now());
  const triggeredRef = useRef(false);

  // Subscribe to real background loading progress.
  useEffect(() => {
    const unsubscribe = preloadManager.subscribe((value) => {
      setProgress(value);
    });

    return unsubscribe;
  }, []);

  // When real progress hits 100, wait out the minimum display window, then
  // start the reveal transition. This never plays a fake continuous loading
  // animation — the number only moves when an item actually finishes.
  useEffect(() => {
    if (progress < 100 || triggeredRef.current) return;

    triggeredRef.current = true;
    const elapsed = Date.now() - startedAtRef.current;
    const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);

    const timer = window.setTimeout(() => {
      setIsTransitioning(true);
    }, remaining);

    return () => window.clearTimeout(timer);
  }, [progress]);

  // Handle transition completion
  const handleTransitionComplete = useCallback(() => {
    // Hide the loading animation
    setIsVisible(false);

    // Notify parent component that loading is complete after the fade ends
    setTimeout(() => {
      onLoadingComplete();
    }, 1100);
  }, [onLoadingComplete]);

  return (
    <div className={`loading-animation-container ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="loading-content">
        <div className="loading-counter">
          <span className="loading-counter-number">{progress}</span>
          <span className="loading-counter-percent">%</span>
        </div>
        <div className="loading-label">LOADING</div>
      </div>

      <div className="lumon-logo">LUMON</div>

      <VerticalTransition
        isActive={isTransitioning}
        onTransitionComplete={handleTransitionComplete}
      />
    </div>
  );
};

export default LoadingAnimation;
