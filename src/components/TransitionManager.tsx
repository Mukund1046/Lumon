import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/pageTransition.css';
import { useColorScheme } from './ColorSchemeProvider';

// Declare GSAP types for TypeScript
declare global {
  interface Window {
    gsap: any;
  }
}

// Cell class for creating grid cells
class Cell {
  el: HTMLDivElement;
  row: number;
  column: number;

  constructor(row: number, column: number) {
    this.el = document.createElement('div');
    if (window.gsap) {
      window.gsap.set(this.el, { willChange: 'opacity, transform' });
    } else {
      this.el.style.willChange = 'opacity, transform';
    }
    this.row = row;
    this.column = column;
  }
}

// Transition types
type TransitionType = 'demo1' | 'demo2' | 'demo4' | 'demo5' | 'demo6';

// Map paths to transition types
const pathToTransition: Record<string, TransitionType | null> = {
  '/': null,              // Home page has no transition to allow hero animation to be fully seen
  '/about': 'demo2',      // About page uses demo2 (from center)
  '/departments': 'demo4', // Departments page uses demo4 (from edges to center)
  '/employees': 'demo5',   // Employees page uses demo5 (vertical columns)
  '/join-us': 'demo6',     // Join Us page uses demo6 (horizontal slide)
};

interface TransitionManagerProps {
  children: React.ReactNode;
}

