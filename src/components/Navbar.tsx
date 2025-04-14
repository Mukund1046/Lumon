
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300",
      isScrolled 
        ? "bg-white/95 backdrop-blur-sm shadow-sm py-4" 
        : "bg-transparent py-6"
    )}>
      <div className="container-custom flex items-center justify-between">
        <a 
          href="#" 
          className="flex items-center space-x-2"
        >
          <span className="font-trap text-2xl font-semibold tracking-tight">LUMON</span>
          <span className="text-xs uppercase tracking-widest font-jakarta opacity-70">Industries</span>
        </a>
        
        <nav className="hidden md:flex items-center space-x-8">
          {['Home', 'About', 'Departments', 'Employees', 'Join Us'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className="font-jakarta text-sm tracking-wide text-foreground/80 hover:text-lumon-accent transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>
        
        <button 
          className="lumon-button hidden md:block"
        >
          Apply Now
        </button>
        
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
          {['Home', 'About', 'Departments', 'Employees', 'Join Us'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className="font-jakarta text-sm py-2 text-foreground/80 hover:text-lumon-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <button 
            className="lumon-button self-start mt-2"
          >
            Apply Now
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
