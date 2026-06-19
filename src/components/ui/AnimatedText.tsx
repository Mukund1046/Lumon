import React from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
  loadingComplete?: boolean;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className = '',
  delay = 0.03,
  once = true,
  loadingComplete = false
}) => {
  void delay;
  void once;

  return (
    <p
      className={`${className} hero-copy ${loadingComplete ? "hero-copy--visible" : ""}`}
    >
      {text}
    </p>
  );
};

export default AnimatedText;
