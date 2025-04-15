import { TextAnimator } from './text-animator.js';

export const initNavTextAnimation = () => {
  console.log('Initializing nav text animation');

  // Check if scripts are loaded
  if (typeof window.SplitType === 'undefined' || typeof window.gsap === 'undefined') {
    console.log('Loading required scripts...');

    // Load SplitType if not already loaded
    if (typeof window.SplitType === 'undefined') {
      const splitTypeScript = document.createElement('script');
      splitTypeScript.src = '/assets/js/split-type.min.js';
      splitTypeScript.onload = () => console.log('SplitType loaded successfully');
      splitTypeScript.onerror = () => console.error('Failed to load SplitType');
      document.head.appendChild(splitTypeScript);
    }

    // Load GSAP if not already loaded
    if (typeof window.gsap === 'undefined') {
      const gsapScript = document.createElement('script');
      gsapScript.src = '/assets/js/gsap.min.js';
      gsapScript.onload = () => console.log('GSAP loaded successfully');
      gsapScript.onerror = () => console.error('Failed to load GSAP');
      document.head.appendChild(gsapScript);
    }

    // Wait for scripts to load
    const checkScriptsLoaded = setInterval(() => {
      console.log('Checking if scripts are loaded...');
      if (typeof window.SplitType !== 'undefined' && typeof window.gsap !== 'undefined') {
        console.log('Both scripts loaded, initializing animations');
        clearInterval(checkScriptsLoaded);
        initAnimations();
      }
    }, 100);

    // Timeout after 5 seconds
    setTimeout(() => {
      clearInterval(checkScriptsLoaded);
      console.log('Script loading status:', {
        SplitType: typeof window.SplitType !== 'undefined',
        GSAP: typeof window.gsap !== 'undefined'
      });

      // Try to initialize anyway
      initAnimations();
    }, 5000);
  } else {
    console.log('Scripts already loaded, initializing animations');
    initAnimations();
  }
};

const initAnimations = () => {
  console.log('Setting up animations');

  // Find all nav links
  const navLinks = document.querySelectorAll('.nav-link');
  console.log(`Found ${navLinks.length} navigation links`);

  // Add the hover-effect class to all nav links
  navLinks.forEach((link, index) => {
    console.log(`Processing link ${index + 1}:`, link.textContent);

    if (!link.classList.contains('hover-effect')) {
      link.classList.add('hover-effect', 'hover-effect--bg-south');
      console.log(`Added hover-effect classes to link ${index + 1}`);
    }
  });

  // Initialize animations for navigation links
  navLinks.forEach((item, index) => {
    try {
      console.log(`Creating TextAnimator for link ${index + 1}`);
      const animator = new TextAnimator(item);
      console.log(`TextAnimator created successfully for link ${index + 1}`);

      // Add event listeners
      item.addEventListener('mouseenter', () => {
        console.log(`Mouse enter on link ${index + 1}:`, item.textContent);
        animator.animate();
      });

      item.addEventListener('mouseleave', () => {
        console.log(`Mouse leave on link ${index + 1}:`, item.textContent);
        animator.animateBack();
      });

      console.log(`Event listeners added to link ${index + 1}`);
    } catch (error) {
      console.error(`Error initializing text animation for link ${index + 1}:`, error);
    }
  });

  console.log('Animation setup complete');
};
