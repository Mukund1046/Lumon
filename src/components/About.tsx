
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import '../styles/3dscroll.css';
import { init3DScroll } from '../scripts/3dscroll';

// Define a list of image paths that are guaranteed to exist in the public folder
const imagePaths = [
  // First 12 images with correct casing and extensions
  '/assets/Severance1.jpeg',
  '/assets/Severance2.jpeg',
  '/assets/Severance3.jpeg',
  '/assets/Severance4.jpeg',
  '/assets/Severance5.jpeg',
  '/assets/Severance6.jpeg',
  '/assets/Severance7.jpeg',
  '/assets/Severance8.jpeg',
  '/assets/Severance9.jpeg',
  '/assets/Severance10.jpeg',
  '/assets/Severance11.jpg',
  '/assets/Severance12.jpg',
];

// Component for a grid item with a fallback mechanism
const GridItem = ({ index }) => {
  // Use modulo to cycle through the available images
  const imageIndex = index % imagePaths.length;

  return (
    <div className="grid__item">
      <div
        className="grid__item-inner"
        style={{
          backgroundImage: `url(${imagePaths[imageIndex]})`,
          backgroundColor: 'rgba(255, 255, 255, 0.1)', // Fallback color
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
    </div>
  );
};

const About: React.FC = () => {
  useEffect(() => {
    // Preload all images to ensure they're cached
    imagePaths.forEach(path => {
      const img = new Image();
      img.src = path;
    });

    // Initialize 3D scroll effect after component mounts
    const timer = setTimeout(() => {
      init3DScroll();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <section id="about" className="bg-severance-midnight relative overflow-hidden">
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-10 mix-blend-overlay animate-noise"
        style={{
          backgroundImage: 'url(/assets/noise.png)',
          backgroundRepeat: 'repeat',
          // Add a fallback background color in case the image doesn't load
          backgroundColor: 'rgba(0, 0, 0, 0.05)'
        }}
      ></div>

      {/* Intro section */}
      <div className="intro">
        <h1 className="intro__title">
          <span className="intro__title-pre">Severance</span>
          <span className="intro__title-sub">Work-Life Separation</span>
        </h1>
        <span className="intro__info">Scroll moderately to fully experience the animations</span>
      </div>

      {/* First grid section - Type 1 animation */}
      <section className="grid-section">
        <h3 className="grid-section__title grid-section__title--right grid-section__title--top">Life at <br/>Lumon Industries</h3>
        <div className="grid grid--1">
          <div className="grid-wrap">
            {Array.from({ length: 48 }, (_, i) => (
              <GridItem key={`grid1-${i}`} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Second grid section - Type 2 animation */}
      <section className="grid-section">
        <h3 className="grid-section__title">Severed <br/>Work Environment</h3>
        <div className="grid grid--2">
          <div className="grid-wrap">
            {Array.from({ length: 48 }, (_, i) => (
              <GridItem key={`grid2-${i}`} index={i + 48} />
            ))}
          </div>
        </div>
      </section>

      {/* Third grid section - Type 3 animation */}
      <section className="grid-section grid-section--spacing">
        <h3 className="grid-section__title grid-section__title--left grid-section__title--bottom">Embrace <br/>the Procedure</h3>
        <div className="grid grid--3">
          <div className="grid-wrap">
            {Array.from({ length: 48 }, (_, i) => (
              <GridItem key={`grid3-${i}`} index={i + 96} />
            ))}
          </div>
        </div>
      </section>

      {/* Fourth grid section - Type 4 animation */}
      <section className="grid-section grid-section--spacing">
        <h3 className="grid-section__title grid-section__title--right">Now unfolds <br/>eternity's grace</h3>
        <div className="grid grid--4">
          <div className="grid-wrap">
            {Array.from({ length: 48 }, (_, i) => (
              <GridItem key={`grid4-${i}`} index={i + 12} />
            ))}
          </div>
        </div>
      </section>

      {/* Fifth grid section - Type 5 animation */}
      <section className="grid-section grid-section--spacing">
        <h3 className="grid-section__title">An infinite universe<br/> of moments unfolding</h3>
        <div className="grid grid--5">
          <div className="grid-wrap">
            {Array.from({ length: 48 }, (_, i) => (
              <GridItem key={`grid5-${i}`} index={i + 72} />
            ))}
          </div>
        </div>
      </section>

      {/* Sixth grid section - Type 6 animation */}
      <section className="grid-section grid-section--spacing">
        <h3 className="grid-section__title">Seasons shift, <br/>moments flow.</h3>
        <div className="grid grid--6">
          <div className="grid-wrap">
            {Array.from({ length: 21 }, (_, i) => (
              <GridItem key={`grid6-${i}`} index={i + 120} />
            ))}
          </div>
        </div>
      </section>
    </section>
  );
};

export default About;
