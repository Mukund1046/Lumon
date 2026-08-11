
import React from 'react';
import InfiniteMenu from '../components/ui/InfiniteMenu/InfiniteMenu';
import '../components/ui/InfiniteMenu/InfiniteMenu.css';
import './Employees.css'; // We'll create this file for custom styling

interface Employee {
  name: string;
  position: string;
  quote: string;
  image: string;
  link: string;
  title: string;
  description: string;
}

// Using Severance images for employees
const employees: Employee[] = [
  {
    name: "Mark Scout",
    position: "MDR Team Lead",
    quote: "I never take my work home with me. Literally.",
    image: "/assets/Severance128.jpg", // Mark's image
    link: "/employees/mark",
    title: "Mark Scout",
    description: "MDR Team Lead who chose severance after a personal tragedy."
  },
  {
    name: "Helly R.",
    position: "MDR Refiner",
    quote: "Every day feels like my first day here.",
    image: "/assets/Severance31.jpeg", // Helly's image
    link: "/employees/helly",
    title: "Helly R.",
    description: "New MDR employee with a rebellious spirit."
  },
  {
    name: "Irving Bailiff",
    position: "MDR Refiner",
    quote: "The handbook provides all the answers we need.",
    image: "/assets/Severance47.jpg", // Irving's image
    link: "/employees/irving",
    title: "Irving Bailiff",
    description: "Loyal employee with a deep appreciation for company policy."
  },
  {
    name: "Dylan George",
    position: "MDR Refiner",
    quote: "I like the perks. Especially the waffle parties.",
    image: "/assets/Severance52.jpg", // Dylan's image
    link: "/employees/dylan",
    title: "Dylan George",
    description: "Competitive employee who enjoys Lumon's unique incentives."
  },
  // Duplicate employees with the same images to fill out the sphere
  {
    name: "Mark Scout",
    position: "MDR Team Lead",
    quote: "I never take my work home with me. Literally.",
    image: "/assets/Severance128.jpg",
    link: "/employees/mark",
    title: "Mark Scout",
    description: "MDR Team Lead who chose severance after a personal tragedy."
  },
  {
    name: "Helly R.",
    position: "MDR Refiner",
    quote: "Every day feels like my first day here.",
    image: "/assets/Severance31.jpeg",
    link: "/employees/helly",
    title: "Helly R.",
    description: "New MDR employee with a rebellious spirit."
  },
  {
    name: "Irving Bailiff",
    position: "MDR Refiner",
    quote: "The handbook provides all the answers we need.",
    image: "/assets/Severance47.jpg",
    link: "/employees/irving",
    title: "Irving Bailiff",
    description: "Loyal employee with a deep appreciation for company policy."
  },
  {
    name: "Dylan George",
    position: "MDR Refiner",
    quote: "I like the perks. Especially the waffle parties.",
    image: "/assets/Severance52.jpg",
    link: "/employees/dylan",
    title: "Dylan George",
    description: "Competitive employee who enjoys Lumon's unique incentives."
  },
  // More duplicates to fill the sphere
  {
    name: "Mark Scout",
    position: "MDR Team Lead",
    quote: "I never take my work home with me. Literally.",
    image: "/assets/Severance128.jpg",
    link: "/employees/mark",
    title: "Mark Scout",
    description: "MDR Team Lead who chose severance after a personal tragedy."
  },
  {
    name: "Helly R.",
    position: "MDR Refiner",
    quote: "Every day feels like my first day here.",
    image: "/assets/Severance31.jpeg",
    link: "/employees/helly",
    title: "Helly R.",
    description: "New MDR employee with a rebellious spirit."
  },
  {
    name: "Irving Bailiff",
    position: "MDR Refiner",
    quote: "The handbook provides all the answers we need.",
    image: "/assets/Severance47.jpg",
    link: "/employees/irving",
    title: "Irving Bailiff",
    description: "Loyal employee with a deep appreciation for company policy."
  },
  {
    name: "Dylan George",
    position: "MDR Refiner",
    quote: "I like the perks. Especially the waffle parties.",
    image: "/assets/Severance52.jpg",
    link: "/employees/dylan",
    title: "Dylan George",
    description: "Competitive employee who enjoys Lumon's unique incentives."
  }
];

const Employees: React.FC = () => {
  return (
    <section id="employees" className="employees-section">
      {/* Layered background */}
      <div className="employees-background"></div>
      <div className="employees-grid"></div>
      <div className="employees-glow"></div>
      <div className="employees-noise" aria-hidden="true"></div>

      <div className="employees-content">
        <header className="employees-header">
          <p className="employees-eyebrow">Lumon Industries · Macrodata Refinement</p>
          <h2 className="employees-title">
            <span className="employees-title-line">The Severed</span>
            <span className="employees-title-line employees-title-line--offset">Floor</span>
          </h2>
          <p className="employees-hint">
            <span className="employees-hint-dot" aria-hidden="true"></span>
            Drag the sphere to explore
          </p>
        </header>

        <div className="employees-stage">
          <div className="infinite-menu-container">
            <InfiniteMenu
              items={employees}
              onItemClick={(item) => {
                window.location.href = item.link;
              }}
            />
          </div>
        </div>

        <footer className="employees-footer">
          <p>All personnel shown are voluntarily severed.</p>
        </footer>
      </div>
    </section>
  );
};

export default Employees;
