import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NotFound = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Log the 404 error
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    // Trigger the fade-in animation after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="w-full bg-severance-frost items-center justify-center h-full overflow-auto">
      {/* Main content with higher z-index */}
      <div className="relative z-10">
        <Navbar />
        <div className="w-full min-h-[100vh] flex items-center justify-center bg-severance-frost pt-24 relative">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
          {/* Noise texture overlay */}
          <div className="absolute inset-0 opacity-10 mix-blend-overlay animate-noise" style={{ backgroundImage: 'url(/assets/noise.png)', backgroundRepeat: 'repeat' }}></div>
          <div className={`text-center max-w-md mx-auto px-4 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-6xl font-trap font-bold mb-6 text-severance-marine">404</h1>
            <p className="text-2xl font-trap text-severance-timber mb-3">Page Not Found</p>
            <p className="text-severance-timber/80 mb-8">The page you're looking for doesn't exist or has been moved to another location.</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="lumon-button primary jetbrains-mono-button flex items-center justify-center px-6 py-3 text-sm bg-severance-frost text-severance-midnight border border-severance-marine hover:bg-severance-marine hover:text-severance-frost transition-all duration-300 shadow-md"
              >
                Return to Home
              </Link>

              <button
                onClick={() => window.history.back()}
                className="lumon-button secondary jetbrains-mono-button flex items-center justify-center px-6 py-3 text-sm bg-transparent text-severance-marine border border-severance-marine hover:bg-severance-marine/10 transition-all duration-300"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky footer with lower z-index */}
      <Footer />
    </div>
  );
};

export default NotFound;
