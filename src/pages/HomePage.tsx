
import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import { addScrollAnimation } from '../lib/animationUtils';
import { useLocomotiveScroll } from '../hooks/useLocomotiveScroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

interface HomePageProps {
  loadingComplete?: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ loadingComplete = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const locomotiveScroll = useLocomotiveScroll({
    ref: containerRef,
    smooth: true,
    multiplier: 0.8,
    lerp: 0.08,
    class: 'data-scroll',
    getDirection: true,
  });

  useEffect(() => {
    // Add scroll animations to elements
    addScrollAnimation('.animate-slide-up', 'opacity-100', 0.1);

    // Add a CSS rule for the grid pattern
    const style = document.createElement('style');
    style.innerHTML = `
      .bg-grid-pattern {
        background-image:
          linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
        background-size: 20px 20px;
      }

      /* Locomotive scroll styles */
      .has-scroll-smooth {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: hidden;
      }

      .has-scroll-smooth body {
        overflow: hidden;
      }

      .has-scroll-smooth [data-scroll-container] {
        min-height: 100vh;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="w-full bg-severance-frost items-center justify-center h-full overflow-auto home-theme">
      {/* Main content with higher z-index */}
      <div className="relative z-10">
        <Navbar />
        <Hero loadingComplete={loadingComplete} />
      </div>

      {/* Sticky footer with lower z-index */}
      <Footer />
    </div>
  );
};

export default HomePage;
