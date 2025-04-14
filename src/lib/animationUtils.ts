
/**
 * Animation Utility - Provides functions for creating smooth animations
 * Inspired by the transition between severed and unsevered states
 */

/**
 * Creates a staggered animation effect for multiple elements
 * @param elements The DOM elements to animate
 * @param animationClass CSS class to apply for animation
 * @param delay Delay between each element's animation (ms)
 */
export const staggerAnimation = (
  elements: HTMLElement[],
  animationClass: string,
  delay = 100
): void => {
  elements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add(animationClass);
    }, index * delay);
  });
};

/**
 * Adds a scroll-triggered animation to elements
 * @param selector CSS selector for elements to animate
 * @param animationClass CSS class to apply when element is in view
 * @param threshold Percentage of element that must be visible to trigger
 */
export const addScrollAnimation = (
  selector: string,
  animationClass: string,
  threshold = 0.2
): void => {
  const elements = document.querySelectorAll(selector);
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(animationClass);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold }
  );
  
  elements.forEach((el) => observer.observe(el));
};

/**
 * Smooth scroll to an element
 * @param elementId ID of the element to scroll to
 * @param offset Offset from the element (px)
 */
export const scrollToElement = (
  elementId: string,
  offset = 0
): void => {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
};