const TransitionManager: React.FC<TransitionManagerProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { colorScheme } = useColorScheme();
  const overlayRef = useRef<HTMLDivElement>(null);
  const isInitialRender = useRef(true);
  const isAnimating = useRef(false);
  const cells = useRef<Cell[][]>([]);
  const flatCells = useRef<Cell[]>([]);
  const prevPathname = useRef<string>(location.pathname);

  // Create cells for the overlay
  useEffect(() => {
    // Skip initialization for homepage
    if (location.pathname === '/' || pathToTransition[location.pathname] === null) {
      console.log('Skipping transition initialization for homepage');
      isInitialRender.current = false;
      isAnimating.current = false;

      // Ensure the overlay is hidden for homepage
      if (overlayRef.current) {
        overlayRef.current.style.display = 'none';
        overlayRef.current.style.opacity = '0';
      }

      return;
    }

    // Function to initialize the transition effect
    const initTransition = () => {
      if (!overlayRef.current) {
        // If overlay ref is not available, retry after a short delay
        setTimeout(initTransition, 100);
        return;
      }

      // Check if GSAP is available
      if (!window.gsap) {
        console.warn('GSAP not available for transition effect, retrying in 200ms');
        setTimeout(initTransition, 200);
        return;
      }

      // Log successful initialization
      console.log('Initializing transition effect with GSAP version:', window.gsap.version);

      const overlay = overlayRef.current;

      // Clear any existing cells
      while (overlay.firstChild) {
        overlay.removeChild(overlay.firstChild);
      }

      // Create cells based on the current path
      const transitionType = pathToTransition[location.pathname] || 'demo1';

      let rows = 10;
      let columns = 16;

      // Set different grid configurations based on transition type
      switch (transitionType) {
        case 'demo1':
          rows = 10;
          columns = 16;
          break;
        case 'demo2':
          rows = 9;
          columns = 17;
          break;
        case 'demo4':
          rows = 9;
          columns = 17;
          break;
        case 'demo5':
          rows = 20;
          columns = 4;
          break;
        case 'demo6':
          rows = 6;
          columns = 11;
          break;
      }

      // Set CSS variable for columns
      overlay.style.setProperty('--columns', columns.toString());

      // Create cells array
      cells.current = Array(rows).fill(0).map(() => Array(columns));

      // Create and append cells
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
          const cell = new Cell(i, j);
          cells.current[i][j] = cell;
          overlay.appendChild(cell.el);
        }
      }

      // Create flat cells array for animations
      flatCells.current = cells.current.flat();

      // Initial animation (fade out the overlay)
      if (isInitialRender.current) {
        // Skip initial animation for homepage to allow hero animation to be fully seen
        if (location.pathname === '/' || pathToTransition[location.pathname] === null) {
          console.log('Skipping initial transition for homepage');
          isInitialRender.current = false;
          isAnimating.current = false;
          overlay.style.opacity = '0';
        } else {
          window.gsap.set(overlay, { opacity: 1 });

          window.gsap.fromTo(flatCells.current.map(cell => cell.el),
            { scale: 1, opacity: 1, transformOrigin: '50% 100%' },
            {
              scale: 0,
              opacity: 0,
              duration: 0.4,
              ease: 'power2',
              stagger: (index: number) => {
                const cell = flatCells.current[index];
                return 0.03 * (cell.row + window.gsap.utils.random(0, 5));
              },
              onComplete: () => {
                isInitialRender.current = false;
                isAnimating.current = false;
              }
            }
          );
        }
      }
    };

    // Start initialization
    initTransition();

    // Cleanup function
    return () => {
      // Ensure the overlay is properly hidden when unmounting
      if (overlayRef.current) {
        overlayRef.current.style.display = 'none';
        overlayRef.current.style.opacity = '0';
      }

      // Reset any GSAP animations
      if (window.gsap && flatCells.current.length > 0) {
        window.gsap.killTweensOf(flatCells.current.map(cell => cell.el));
      }
    };
  }, [location.pathname]);

  // Handle navigation link clicks
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (!link) return;

      const href = link.getAttribute('href');

      // Skip if it's an external link, has a hash, or is the current page
      if (!href ||
          href.startsWith('http') ||
          href.includes('#') ||
          href === location.pathname ||
          isAnimating.current) {
        return;
      }

      // Only handle internal navigation links
      if (href.startsWith('/')) {
        e.preventDefault();
        performTransition(href);
      }
    };

    document.addEventListener('click', handleLinkClick);

    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, [location.pathname]);

  // Handle route changes from other sources (like browser back button)
  useEffect(() => {
    if (isInitialRender.current) return;

    if (location.pathname !== prevPathname.current && !isAnimating.current) {
      performTransition(location.pathname, false);
    }

    // Update data attribute on document body for CSS styling
    if (location.pathname === '/' || pathToTransition[location.pathname] === null) {
      // For homepage, skip transitions
      document.body.setAttribute('data-transition', 'none');
    } else {
      const transitionType = pathToTransition[location.pathname] || 'demo1';
      document.body.setAttribute('data-transition', transitionType);
    }

    prevPathname.current = location.pathname;
  }, [location.pathname]);

  // Set initial data attribute
  useEffect(() => {
    if (location.pathname === '/' || pathToTransition[location.pathname] === null) {
      // For homepage, skip transitions
      document.body.setAttribute('data-transition', 'none');
    } else {
      const transitionType = pathToTransition[location.pathname] || 'demo1';
      document.body.setAttribute('data-transition', transitionType);
    }
  }, []);

  // Perform transition animation
  const performTransition = (path: string, updateHistory = true) => {
    // Skip transition for homepage to allow hero animation to be fully seen
    if (path === '/' || pathToTransition[path] === null) {
      console.log('Skipping transition for homepage');
      if (updateHistory) navigate(path);
      return;
    }

    // Check if we can perform the transition
    if (isAnimating.current) {
      console.log('Animation already in progress, skipping transition');
      return;
    }

    if (!overlayRef.current) {
      console.error('Overlay reference not available');
      // Just navigate without animation
      if (updateHistory) navigate(path);
      return;
    }

    if (!window.gsap) {
      console.error('GSAP not available for transition');
      // Just navigate without animation
      if (updateHistory) navigate(path);
      return;
    }

    // Set animating flag
    isAnimating.current = true;
    console.log(`Starting transition to ${path}`);

    const overlay = overlayRef.current;
    const fromTransition = pathToTransition[prevPathname.current] || 'demo1';
    const toTransition = pathToTransition[path] || 'demo1';

    // Make sure the overlay is visible
    overlay.style.display = 'grid';

    // Show overlay with animation based on the current transition type
    window.gsap.set(overlay, { opacity: 1 });

    // Configure animation based on transition type
    const showConfig = getShowConfig(fromTransition);

    window.gsap.fromTo(
      flatCells.current.map(cell => cell.el),
      {
        scale: 0,
        opacity: 0,
        transformOrigin: showConfig.transformOrigin
      },
      {
        scale: 1.01,
        opacity: 1,
        duration: showConfig.duration,
        ease: showConfig.ease,
        stagger: showConfig.stagger,
        onComplete: () => {
          // Update URL if needed
          if (updateHistory) {
            navigate(path);
          }

          // Configure hide animation based on destination transition type
          const hideConfig = getHideConfig(toTransition);

          // Hide overlay
          window.gsap.fromTo(
            flatCells.current.map(cell => cell.el),
            {
              transformOrigin: hideConfig.transformOrigin
            },
            {
              scale: 0,
              opacity: 0,
              duration: hideConfig.duration,
              ease: hideConfig.ease,
              stagger: hideConfig.stagger,
              onComplete: () => {
                isAnimating.current = false;
              }
            }
          );
        }
      }
    );
  };

  // Get configuration for showing the overlay
  const getShowConfig = (transitionType: TransitionType) => {
    const rows = cells.current.length;
    const columns = cells.current[0]?.length || 1;

    switch (transitionType) {
      case 'demo1':
        return {
          transformOrigin: '50% 0%',
          duration: 0.4,
          ease: 'power3.inOut',
          stagger: (index: number) => {
            const cell = flatCells.current[index];
            return 0.03 * (cell.row + (window.gsap?.utils?.random ? window.gsap.utils.random(0, 5) : Math.random() * 5));
          }
        };
      case 'demo2':
        return {
          transformOrigin: '50% 50%',
          duration: 0.25,
          ease: 'power1.in',
          stagger: {
            grid: [rows, columns],
            from: 'center',
            each: 0.025,
            ease: 'none'
          }
        };
      case 'demo4':
        return {
          transformOrigin: '50% 50%',
          duration: 0.25,
          ease: 'power1.in',
          stagger: {
            grid: [rows, columns],
            from: 'edges',
            each: 0.025,
            ease: 'none'
          }
        };
      case 'demo5':
        return {
          transformOrigin: '50% 100%',
          duration: 0.3,
          ease: 'power1.in',
          stagger: {
            grid: [rows, columns],
            from: 'start',
            each: 0.02,
            ease: 'none'
          }
        };
      case 'demo6':
        return {
          transformOrigin: '0% 50%',
          duration: 0.3,
          ease: 'power4.in',
          stagger: {
            grid: [rows, columns],
            from: 'start',
            each: 0.04,
            ease: 'none'
          }
        };
      default:
        return {
          transformOrigin: '50% 0%',
          duration: 0.4,
          ease: 'power3.inOut',
          stagger: (index: number) => {
            const cell = flatCells.current[index];
            return 0.03 * (cell.row + (window.gsap?.utils?.random ? window.gsap.utils.random(0, 5) : Math.random() * 5));
          }
        };
    }
  };

  // Get configuration for hiding the overlay
  const getHideConfig = (transitionType: TransitionType) => {
    const rows = cells.current.length;
    const columns = cells.current[0]?.length || 1;

    switch (transitionType) {
      case 'demo1':
        return {
          transformOrigin: '50% 100%',
          duration: 0.4,
          ease: 'power2',
          stagger: (index: number) => {
            const cell = flatCells.current[index];
            return 0.03 * (cell.row + (window.gsap?.utils?.random ? window.gsap.utils.random(0, 5) : Math.random() * 5));
          }
        };
      case 'demo2':
        return {
          transformOrigin: '50% 50%',
          duration: 0.25,
          ease: 'power1',
          stagger: {
            grid: [rows, columns],
            from: 'center',
            each: 0.025,
            ease: 'none'
          }
        };
      case 'demo4':
        return {
          transformOrigin: '50% 50%',
          duration: 0.25,
          ease: 'power1',
          stagger: {
            grid: [rows, columns],
            from: 'center',
            each: 0.025,
            ease: 'none'
          }
        };
      case 'demo5':
        return {
          transformOrigin: '50% 0%',
          duration: 0.3,
          ease: 'power3',
          stagger: {
            grid: [rows, columns],
            from: 'start',
            each: 0.02,
            ease: 'none'
          }
        };
      case 'demo6':
        return {
          transformOrigin: '100% 50%',
          duration: 0.5,
          ease: 'power4',
          stagger: {
            grid: [rows, columns],
            from: 'start',
            each: 0.04,
            ease: 'none'
          }
        };
      default:
        return {
          transformOrigin: '50% 100%',
          duration: 0.4,
          ease: 'power2',
          stagger: (index: number) => {
            const cell = flatCells.current[index];
            return 0.03 * (cell.row + (window.gsap?.utils?.random ? window.gsap.utils.random(0, 5) : Math.random() * 5));
          }
        };
    }
  };

  return (
    <>
      <div ref={overlayRef} className="page-transition-overlay"></div>
      {children}
    </>
  );
};

export default TransitionManager;
