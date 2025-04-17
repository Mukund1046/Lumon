
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import '../styles/navTextEffect.css';
import '../styles/marqueeMenu.css';
import '../styles/navbarFix.css';
import '../styles/navbarContrast.css'; // Added for improved contrast
import '../styles/navbarPadding.css'; // Added for adjusted padding on larger screens
import { initNavTextAnimation } from '../scripts/nav-text-animation';
import { initMarqueeMenu } from '../scripts/marqueeMenu';
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

  // Initialize text animation for navigation links and marquee menu
  useEffect(() => {
    // Small delay to ensure DOM is fully loaded
    const timer = setTimeout(() => {
      initNavTextAnimation();
      initMarqueeMenu();
    }, 500);

    return () => clearTimeout(timer);
  }, [mobileMenuOpen]);

  // Handle route changes
  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);

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
            className="md:hidden text-foreground jetbrains-mono-button icon-only"
            onClick={() => {
              const newState = !mobileMenuOpen;
              setMobileMenuOpen(newState);
              if (newState) {
                // Initialize marquee menu when opening
                setTimeout(() => initMarqueeMenu(), 100);
              }
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn(
        "mobile-menu md:hidden absolute top-full left-0 right-0 bg-severance-frost shadow-md transition-all duration-300 overflow-hidden z-[100]",
        mobileMenuOpen ? "max-h-96" : "max-h-0"
      )}>
        <div className="container-custom py-4 flex flex-col space-y-4">
          {navItems.map((item) => (
            <div key={item.name} className="mobile-menu-item">
              <Link
                to={item.path}
                className={cn(
                  "font-mono text-sm py-2 transition-colors uppercase nav-link block w-full",
                  isActive(item.path)
                    ? "text-wardrobe-blue font-medium active"
                    : "text-wardrobe-dark hover:text-wardrobe-blue"
                )}
              >
                {item.name}
              </Link>
              <div className="marquee">
                <div className="marquee__inner-wrap">
                  <div className="marquee__inner" aria-hidden="true">
                    <span>Lumon</span>
                    <div className="marquee__img" style={{ backgroundImage: 'url(/assets/severance126.jpg)' }}></div>
                    <span>Severance</span>
                    <div className="marquee__img" style={{ backgroundImage: 'url(/assets/severance127.jpg)' }}></div>
                    <span>Kier</span>
                    <div className="marquee__img" style={{ backgroundImage: 'url(/assets/severance128.jpg)' }}></div>
                    <span>MDR</span>
                    <div className="marquee__img" style={{ backgroundImage: 'url(/assets/severance129.jpg)' }}></div>
                    <span>Lumon</span>
                    <div className="marquee__img" style={{ backgroundImage: 'url(/assets/severance126.jpg)' }}></div>
                    <span>Severance</span>
                    <div className="marquee__img" style={{ backgroundImage: 'url(/assets/severance127.jpg)' }}></div>
                    <span>Kier</span>
                    <div className="marquee__img" style={{ backgroundImage: 'url(/assets/severance128.jpg)' }}></div>
                    <span>MDR</span>
                    <div className="marquee__img" style={{ backgroundImage: 'url(/assets/severance129.jpg)' }}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-center w-full mt-4">
            <Link
              to="/join-us"
              className="lumon-button primary mobile-menu-apply jetbrains-mono-button text-sm uppercase tracking-wide mx-auto"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
