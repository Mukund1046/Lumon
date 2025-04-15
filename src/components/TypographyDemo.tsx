import React from 'react';

const TypographyDemo: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="trap-heading h1">Neo-Modernist Typography System</h1>
        
        <section className="mb-12">
          <h2 className="trap-heading h2">Trap Headings</h2>
          <div className="bg-severance-frost p-6 rounded-md mb-8">
            <h1 className="trap-heading h1">Heading Level 1</h1>
            <h2 className="trap-heading h2">Heading Level 2</h2>
            <h3 className="trap-heading h3">Heading Level 3</h3>
            <h4 className="trap-heading h4">Heading Level 4</h4>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="trap-heading h2">Jakarta Subheadings</h2>
          <div className="bg-severance-frost p-6 rounded-md mb-8">
            <h3 className="jakarta-subheading h3">Subheading Level 3</h3>
            <h4 className="jakarta-subheading h4">Subheading Level 4</h4>
            <h5 className="jakarta-subheading h5">Subheading Level 5</h5>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="trap-heading h2">Jakarta Body Text</h2>
          <div className="bg-severance-frost p-6 rounded-md mb-8">
            <p className="jakarta-body large mb-4">
              This is large body text. Lumon Industries is a pioneer in the field of severance, a revolutionary procedure that surgically divides your memories between your work and personal life.
            </p>
            <p className="jakarta-body medium mb-4">
              This is medium body text. When you're here, you'll be unable to access your personal memories. And when you leave, you won't remember anything about your workday.
            </p>
            <p className="jakarta-body small">
              This is small body text. The severance procedure is completely safe and has been approved by the relevant authorities. Join us in creating a better work-life balance.
            </p>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="trap-heading h2">JetBrains Mono Navigation</h2>
          <div className="bg-severance-frost p-6 rounded-md mb-8">
            <nav className="flex space-x-6">
              <a href="#" className="jetbrains-mono-nav">Home</a>
              <a href="#" className="jetbrains-mono-nav">About</a>
              <a href="#" className="jetbrains-mono-nav">Departments</a>
              <a href="#" className="jetbrains-mono-nav">Employees</a>
              <a href="#" className="jetbrains-mono-nav">Join Us</a>
            </nav>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="trap-heading h2">JetBrains Mono Buttons</h2>
          <div className="bg-severance-frost p-6 rounded-md mb-8 flex space-x-4">
            <button className="jetbrains-mono-button bg-severance-midnight text-severance-frost px-6 py-3 rounded">
              Primary Button
            </button>
            <button className="jetbrains-mono-button bg-severance-frost text-severance-midnight border border-severance-midnight px-6 py-3 rounded">
              Secondary Button
            </button>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="trap-heading h2">Vertical Rhythm Example</h2>
          <div className="bg-severance-frost p-6 rounded-md">
            <h3 className="trap-heading h3">The Severance Procedure</h3>
            <p className="jakarta-body medium">
              The severance procedure is a revolutionary approach to work-life balance. By surgically dividing your memories between your work and personal life, we ensure that work stress never follows you home.
            </p>
            <h4 className="jakarta-subheading h4">How It Works</h4>
            <p className="jakarta-body medium">
              A small device is implanted at the base of your skull. This device activates when you enter and exit the Lumon facility, effectively switching between your "innie" and "outie" personas.
            </p>
            <p className="jakarta-body medium">
              Your "innie" has no memory of your life outside of work, and your "outie" has no memory of what happens during your workday. This creates a perfect separation between work and personal life.
            </p>
            <h4 className="jakarta-subheading h4">Benefits of Severance</h4>
            <ul className="list-disc pl-6 mb-6">
              <li className="jakarta-body medium mb-2">Complete work-life separation</li>
              <li className="jakarta-body medium mb-2">Reduced stress at home</li>
              <li className="jakarta-body medium mb-2">Increased productivity at work</li>
              <li className="jakarta-body medium">Simplified life management</li>
            </ul>
            <div className="mt-6">
              <button className="jetbrains-mono-button bg-severance-midnight text-severance-frost px-6 py-3 rounded">
                Apply for Severance
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TypographyDemo;
