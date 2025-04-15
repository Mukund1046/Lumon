
import React, { useRef } from 'react';
import Navbar from '../components/Navbar';
import JoinUs from '../components/JoinUs';
import Footer from '../components/Footer';
import { useLocomotiveScroll } from '../hooks/useLocomotiveScroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

const JoinUsPage: React.FC = () => {
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
    <div className="w-full bg-severance-frost items-center justify-center h-full overflow-auto">
      {/* Main content with higher z-index */}
      <div className="relative z-10">
        <Navbar />
        <div className="pt-24 relative">
          <JoinUs />
        </div>
      </div>

      {/* Sticky footer with lower z-index */}
      <Footer />
    </div>
  );
};

export default JoinUsPage;
