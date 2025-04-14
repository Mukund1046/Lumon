
import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const JoinUs: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    message: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  };
  
  return (
    <section id="join-us" className="py-24">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-trap font-medium tracking-tight mb-4">
            Join <span className="text-lumon-accent">Lumon Industries</span>
          </h2>
          
          <div className="w-20 h-1 bg-lumon-accent/40 mx-auto mb-6"></div>
          
          <p className="text-foreground/80 font-jakarta text-lg">
            Ready to separate your work life from your home life? 
            Apply now to begin your journey with Lumon Industries.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="opacity-0 animate-slide-up">
            <h3 className="text-2xl font-trap font-medium mb-6">
              Why Choose Severance?
            </h3>
            
            <ul className="space-y-4">
              {[
                "Complete work-life separation",
                "Increased focus and productivity",
                "Competitive compensation package",
                "Regular wellness check-ins",
                "Exclusive employee perks and incentives",
                "State-of-the-art facilities"
              ].map((benefit, index) => (
                <li key={index} className="flex items-start font-jakarta">
                  <span className="mr-3 mt-1 flex-shrink-0 flex items-center justify-center w-5 h-5 bg-lumon-accent/20 rounded-full">
                    <Check className="h-3 w-3 text-lumon-accent" />
                  </span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-8 p-6 bg-lumon-dark/5 rounded-sm border border-lumon-dark/10">
              <p className="text-sm font-jakarta italic">
                "The Severance procedure is completely safe and reversible. All employees undergo
                 a thorough screening process to ensure they are suitable candidates."
              </p>
              <p className="text-right text-sm font-jakarta mt-2">
                — Lumon Wellness Department
              </p>
            </div>
          </div>
          
          <div className="opacity-0 animate-slide-up animate-delay-200">
            {submitted ? (
              <div className="lumon-card h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-trap font-medium mb-3">Application Received</h3>
                <p className="text-foreground/80 font-jakarta">
                  Thank you for your interest in Lumon Industries. Our team will review your application
                  and contact you shortly to discuss the next steps.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="lumon-card">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground/90 mb-1 font-jakarta">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-lumon-neutral/30 rounded-sm focus:outline-none focus:ring-2 focus:ring-lumon-accent/50 font-jakarta"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground/90 mb-1 font-jakarta">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-lumon-neutral/30 rounded-sm focus:outline-none focus:ring-2 focus:ring-lumon-accent/50 font-jakarta"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-foreground/90 mb-1 font-jakarta">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-lumon-neutral/30 rounded-sm focus:outline-none focus:ring-2 focus:ring-lumon-accent/50 font-jakarta"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-foreground/90 mb-1 font-jakarta">
                      Preferred Department
                    </label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-lumon-neutral/30 rounded-sm focus:outline-none focus:ring-2 focus:ring-lumon-accent/50 font-jakarta"
                    >
                      <option value="">Select a department</option>
                      <option value="mdr">Macrodata Refinement</option>
                      <option value="od">Optics & Design</option>
                      <option value="di">Data Integrity</option>
                      <option value="hr">Human Resources</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground/90 mb-1 font-jakarta">
                      Why do you want to join Lumon?
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-lumon-neutral/30 rounded-sm focus:outline-none focus:ring-2 focus:ring-lumon-accent/50 font-jakarta"
                    ></textarea>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button type="submit" className="lumon-button w-full group">
                    <span className="flex items-center justify-center">
                      Submit Application
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinUs;
