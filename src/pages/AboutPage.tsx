
import React, { useRef } from 'react';
import Navbar from '../components/Navbar';
import About from '../components/About';
import Footer from '../components/Footer';
import { useLocomotiveScroll } from '../hooks/useLocomotiveScroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

const AboutPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const locomotiveScroll = useLocomotiveScroll({
    ref: containerRef,
    smooth: true,
    multiplier: 0.8,
    lerp: 0.08,
    class: 'data-scroll',
    getDirection: true,
  });
  
  return (
    <div ref={containerRef} data-scroll-container className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div data-scroll-section className="pt-24">
        <About />
      </div>
      <div data-scroll-section>
        <Footer />
      </div>
    </div>
  );
};

export default AboutPage;
