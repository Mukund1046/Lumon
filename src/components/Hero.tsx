
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const Hero: React.FC = () => {
  return (
    <section 
      id="home" 
      className="relative min-h-screen pt-24 pb-16 flex items-center"
    >
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="opacity-0 animate-fade-in text-5xl sm:text-6xl md:text-7xl font-trap font-medium leading-tight tracking-tight text-lumon-dark mb-6">
            Work-Life Integration
            <span className="block text-lumon-accent">Redefined</span>
          </h1>
          
          <p className="opacity-0 animate-fade-in animate-delay-200 font-jakarta text-lg sm:text-xl text-foreground/80 mb-10 max-w-2xl mx-auto">
            At Lumon Industries, we believe in complete separation of work and personal life. 
            Our revolutionary severance procedure ensures your work self never meets your home self.
          </p>
          
          <div className="opacity-0 animate-fade-in animate-delay-300 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="lumon-button group">
              <span className="flex items-center">
                Apply for Severance
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
            
            <a 
              href="#about" 
              className="font-jakarta text-foreground hover:text-lumon-accent transition-colors underline underline-offset-4"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className={cn(
        "absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-1 bg-gradient-to-r",
        "from-transparent via-lumon-accent/30 to-transparent"
      )}></div>
    </section>
  );
};

export default Hero;
