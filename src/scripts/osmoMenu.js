import { gsap } from 'gsap';

// Simple direct menu control functions
const openMobileMenu = () => {
  console.log('Opening mobile menu');
  const menu = document.getElementById('osmo-mobile-menu');
  if (!menu) return;

  // Set menu state
  menu.setAttribute('data-nav', 'open');
  menu.style.display = 'block';

  // Prevent body scrolling
  document.body.style.overflow = 'hidden';

  // Get elements
  const overlay = menu.querySelector('.osmo-overlay');
  const menuContent = menu.querySelector('.osmo-menu');
  const bgPanels = menu.querySelectorAll('.osmo-bg-panel');
  const menuLinks = menu.querySelectorAll('.osmo-menu-link-heading');
  const eyebrows = menu.querySelectorAll('.osmo-eyebrow');
  const fadeTargets = menu.querySelectorAll('[data-osmo-menu-fade]');

  // Reset any ongoing animations
  gsap.killTweensOf([overlay, menuContent, bgPanels, menuLinks, eyebrows, fadeTargets]);

  // Set initial states
  gsap.set(overlay, { autoAlpha: 0 });
  gsap.set(menuContent, { xPercent: 100 });
  gsap.set(bgPanels, { xPercent: 0 });
  // Don't set opacity to 0 for menu links
  gsap.set(eyebrows, { autoAlpha: 0 });
  gsap.set(fadeTargets, { autoAlpha: 0, yPercent: 50 });

  // Create animation sequence
  const tl = gsap.timeline();

  // Animate elements - removed panel animations
  tl.to(overlay, { autoAlpha: 1, duration: 0.3 })
    .to(menuContent, { xPercent: 0, duration: 0.5, ease: 'power2.out' }, '<')
    // Skip panel animations to prevent horizontal overflow
    .to(eyebrows, { autoAlpha: 1, duration: 0.3 }, '<+0.2')
    .to(fadeTargets, { autoAlpha: 1, yPercent: 0, duration: 0.3 }, '<');
};

const closeMobileMenu = () => {
  console.log('Closing mobile menu');
  const menu = document.getElementById('osmo-mobile-menu');
  if (!menu) return;

  // Set menu state
  menu.setAttribute('data-nav', 'closed');

  // Restore body scrolling
  document.body.style.overflow = '';

  // Get elements
  const overlay = menu.querySelector('.osmo-overlay');
  const menuContent = menu.querySelector('.osmo-menu');
  const bgPanels = menu.querySelectorAll('.osmo-bg-panel');
  const menuLinks = menu.querySelectorAll('.osmo-menu-link-heading');
  const eyebrows = menu.querySelectorAll('.osmo-eyebrow');
  const fadeTargets = menu.querySelectorAll('[data-osmo-menu-fade]');

  // Reset any ongoing animations
  gsap.killTweensOf([overlay, menuContent, bgPanels, menuLinks, eyebrows, fadeTargets]);

  // Create animation sequence
  const tl = gsap.timeline({
    onComplete: () => {
      menu.style.display = 'none';
    }
  });

  // Animate elements - removed panel animations
  tl.to([fadeTargets, eyebrows], { autoAlpha: 0, duration: 0.2 })
    // Skip animating menu links opacity since we want them visible
    .to(menuContent, { xPercent: 100, duration: 0.3, ease: 'power2.in' }, '<+0.1')
    // Skip panel animations to prevent horizontal overflow
    .to(overlay, { autoAlpha: 0, duration: 0.2 }, '<');

  // Failsafe: hide menu after a delay if animation fails
  setTimeout(() => {
    if (menu.getAttribute('data-nav') === 'closed') {
      menu.style.display = 'none';
    }
  }, 600);
};

// Initialize the Osmo-style menu
export const initOsmoMenu = () => {
  console.log('Initializing Osmo menu');

  // Expose functions to the global window object
  window.osmoOpenMenu = openMobileMenu;
  window.osmoCloseMenu = closeMobileMenu;
  window.syncOsmoMenuState = (isOpen) => {
    if (isOpen) {
      openMobileMenu();
    } else {
      closeMobileMenu();
    }
  };

  // Initialize menu state
  const menu = document.getElementById('osmo-mobile-menu');
  if (menu) {
    menu.setAttribute('data-nav', 'closed');
    menu.style.display = 'none';

    // Set initial states for elements
    const menuContent = menu.querySelector('.osmo-menu');
    const bgPanels = menu.querySelectorAll('.osmo-bg-panel');
    // Get menu links but don't set their opacity to 0
    const menuLinks = menu.querySelectorAll('.osmo-menu-link-heading');

    gsap.set(menuContent, { xPercent: 100 });
    gsap.set(bgPanels, { xPercent: 0 });
    // Don't set opacity to 0 for menu links
  }

  // Add event listener for Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const menu = document.getElementById('osmo-mobile-menu');
      if (menu && menu.getAttribute('data-nav') === 'open') {
        closeMobileMenu();
        if (window.updateMobileMenuState) {
          window.updateMobileMenuState(false);
        }
      }
    }
  });

  return {
    openMenu: openMobileMenu,
    closeMenu: closeMobileMenu,
    syncMenuState: window.syncOsmoMenuState
  };
};
