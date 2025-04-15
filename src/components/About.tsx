
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import '../styles/3dscroll.css';
import { init3DScroll } from '../scripts/3dscroll';

// Component for a grid item with a fallback mechanism
const GridItem = ({ index }) => {
  // Use modulo to cycle through the first 24 images
  // We'll use a smaller modulo to ensure we're using images that definitely exist
  const imageNumber = (index % 24) + 1;

  // Create an array of fallback images to try using useMemo to avoid recreating on every render
  const fallbackImages = React.useMemo(() => [
    // Try with correct path for production
    `/assets/severance${imageNumber}.jpg`,
    // Try with different extensions
    `/assets/severance${imageNumber}.jpeg`,
    `/assets/severance${imageNumber}.png`,
    // Try with different image numbers
    `/assets/severance${(imageNumber % 12) + 1}.jpg`,
    `/assets/severance${(imageNumber % 6) + 1}.jpg`,
    // Ultimate fallbacks
    `/assets/severance1.jpg`,
    `/assets/severance2.jpg`,
    `/assets/severance3.jpg`
  ], [imageNumber]);

  // Use React's useState to track if the primary image fails
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [hasError, setHasError] = React.useState(false);

  // Handle image load error
  React.useEffect(() => {
    // Create an image element to test loading
    const img = new Image();
    img.src = fallbackImages[currentImageIndex];

    img.onload = () => {
      setHasError(false);
    };

    img.onerror = () => {
      // If we have more fallbacks, try the next one
      if (currentImageIndex < fallbackImages.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      } else {
        setHasError(true);
        console.warn(`Failed to load image for grid item with index ${index}`);
      }
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [currentImageIndex, fallbackImages, index]);

  return (
    <div className="grid__item">
      <div
        className="grid__item-inner"
        style={{
          backgroundImage: `url(${fallbackImages[currentImageIndex]})`,
          backgroundColor: 'rgba(255, 255, 255, 0.1)', // Fallback color
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          // Add a border if all images failed
          border: hasError ? '1px solid rgba(255, 255, 255, 0.3)' : 'none'
        }}
      ></div>
    </div>
  );
};

const About: React.FC = () => {
  useEffect(() => {
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
        style={{ backgroundImage: 'url(/assets/noise.png)', backgroundRepeat: 'repeat' }}
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
