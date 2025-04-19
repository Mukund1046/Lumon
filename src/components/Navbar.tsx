
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import '../styles/navTextEffect.css';
import '../styles/navbarFix.css';
import '../styles/navbarContrast.css'; // Added for improved contrast
import '../styles/navbarPadding.css'; // Added for adjusted padding on larger screens
import '../styles/navbarPageThemes.css'; // Added for page-specific color schemes
import '../styles/osmoMenu.css'; // Added for Osmo-style menu animation
import { initNavTextAnimation } from '../scripts/nav-text-animation';
import { initOsmoMenu } from '../scripts/osmoMenu';
import { GooeyText } from '@/components/ui/gooey-text';
import { useColorScheme } from './ColorSchemeProvider';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize text animation for navigation links
  useEffect(() => {
    // Small delay to ensure DOM is fully loaded
    const timer = setTimeout(() => {
      initNavTextAnimation();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Initialize Osmo menu on component mount
  useEffect(() => {
    // Initialize the menu
    const initMenu = () => {
      // Initialize the menu
      const osmoMenu = initOsmoMenu();

      // Create a function to update the React state from GSAP
      window.updateMobileMenuState = (isOpen: boolean) => {
        if (isOpen !== mobileMenuOpen) {
          setMobileMenuOpen(isOpen);
        }
      };

      console.log('Menu initialized');
    };

    // Initialize immediately
    initMenu();

    // Also initialize after a delay to ensure DOM is fully loaded
    const timer = setTimeout(initMenu, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Sync menu state with React state when mobileMenuOpen changes
  useEffect(() => {
    if (window.syncOsmoMenuState) {
      window.syncOsmoMenuState(mobileMenuOpen);
    }
  }, [mobileMenuOpen]);

  // Handle route changes
  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);

    // Explicitly close the menu
    if (typeof window.osmoCloseMenu === 'function') {
      window.osmoCloseMenu();
    }

    // Scroll to top when navigating to a new page
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Departments', path: '/departments' },
    { name: 'Employees', path: '/employees' },
    { name: 'Join Us', path: '/join-us' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 w-full z-[100] transition-all duration-300 navbar-strip",
      isScrolled
        ? "bg-wardrobe-light/95 backdrop-blur-sm shadow-sm py-4"
        : "bg-transparent py-6"
    )}>
      <div className="container-custom navbar-container flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center justify-center logo-container"
        >
          <GooeyText
            texts={["LUMON", "LUMON", "LUMON", "LUMON", "SEVERED", "LUMON"]}
            morphTime={1.5}
            cooldownTime={5}
            className="h-8 w-28 flex items-center justify-center"
            textClassName="font-trap font-trap-bold text-2xl font-semibold tracking-tight text-wardrobe-dark text-center"
          />
        </Link>

        <div className="flex items-center">
          <nav className="hidden md:flex items-center space-x-8 nav-items-container">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "font-mono text-sm tracking-wide transition-colors uppercase nav-link",
                  isActive(item.path)
                    ? "text-wardrobe-blue font-medium active"
                    : "text-wardrobe-dark hover:text-wardrobe-blue"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Apply Now button - only visible on desktop */}
          <Link
            to="/join-us"
            className="lumon-button primary jetbrains-mono-button hidden md:block ml-8 cta-container"
          >
            Apply Now
          </Link>

          {/* Mobile menu toggle - only visible on mobile */}
          <button
            className="md:hidden osmo-menu-button"
            id="osmo-menu-toggle"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              // Toggle menu state
              const newState = !mobileMenuOpen;
              setMobileMenuOpen(newState);

              // Open or close menu using our global functions
              if (newState) {
                if (typeof window.osmoOpenMenu === 'function') {
                  window.osmoOpenMenu();
                }
              } else {
                if (typeof window.osmoCloseMenu === 'function') {
                  window.osmoCloseMenu();
                }
              }
            }}
          >
            <div className="osmo-menu-button-text">
              <p className="p-large">Menu</p>
              <p className="p-large">Close</p>
            </div>
            <div className="osmo-icon-wrap">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 16 16" fill="none" className="osmo-menu-button-icon">
                <path d="M7.33333 16L7.33333 -3.2055e-07L8.66667 -3.78832e-07L8.66667 16L7.33333 16Z" fill="currentColor"></path>
                <path d="M16 8.66667L-2.62269e-07 8.66667L-3.78832e-07 7.33333L16 7.33333L16 8.66667Z" fill="currentColor"></path>
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* Osmo-style Mobile Menu */}
      <div data-nav="closed" className="osmo-mobile-menu" id="osmo-mobile-menu">
        <div
          className="osmo-overlay"
          onClick={() => {
            setMobileMenuOpen(false);
            if (typeof window.osmoCloseMenu === 'function') {
              window.osmoCloseMenu();
            }
          }}
        ></div>
        <nav className="osmo-menu">
          <button
            className="osmo-close-button"
            onClick={() => {
              setMobileMenuOpen(false);
              if (typeof window.osmoCloseMenu === 'function') {
                window.osmoCloseMenu();
              }
            }}
          >
            <div className="osmo-icon-wrap">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 16 16" fill="none" className="osmo-menu-button-icon">
                <path d="M7.33333 16L7.33333 -3.2055e-07L8.66667 -3.78832e-07L8.66667 16L7.33333 16Z" fill="currentColor"></path>
                <path d="M16 8.66667L-2.62269e-07 8.66667L-3.78832e-07 7.33333L16 7.33333L16 8.66667Z" fill="currentColor"></path>
              </svg>
            </div>
            <span>Close</span>
          </button>
          <div className="osmo-menu-bg">
            <div className="osmo-bg-panel first"></div>
            <div className="osmo-bg-panel second"></div>
            <div className="osmo-bg-panel"></div>
          </div>
          <div className="osmo-menu-inner">
            <ul className="osmo-menu-list">
              {navItems.map((item, index) => (
                <li key={item.name} className="osmo-menu-list-item">
                  <Link
                    to={item.path}
                    className="osmo-menu-link"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (typeof window.osmoCloseMenu === 'function') {
                        window.osmoCloseMenu();
                      }
                    }}
                  >
                    <p className="osmo-menu-link-heading">{item.name}</p>
                    <p className="osmo-eyebrow">{String(index + 1).padStart(2, '0')}</p>
                    <div className="osmo-menu-link-bg"></div>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="osmo-menu-details" data-osmo-menu-fade>
              <p className="p-small">Lumon Industries</p>
              <div className="socials-row">
                <Link
                  to="/join-us"
                  className="p-large text-link"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (typeof window.osmoCloseMenu === 'function') {
                      window.osmoCloseMenu();
                    }
                  }}
                >Apply Now</Link>
                <Link
                  to="/privacy"
                  className="p-large text-link"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (typeof window.osmoCloseMenu === 'function') {
                      window.osmoCloseMenu();
                    }
                  }}
                >Privacy</Link>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
