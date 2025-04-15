
import React from 'react';
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

  return (
    <div className="w-full h-full overflow-hidden">
      <Navbar />
      <Departments />
      <Footer />
    </div>
  );
};

export default DepartmentsPage;
