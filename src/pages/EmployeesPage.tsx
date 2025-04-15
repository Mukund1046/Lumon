
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Employees from '../components/Employees';
import Footer from '../components/Footer';
import { useLenisScroll } from '../hooks/useLenisScroll';

const EmployeesPage: React.FC = () => {
  // Initialize Lenis smooth scrolling
  const lenisRef = useLenisScroll({
    lerp: 0.1,
    smoothWheel: true,
    wheelMultiplier: 0.8,
    touchMultiplier: 1,
    infinite: false
  });

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full h-full overflow-hidden bg-wardrobe-dark">
      <Navbar />
      <Employees />
      <Footer />
    </div>
  );
};

export default EmployeesPage;
