import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

// Register GSAP plugins
gsap.registerPlugin(CustomEase);

// Create custom ease
CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");

// Set default animation properties
gsap.defaults({
  ease: "main",
  duration: 0.7
});

// Global variables to track menu state and functions
let isMenuInitialized = false;
let menuOpenFunction;
let menuCloseFunction;
let menuSyncFunction;

// Initialize the Osmo-style menu
export const initOsmoMenu = () => {
  // Prevent multiple initializations
  if (isMenuInitialized) {
    console.log("Menu already initialized, returning existing instance");
    return {
      openMenu: menuOpenFunction,
      closeMenu: menuCloseFunction,
      syncMenuState: menuSyncFunction
    };
  }

  // Get DOM elements
  const navWrap = document.getElementById("osmo-mobile-menu");
  if (!navWrap) {
    console.warn("Osmo mobile menu not found");
    return;
  }

  console.log("Found Osmo mobile menu", navWrap);

  const overlay = navWrap.querySelector(".osmo-overlay");
  const menu = navWrap.querySelector(".osmo-menu");
  const bgPanels = navWrap.querySelectorAll(".osmo-bg-panel");
  const menuToggles = document.querySelectorAll("[data-osmo-menu-toggle]");
  const menuLinks = navWrap.querySelectorAll(".osmo-menu-link-heading");
  const eyebrows = navWrap.querySelectorAll(".osmo-eyebrow");
  const fadeTargets = navWrap.querySelectorAll("[data-osmo-menu-fade]");
  const menuButton = document.getElementById("osmo-menu-toggle");
  const menuButtonTexts = menuButton?.querySelectorAll("p");
  const menuButtonIcon = menuButton?.querySelector(".osmo-icon-wrap");

  // Create animation timeline
  let tl = gsap.timeline();

  // Set initial states
  gsap.set(menuLinks, { yPercent: 140, rotate: 10 });
  gsap.set(eyebrows, { autoAlpha: 0 });
  gsap.set(fadeTargets, { autoAlpha: 0, yPercent: 50 });
  gsap.set(bgPanels, { xPercent: 101 });
  gsap.set(menu, { xPercent: 100 });
  gsap.set(navWrap, { display: "none" });

  // Log initial state
  console.log("Initial menu state set", {
    bgPanels: bgPanels.length,
    menuLinks: menuLinks.length,
    eyebrows: eyebrows.length,
    fadeTargets: fadeTargets.length
  });

  // Open menu function
  const openMenu = () => {
    // Stop any running animations
    tl.clear();

    // Set menu state
    navWrap.setAttribute("data-nav", "open");
    document.body.style.overflow = "hidden"; // Prevent scrolling

    // Create animation sequence exactly like Osmo
    tl.set(navWrap, { display: "block" })
      .set(menu, { xPercent: 100 })
      // Animate menu button
      .fromTo(menuButtonTexts, { yPercent: 0 }, { yPercent: -100, stagger: 0.2 })
      .fromTo(menuButtonIcon, { rotate: 0 }, { rotate: 315 }, "<")
      // Fade in overlay
      .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1 }, "<")
      // Animate menu sliding in
      .to(menu, { xPercent: 0, duration: 0.575, ease: "power4.inOut" }, "<")
      // Animate background panels sliding in
      .fromTo(bgPanels, { xPercent: 101 }, { xPercent: 0, stagger: 0.12, duration: 0.575, ease: "power4.inOut" }, "<")
      // Animate menu links
      .fromTo(menuLinks, { yPercent: 140, rotate: 10 }, { yPercent: 0, rotate: 0, stagger: 0.05 }, "<+=0.35")
      // Fade in eyebrows
      .fromTo(eyebrows, { autoAlpha: 0 }, { autoAlpha: 1, stagger: 0.05 }, "<+=0.1")
      // Fade in footer details
      .fromTo(fadeTargets, { autoAlpha: 0, yPercent: 50 }, { autoAlpha: 1, yPercent: 0, stagger: 0.04 }, "<+=0.2");

    // Log for debugging
    console.log("Menu opened", {
      bgPanels: bgPanels.length,
      menuLinks: menuLinks.length,
      eyebrows: eyebrows.length,
      fadeTargets: fadeTargets.length
    });
  };

  // Close menu function
  const closeMenu = () => {
    // Stop any running animations
    tl.clear();

    // Set menu state
    navWrap.setAttribute("data-nav", "closed");
    document.body.style.overflow = ""; // Restore scrolling

    // Create animation sequence exactly like Osmo
    tl.to(fadeTargets, { autoAlpha: 0, yPercent: 50, duration: 0.3 })
      .to(eyebrows, { autoAlpha: 0, duration: 0.3 }, "<")
      .to(menuLinks, { yPercent: 140, rotate: 10, stagger: 0.03, duration: 0.5 }, "<")
      .to(overlay, { autoAlpha: 0, duration: 0.4 }, "<+=0.1")
      // Animate background panels sliding out in reverse order
      .to(bgPanels[2], { xPercent: 101, duration: 0.5, ease: "power4.inOut" }, "<")
      .to(bgPanels[1], { xPercent: 101, duration: 0.5, ease: "power4.inOut" }, "<+0.08")
      .to(bgPanels[0], { xPercent: 101, duration: 0.5, ease: "power4.inOut" }, "<+0.08")
      // Animate menu sliding out
      .to(menu, { xPercent: 100, duration: 0.5, ease: "power4.inOut" }, "<")
      // Animate menu button
      .to(menuButtonTexts, { yPercent: 0, duration: 0.4 }, "<")
      .to(menuButtonIcon, { rotate: 0, duration: 0.4 }, "<")
      .set(navWrap, { display: "none" });

    // Log for debugging
    console.log("Menu closed");
  };

  // Check if menu is already open (for React state sync)
  const syncMenuState = (isOpen) => {
    const currentState = navWrap.getAttribute("data-nav");
    if (isOpen && currentState !== "open") {
      openMenu();
    } else if (!isOpen && currentState !== "closed") {
      closeMenu();
    }
  };

  // Add event listeners to menu toggle buttons - exactly like Osmo
  menuToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const state = navWrap.getAttribute("data-nav");
      console.log("Toggle clicked", toggle, "Current state:", state);

      if (state === "open") {
        closeMenu();
        // Update React state
        if (window.updateMobileMenuState) {
          window.updateMobileMenuState(false);
        }
      } else {
        openMenu();
        // Update React state
        if (window.updateMobileMenuState) {
          window.updateMobileMenuState(true);
        }
      }
    });
  });

  // Log the number of toggle buttons found
  console.log(`Found ${menuToggles.length} menu toggle buttons`);

  // Close menu with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navWrap.getAttribute("data-nav") === "open") {
      closeMenu();
      // Update React state
      if (window.updateMobileMenuState) {
        window.updateMobileMenuState(false);
      }
    }
  });

  // Initialize menu state
  navWrap.setAttribute("data-nav", "closed");
  gsap.set(navWrap, { display: "none" });

  // Store functions in global variables
  menuOpenFunction = openMenu;
  menuCloseFunction = closeMenu;
  menuSyncFunction = syncMenuState;

  // Mark as initialized
  isMenuInitialized = true;

  // Expose functions to the global window object
  window.syncOsmoMenuState = syncMenuState;
  window.osmoOpenMenu = openMenu;
  window.osmoCloseMenu = closeMenu;

  return {
    openMenu,
    closeMenu,
    syncMenuState
  };
};
