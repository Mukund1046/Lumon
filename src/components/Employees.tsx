
import React from 'react';
import { cn } from '@/lib/utils';

interface Employee {
  name: string;
  position: string;
  quote: string;
  image: string;
}

// Using placeholder images for employees - in a real scenario, you'd use actual employee photos
const employees: Employee[] = [
  {
    name: "Mark Scout",
    position: "MDR Department",
    quote: "I never take my work home with me. Literally.",
    image: "/placeholder.svg"
  },
  {
    name: "Helly R.",
    position: "MDR Department",
    quote: "Every day feels like my first day here.",
    image: "/placeholder.svg"
  },
  {
    name: "Dylan George",
    position: "MDR Department",
    quote: "I like the perks. Especially the waffle parties.",
    image: "/placeholder.svg"
  },
  {
    name: "Irving Bailiff",
    position: "MDR Department",
    quote: "The handbook provides all the answers we need.",
    image: "/placeholder.svg"
  }
];

const Employees: React.FC = () => {
  return (
    <section id="employees" className="py-24 bg-lumon-dark text-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-trap font-medium tracking-tight mb-4">
            Our <span className="text-lumon-accent">Employees</span>
          </h2>
          
          <div className="w-20 h-1 bg-lumon-accent/60 mx-auto mb-6"></div>
          
          <p className="text-white/80 font-jakarta text-lg">
            Meet the dedicated team members who have chosen the severed work experience.
            These are their work selves speaking about life at Lumon.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {employees.map((employee, index) => (
            <div 
              key={index}
              className={cn(
                "bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm p-6 flex flex-col",
                "opacity-0 animate-slide-up",
                index === 0 ? "animate-delay-100" :
                index === 1 ? "animate-delay-200" :
                index === 2 ? "animate-delay-300" : "animate-delay-400"
              )}
            >
              <div className="mb-4 mx-auto w-20 h-20 overflow-hidden rounded-full">
                <img 
                  src={employee.image} 
                  alt={employee.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h3 className="text-lg font-trap font-medium mb-1 text-center">
                {employee.name}
              </h3>
              
              <p className="text-lumon-accent text-sm mb-4 text-center">
                {employee.position}
              </p>
              
              <blockquote className="text-white/70 font-jakarta text-sm italic text-center">
                "{employee.quote}"
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Employees;
