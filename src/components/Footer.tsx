
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Departments', path: '/departments' },
    { name: 'Employees', path: '/employees' },
    { name: 'Join Us', path: '/join-us' },
  ];
  
  return (
    <footer className="bg-lumon-dark text-white py-16">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center pb-8 border-b border-white/10">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-2">
              <span className="font-trap text-3xl font-semibold tracking-tight">LUMON</span>
              <span className="text-xs uppercase tracking-widest font-jakarta opacity-70">Industries</span>
            </div>
            <p className="text-white/60 font-jakarta mt-2 max-w-md">
              Pioneers in the field of severance technology, creating perfect work-life separation.
            </p>
          </div>
          
          <button 
            onClick={scrollToTop}
            className="flex items-center justify-center w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
          <div>
            <h3 className="text-lg font-trap font-medium mb-4">Contact</h3>
            <ul className="space-y-2 font-jakarta">
              <li>Lumon Campus, Kier, PE</li>
              <li>contact@lumon-industries.com</li>
              <li>(555) 123-4567</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-trap font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2 font-jakarta">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path}
                    className="text-white/80 hover:text-lumon-accent transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-trap font-medium mb-4">Legal</h3>
            <ul className="space-y-2 font-jakarta">
              <li><Link to="/privacy" className="text-white/80 hover:text-lumon-accent transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-white/80 hover:text-lumon-accent transition-colors">Terms of Service</Link></li>
              <li><Link to="/severance-agreement" className="text-white/80 hover:text-lumon-accent transition-colors">Severance Agreement</Link></li>
              <li><Link to="/cookies" className="text-white/80 hover:text-lumon-accent transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 text-center md:text-left md:flex md:justify-between items-center">
          <p className="text-white/60 font-jakarta text-sm">
            &copy; {new Date().getFullYear()} Lumon Industries. All rights reserved.
          </p>
          
          <p className="text-white/60 font-jakarta text-sm mt-2 md:mt-0">
            <span className="text-lumon-accent">Severance</span> is a fictional concept from the Apple TV+ show.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
