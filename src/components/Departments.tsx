
import React from 'react';
import { cn } from '@/lib/utils';

interface Department {
  name: string;
  description: string;
  icon: string;
}

const departments: Department[] = [
  {
    name: "Macrodata Refinement",
    description: "Our MDR team works with numeric data sequences, refining them through intuition-based processes.",
    icon: "📊"
  },
  {
    name: "Optics & Design",
    description: "Creating visual assets and maintaining Lumon's distinct aesthetic across all platforms.",
    icon: "🎨"
  },
  {
    name: "Data Integrity",
    description: "Ensuring the accuracy and consistency of all data processed within Lumon Industries.",
    icon: "🔍"
  },
  {
    name: "Human Resources",
    description: "Supporting our employees and maintaining the harmonious environment at Lumon.",
    icon: "👥"
  }
];

const Departments: React.FC = () => {
  return (
    <section id="departments" className="py-24">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-trap font-medium tracking-tight mb-4">
            Our <span className="text-lumon-accent">Departments</span>
          </h2>
          
          <div className="w-20 h-1 bg-lumon-accent/40 mx-auto mb-6"></div>
          
          <p className="text-foreground/80 font-jakarta text-lg">
            Lumon Industries operates through specialized departments, each contributing to our unique vision.
            Join one of our elite teams to become part of something truly meaningful.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept, index) => (
            <div 
              key={index}
              className={cn(
                "lumon-card hover:shadow-md flex flex-col text-center p-8 transition-all hover:-translate-y-1",
                "opacity-0 animate-slide-up",
                index === 0 ? "animate-delay-100" :
                index === 1 ? "animate-delay-200" :
                index === 2 ? "animate-delay-300" : "animate-delay-400"
              )}
            >
              <div className="mb-4 mx-auto flex items-center justify-center w-16 h-16 bg-lumon-accent/10 rounded-full">
                <span className="text-2xl" role="img" aria-label={dept.name}>
                  {dept.icon}
                </span>
              </div>
              
              <h3 className="text-xl font-trap font-medium mb-3">
                {dept.name}
              </h3>
              
              <p className="text-foreground/70 font-jakarta text-sm">
                {dept.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Departments;
