
import React, { useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import About from '../components/About';
import Footer from '../components/Footer';
import { useLenisScroll } from '../hooks/useLenisScroll';

const AboutPage: React.FC = () => {
  // Initialize Lenis smooth scrolling
  const lenisRef = useLenisScroll({
    lerp: 0.1,
    smoothWheel: true,
    wheelMultiplier: 0.8,
    touchMultiplier: 1,
    infinite: false
  });

  return (
    <div className="w-full items-center justify-center h-full overflow-auto">
      {/* Main content with higher z-index */}
      <div className="relative z-10">
        <Navbar />
        <div className="relative">
          <About />
        </div>
      </div>

      {/* Sticky footer with lower z-index */}
      <Footer />
    </div>
  );
};

export default AboutPage;
