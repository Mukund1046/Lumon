
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EmployeeScene from './EmployeeScene';

interface Employee {
  name: string;
  position: string;
  quote: string;
  image: string;
  color: string;
}

// Using placeholder images for employees - in a real scenario, you'd use actual employee photos
const employees: Employee[] = [
  {
    name: "Mark Scout",
    position: "MDR Department",
    quote: "I never take my work home with me. Literally.",
    image: "/placeholder.svg",
    color: "#9b87f5" // Lumon accent color
  },
  {
    name: "Helly R.",
    position: "MDR Department",
    quote: "Every day feels like my first day here.",
    image: "/placeholder.svg",
    color: "#4c8bf5" // Blue
  },
  {
    name: "Dylan George",
    position: "MDR Department",
    quote: "I like the perks. Especially the waffle parties.",
    image: "/placeholder.svg",
    color: "#f55142" // Red
  },
  {
    name: "Irving Bailiff",
    position: "MDR Department",
    quote: "The handbook provides all the answers we need.",
    image: "/placeholder.svg",
    color: "#42f59e" // Green
  }
];

const Employees: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDialogOpen(true);
  };

  return (
    <section id="employees" className="py-12 bg-lumon-dark text-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-trap font-medium tracking-tight mb-4">
            Our <span className="text-lumon-accent">Employees</span>
          </h2>
          
          <div className="w-20 h-1 bg-lumon-accent/60 mx-auto mb-6"></div>
          
          <p className="text-white/80 font-jakarta text-lg mb-8">
            Meet the dedicated team members who have chosen the severed work experience.
            Interact with the 3D scene below to learn more about each employee.
          </p>
        </div>
        
        {/* 3D Scene */}
        <div className="mb-16">
          <EmployeeScene 
            employees={employees} 
            onSelectEmployee={handleEmployeeSelect} 
            className="rounded-md border border-white/10 shadow-lg"
          />
          <p className="text-center text-white/60 mt-4 italic">
            Click on an employee cube to learn more. Drag to rotate the view.
          </p>
        </div>
        
        {/* Employee Grid (alternative display) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {employees.map((employee, index) => (
            <div 
              key={index}
              className={cn(
                "bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm p-6 flex flex-col cursor-pointer",
                "opacity-0 animate-slide-up transition-transform hover:scale-105",
                index === 0 ? "animate-delay-100" :
                index === 1 ? "animate-delay-200" :
                index === 2 ? "animate-delay-300" : "animate-delay-400"
              )}
              onClick={() => handleEmployeeSelect(employee)}
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
        
        {/* Employee Detail Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-lumon-dark border-lumon-accent/50 text-white">
            {selectedEmployee && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl font-trap">
                    {selectedEmployee.name}
                  </DialogTitle>
                  <DialogDescription className="text-lumon-accent">
                    {selectedEmployee.position}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="flex flex-col items-center py-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-lumon-accent/70">
                    <img
                      src={selectedEmployee.image}
                      alt={selectedEmployee.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <blockquote className="text-white/90 text-lg italic text-center mb-4">
                    "{selectedEmployee.quote}"
                  </blockquote>
                  
                  <p className="text-white/70 text-sm text-center">
                    As a severed employee, {selectedEmployee.name} experiences a complete separation between work and personal life.
                    Their work self has no knowledge of their outside life, and vice versa.
                  </p>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Employees;
