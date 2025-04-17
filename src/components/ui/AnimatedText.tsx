import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only start animation if loading is complete
    if (!loadingComplete) return;

    // Start animation after a short delay to ensure component is mounted
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [loadingComplete]); // Re-run when loadingComplete changes

  // Split the text into words and then into characters
  const words = text.split(' ').map(word => {
    return {
      word,
      characters: Array.from(word)
    };
  });

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: delay, delayChildren: delay * 2 }
    })
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
        duration: 0.5
      }
    },
    hidden: {
      opacity: 0,
      y: 30,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
        duration: 0.5
      }
    }
  };

  return (
    <motion.p
      className={className}
      style={{ overflow: 'hidden', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
      variants={container}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      viewport={{ once }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ marginRight: '0.5rem', display: 'inline-block' }}>
          {word.characters.map((char, charIndex) => (
            <motion.span
              key={`${wordIndex}-${charIndex}`}
              variants={child}
              style={{ display: 'inline-block', willChange: 'transform' }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.p>
  );
};

export default AnimatedText;
