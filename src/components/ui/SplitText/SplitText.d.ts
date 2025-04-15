declare module '../components/ui/SplitText/SplitText' {
  interface SplitTextProps {
    text: string;
    className?: string;
    delay?: number;
    animationFrom?: Record<string, any>;
    animationTo?: Record<string, any>;
    easing?: string;
    threshold?: number;
    rootMargin?: string;
    textAlign?: string;
    onLetterAnimationComplete?: () => void;
  }

  const SplitText: React.FC<SplitTextProps>;
  export default SplitText;
}
