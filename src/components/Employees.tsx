
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
    <section id="employees" className="employees-section bg-wardrobe-dark text-wardrobe-light relative overflow-hidden">
      {/* Background elements */}
      <div className="employees-background"></div>
      <div className="employees-grid"></div>

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-15 mix-blend-overlay animate-noise"
        style={{ backgroundImage: 'url(/assets/noise.png)', backgroundRepeat: 'repeat' }}
      ></div>

      <div className="container-custom employees-content">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-trap font-medium tracking-tight mb-4 employees-title">
            Our <span className="text-wardrobe-blue">Employees</span>
          </h2>

          <p className="text-wardrobe-light/80 font-space-grotesk text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Meet the dedicated team members who have chosen the severed work experience.
            Each contributes to Lumon's mission in their unique way.
          </p>

          <p className="text-wardrobe-blue/90 font-jetbrains-mono text-sm mb-4 italic">
            Drag the sphere to explore our employees
          </p>
        </div>

        {/* InfiniteMenu Component */}
        <div className="infinite-menu-container">
          <InfiniteMenu
            items={employees}
            onItemClick={(item) => {
              window.location.href = item.link;
            }}
          />
        </div>

        <div className="text-center mt-8 text-wardrobe-light/60 font-space-grotesk text-sm">
          <p>All employees shown have undergone the severance procedure.</p>
        </div>
      </div>
    </section>
  );
};

export default Employees;
