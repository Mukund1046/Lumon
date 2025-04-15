import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Initialize text effect animation
export const initTextAnimation = () => {
  gsap.registerPlugin(ScrollTrigger);

  const textElements = gsap.utils.toArray('.hero-text');

  // Initial animation on page load - fill text from left to right with enhanced effect
  textElements.forEach((text, index) => {
    // Animate the background fill
    gsap.fromTo(text,
      { backgroundSize: '0%' },
      {
        backgroundSize: '100%',
        duration: 1.5,
        delay: 0.2 * index, // Stagger the animations
        ease: 'power2.out'
      }
    );

    // Add a subtle scale animation
    gsap.fromTo(text,
      { scale: 0.95, opacity: 0.7 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        delay: 0.3 * index,
        ease: 'back.out(1.7)'
      }
    );
  });

  // Scroll animation - unfill text from right to left when scrolling down
  textElements.forEach(text => {
    ScrollTrigger.create({
      trigger: text,
      start: 'top 30%', // Start a bit earlier
      end: 'top -80%',  // End a bit later for smoother transition
      scrub: 0.5,       // Add a slight delay for smoother animation
      onUpdate: (self) => {
        // Calculate background size based on scroll progress
        // As we scroll down, reduce from 100% to 0%
        const size = 100 - (self.progress * 100);
        gsap.set(text, { backgroundSize: `${size}%` });
      },
      markers: false     // Set to true for debugging
    });
  });
};
