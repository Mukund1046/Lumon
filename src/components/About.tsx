
import React from 'react';
import { cn } from '@/lib/utils';

const features = [
  {
    title: "Complete Separation",
    description: "Our patented procedure ensures your work self (innie) never meets your home self (outie)."
  },
  {
    title: "Perfect Focus",
    description: "With no distractions from your personal life, productivity reaches unprecedented levels."
  },
  {
    title: "Work-Life Balance",
    description: "Leave work at work, literally. Your home self will never worry about pending tasks."
  },
  {
    title: "Dedicated Care",
    description: "Our wellness counselors ensure your work self is always comfortable and supported."
  }
];

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-trap font-medium tracking-tight mb-4">
            About <span className="text-lumon-accent">Severance</span>
          </h2>
          
          <div className="w-20 h-1 bg-lumon-accent/40 mx-auto mb-6"></div>
          
          <p className="text-foreground/80 font-jakarta text-lg">
            Severance is a revolutionary procedure that surgically divides your memories between your work and personal life.
            When you're at work, you only have work memories. When you're outside of work, you only have personal memories.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={cn(
                "lumon-card hover:shadow-md overflow-hidden flex flex-col",
                "opacity-0 animate-slide-up",
                index === 0 ? "animate-delay-100" :
                index === 1 ? "animate-delay-200" :
                index === 2 ? "animate-delay-300" : "animate-delay-400"
              )}
            >
              <div className="h-2 bg-lumon-accent/70 w-full -mt-6 mb-6"></div>
              
              <h3 className="text-xl font-trap font-medium mb-3">
                {feature.title}
              </h3>
              
              <p className="text-foreground/70 font-jakarta flex-grow">
                {feature.description}
              </p>
              
              <div className="pt-4 mt-auto">
                <span className="inline-block px-3 py-1 text-xs font-jakarta text-lumon-dark bg-lumon-neutral/10 rounded-full">
                  Lumon Certified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
