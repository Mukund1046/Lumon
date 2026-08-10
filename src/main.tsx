import { createRoot } from 'react-dom/client'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import App from './App.tsx'
// Import core styles
import './index.css'
import './styles/buttonEffect.css'
import './styles/typography.css'
import './styles/responsiveTypography.css'
import './styles/button.css'
import './styles/colorSchemes.css'
import './styles/gooeyText.css'
import './styles/heroAnimations.css'
import './styles/logo.css'
import './styles/marqueeMenu.css'
import './styles/navbarFix.css'
import './styles/customBreakpoints.css'
import './styles/3dscroll.css'
import './styles/shinyButton.css'
import './styles/navbarContrast.css'
import { initButtonEffect } from './scripts/buttonEffect'
import { registerAppResources } from './lib/appPreloads'
import { preloadManager } from './lib/preloadManager'

gsap.registerPlugin(ScrollTrigger);
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;

// Start loading all app resources in the background immediately so the
// loading screen can report real progress and the site runs smoothly.
registerAppResources();
preloadManager.start();

createRoot(document.getElementById("root")!).render(<App />);

// Initialize button effect after the app is rendered
const initButtonEffectWithRetry = () => {
  console.log('Initializing button effect...');
  initButtonEffect();

  // Retry after a delay to catch any buttons rendered after initial load
  setTimeout(() => {
    console.log('Retrying button effect initialization...');
    initButtonEffect();
  }, 1000);

  // And once more for good measure
  setTimeout(() => {
    console.log('Final button effect initialization...');
    initButtonEffect();
  }, 2000);
};

// Run on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initButtonEffectWithRetry);

// Also run when window loads (backup)
window.addEventListener('load', initButtonEffectWithRetry);
