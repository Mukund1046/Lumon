
import React, { useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Departments from '../components/Departments';
import Employees from '../components/Employees';
import JoinUs from '../components/JoinUs';
import Footer from '../components/Footer';
import { addScrollAnimation } from '../lib/animationUtils';
import { useLocomotiveScroll } from '../hooks/useLocomotiveScroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

const Index: React.FC = () => {
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
    <div ref={containerRef} data-scroll-container className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div data-scroll-section>
        <Hero />
      </div>
      <div data-scroll-section>
        <About />
      </div>
      <div data-scroll-section>
        <Departments />
      </div>
      <div data-scroll-section>
        <Employees />
      </div>
      <div data-scroll-section>
        <JoinUs />
      </div>
      <div data-scroll-section>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
