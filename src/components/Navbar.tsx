
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
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
      "fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300",
      isScrolled 
        ? "bg-white/95 backdrop-blur-sm shadow-sm py-4" 
        : "bg-transparent py-6"
    )}>
      <div className="container-custom flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2"
        >
          <span className="font-trap text-2xl font-semibold tracking-tight">LUMON</span>
          <span className="text-xs uppercase tracking-widest font-jakarta opacity-70">Industries</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              className={cn(
                "font-jakarta text-sm tracking-wide transition-colors",
                isActive(item.path) 
                  ? "text-lumon-accent" 
                  : "text-foreground/80 hover:text-lumon-accent"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        
        <Link 
          to="/join-us" 
          className="lumon-button hidden md:block"
        >
          Apply Now
        </Link>
        
        <button 
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile menu */}
      <div className={cn(
        "md:hidden absolute top-full left-0 right-0 bg-white shadow-md transition-all duration-300 overflow-hidden",
        mobileMenuOpen ? "max-h-96" : "max-h-0"
      )}>
        <div className="container-custom py-4 flex flex-col space-y-4">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              className={cn(
                "font-jakarta text-sm py-2 transition-colors",
                isActive(item.path) 
                  ? "text-lumon-accent" 
                  : "text-foreground/80 hover:text-lumon-accent"
              )}
            >
              {item.name}
            </Link>
          ))}
          <Link 
            to="/join-us" 
            className="lumon-button self-start mt-2"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
