
import React, { useEffect } from 'react';
import '../styles/slicedText.css';
import { initSlicedText } from '../scripts/slicedText/index.js';

interface Department {
  name: string;
  description: string;
  effect: string;
}

const departments: Department[] = [
  {
    name: "Macrodata Refinement",
    description: "Our MDR team works with numeric data sequences, refining them through intuition-based processes.",
    effect: "1"
  },
  {
    name: "Optics & Design",
    description: "Creating visual assets and maintaining Lumon's distinct aesthetic across all platforms.",
    effect: "2"
  },
  {
    name: "Data Integrity",
    description: "Ensuring the accuracy and consistency of all data processed within Lumon Industries.",
    effect: "3"
  },
  {
    name: "Human Resources",
    description: "Supporting our employees and maintaining the harmonious environment at Lumon.",
    effect: "4"
  }
];

const Departments: React.FC = () => {
  useEffect(() => {
    // Initialize sliced text effect after component mounts
    const timer = setTimeout(() => {
      initSlicedText();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="departments" className="sliced-text-container">
      {/* Background decoration images */}
      <div className="deco">
        {Array.from({ length: 36 }, (_, i) => {
          // Use a variety of Severance images with different indices
          const imageIndex = ((i * 7) % 134) + 1; // This formula creates a good distribution
          // Create an array of possible image paths with different extensions
          const imagePaths = [
            `/assets/Severance${imageIndex}.jpg`,
            `/assets/Severance${imageIndex}.jpeg`,
            `/assets/severance${imageIndex}.jpg`,
            `/assets/severance${imageIndex}.jpeg`
          ];

          return (
            <div
              key={`deco-${i}`}
              className="deco__item"
              style={{
                backgroundImage: `url(${imagePaths[0]}), url(${imagePaths[1]}), url(${imagePaths[2]}), url(${imagePaths[3]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            ></div>
          );
        })}
      </div>

      {/* Intro section */}
      <div className="content" style={{ paddingTop: '180px' }}>
        <p>
          At Lumon Industries, we believe in the power of separation.
          Our departments operate with precision and purpose.
          Each contributing to our mission in their unique way.
          Discover the specialized teams that make Lumon exceptional.
        </p>
        <h2 className="gtext size-s font-trap end color-frost" data-text="Discover Excellence">Discover Excellence</h2>
        <h2 className="gtext size-s font-trap end color-frost" data-text="Discover Excellence">Discover Excellence</h2>
      </div>

      {/* Macrodata Refinement */}
      <div className="content content--full">
        <h3 className="gtext size-xxl font-trap shadow-1 spaced color-frost" data-text="MDR" data-effect="1">MDR</h3>
      </div>

      <div className="content">
        <p>
          Our Macrodata Refinement team works with numeric sequences,
          refining them through intuition-based processes.
          They find patterns in the chaos, order in the randomness.
          The work is mysterious, but the results are undeniable.
        </p>
        <h2 className="gtext size-s font-space-grotesk end color-slate" data-text="Refine Data">Refine Data</h2>
      </div>

      {/* Optics & Design */}
      <div className="content content--full">
        <h3 className="gtext size-xl font-trap shadow-1 color-brass spaced" data-text="O&D" data-effect="2">O&D</h3>
      </div>

      <div className="content">
        <p>
          Optics & Design creates the visual language of Lumon,
          crafting our aesthetic across all platforms and spaces.
          They transform concepts into tangible experiences,
          ensuring our presence is both distinctive and memorable.
        </p>
        <h2 className="gtext size-s font-space-grotesk end color-slate" data-text="Create Vision">Create Vision</h2>
        <h2 className="gtext size-s font-space-grotesk end color-slate" data-text="Create Vision">Create Vision</h2>
      </div>

      {/* Data Integrity */}
      <div className="content content--full">
        <h3 className="gtext size-xl font-trap shadow-1 spaced color-frost" data-text="DI" data-effect="3">DI</h3>
      </div>

      <div className="content content--full">
        <h2 className="gtext size-m font-jetbrains end color-slate" data-text="Verify Truth">Verify Truth</h2>
      </div>

      <div className="content">
        <p>
          Data Integrity ensures the accuracy and consistency
          of all information processed within Lumon Industries.
          They are the guardians of truth, the validators of fact,
          working tirelessly to maintain the purity of our data.
        </p>
      </div>

      {/* Human Resources */}
      <div className="content content--full">
        <h3 className="gtext size-xl font-trap shadow-1 blendmode-1 spaced color-brass" data-text="HR" data-effect="4">HR</h3>
      </div>

      <div className="content content--full">
        <h2 className="gtext size-m font-jetbrains end color-slate" data-text="Support Growth">Support Growth</h2>
      </div>

      <div className="content">
        <p>
          Human Resources supports our most valuable asset: our people.
          They maintain the harmonious environment at Lumon,
          ensuring each employee finds their perfect place,
          and experiences the fulfillment that comes with severance.
        </p>
        <h2 className="gtext size-s font-space-grotesk end color-frost" data-text="Join Us">Join Us</h2>
        <h2 className="gtext size-s font-space-grotesk end color-frost" data-text="Join Us">Join Us</h2>
      </div>
    </section>
  );
};

export default Departments;
