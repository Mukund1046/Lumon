
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Departments from '../components/Departments';
import Footer from '../components/Footer';
import { useLenisScroll } from '../hooks/useLenisScroll';

const DepartmentsPage: React.FC = () => {
  // Initialize Lenis smooth scrolling
  const lenisRef = useLenisScroll({
    lerp: 0.1,
    smoothWheel: true,
    wheelMultiplier: 0.8,
    touchMultiplier: 1,
    infinite: false
  });

  // Scroll to top when the component mounts
  useEffect(() => {
    // Scroll to top immediately
    window.scrollTo(0, 0);

    // Also use Lenis to scroll to top smoothly (as a backup)
    if (lenisRef.current) {
      setTimeout(() => {
        lenisRef.current.scrollTo(0, { immediate: true });
      }, 100);
    }
  }, []);

  return (
    <div className="w-full h-full overflow-hidden departments-theme">
      <Navbar />
      <Departments />
      <Footer />
    </div>
  );
};

export default DepartmentsPage;
