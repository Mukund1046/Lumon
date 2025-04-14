
import { useEffect, useRef, RefObject } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

interface UseLocomotiveScrollOptions {
  ref: RefObject<HTMLElement>;
  smooth?: boolean;
  multiplier?: number;
  lerp?: number;
  class?: string;
  getDirection?: boolean;
  smoothMobile?: boolean;
}

export const useLocomotiveScroll = ({
  ref,
  smooth = true,
  multiplier = 1,
  lerp = 0.1,
  class: className = 'data-scroll',
  getDirection = false,
  smoothMobile = false,
}: UseLocomotiveScrollOptions) => {
  const locomotiveScrollRef = useRef<LocomotiveScroll | null>(null);

  useEffect(() => {
    if (ref.current) {
      locomotiveScrollRef.current = new LocomotiveScroll({
        el: ref.current,
        smooth,
        multiplier,
        lerp,
        class: className,
        getDirection,
        smoothMobile,
      });
    }

    return () => {
      if (locomotiveScrollRef.current) {
        locomotiveScrollRef.current.destroy();
      }
    };
  }, [ref, smooth, multiplier, lerp, className, getDirection, smoothMobile]);

  return locomotiveScrollRef;
};
