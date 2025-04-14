
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Departments from '../components/Departments';
import Employees from '../components/Employees';
import JoinUs from '../components/JoinUs';
import Footer from '../components/Footer';
import { addScrollAnimation } from '../lib/animationUtils';

const Index: React.FC = () => {
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
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <About />
      <Departments />
      <Employees />
      <JoinUs />
      <Footer />
    </div>
  );
};

export default Index;
