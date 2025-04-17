import React, { useEffect, useState, useCallback } from 'react';
import CountUp from '@/components/ui/CountUp/CountUp.jsx';
import VerticalTransition from './VerticalTransition';
import './LoadingAnimation.css';

interface LoadingAnimationProps {
  onLoadingComplete: () => void;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ onLoadingComplete }) => {
  const [isCountingComplete, setIsCountingComplete] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Handle count up completion
  const handleCountUpComplete = useCallback(() => {
    setIsCountingComplete(true);
    setIsTransitioning(true);
  }, []);

  // Handle transition completion
  const handleTransitionComplete = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onLoadingComplete();
    }, 500);
  }, [onLoadingComplete]);

  return (
    <div className={`loading-animation-container ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="loading-content">
        <div className="loading-counter">
          <CountUp
            from={0}
            to={100}
            duration={5}
            className="loading-counter-number"
            onEnd={handleCountUpComplete}
          />
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
