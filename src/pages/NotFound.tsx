import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="w-full bg-severance-frost items-center justify-center h-full overflow-auto">
      {/* Main content with higher z-index */}
      <div className="relative z-10">
        <Navbar />
        <div className="w-full min-h-[100vh] flex items-center justify-center bg-severance-frost pt-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-severance-marine">404</h1>
            <p className="text-xl text-severance-timber mb-4">Oops! Page not found</p>
            <a href="/" className="text-severance-brass hover:text-severance-marine underline">
              Return to Home
            </a>
          </div>
        </div>
      </div>

      {/* Sticky footer with lower z-index */}
      <Footer />
    </div>
  );
};

export default NotFound;
