import { useEffect, useRef } from "react";

export default function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 2, // Duration of the animation in seconds
  className = "",
  startWhen = true,
  separator = "",
  onStart,
  onEnd,
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (!startWhen || !ref.current) return;

    const startValue = direction === "down" ? to : from;
    const endValue = direction === "down" ? from : to;
    let animationFrame = 0;
    let startTime = 0;

    const format = (value) => {
      const formatted = Intl.NumberFormat("en-US", {
        useGrouping: !!separator,
        maximumFractionDigits: 0,
      }).format(Math.round(value));

      return separator ? formatted.replace(/,/g, separator) : formatted;
    };

    ref.current.textContent = format(startValue);

    const timeoutId = window.setTimeout(() => {
      onStart?.();

      const animate = (time) => {
        if (!startTime) startTime = time;
        const progress = Math.min((time - startTime) / (duration * 1000), 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        if (ref.current) {
          ref.current.textContent = format(
            startValue + (endValue - startValue) * eased
          );
        }

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          onEnd?.();
        }
      };

      animationFrame = requestAnimationFrame(animate);
    }, delay * 1000);

    return () => {
      window.clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrame);
    };
  }, [delay, direction, duration, from, onEnd, onStart, separator, startWhen, to]);

  return <span className={`${className}`} ref={ref} />;
}
