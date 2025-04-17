import { useLocation, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Screensaver from "@/fancy/components/blocks/screensaver";

// Define the images for the screensaver
const screensaverImages = [
  "/assets/Severance1.jpeg",
  "/assets/Severance2.jpeg",
  "/assets/Severance3.jpeg",
  "/assets/Severance4.jpeg",
  "/assets/Severance5.jpeg",
  "/assets/Severance6.jpeg",
  "/assets/Severance7.jpeg",
  "/assets/Severance8.jpeg",
  "/assets/Severance9.jpeg",
  "/assets/Severance10.jpeg",
  "/assets/Severance11.jpg",
  "/assets/Severance12.jpg",
];

const NotFound = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // State to track which images to show in the screensaver
  const [activeImages, setActiveImages] = useState<string[]>([]);

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

    // Randomly select 5 images for the screensaver
    const shuffled = [...screensaverImages].sort(() => 0.5 - Math.random());
    setActiveImages(shuffled.slice(0, 5));

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="w-full bg-severance-frost items-center justify-center h-full overflow-auto not-found-theme">
      {/* Main content with higher z-index */}
      <div className="relative z-10">
        <Navbar />
        <div ref={containerRef} className="w-full min-h-[100vh] flex items-center justify-center bg-severance-frost pt-24 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
          {/* Noise texture overlay */}
          <div className="absolute inset-0 opacity-10 mix-blend-overlay animate-noise" style={{ backgroundImage: 'url(/assets/noise.png)', backgroundRepeat: 'repeat' }}></div>

          {/* Screensaver with Severance images */}
          {activeImages.map((image, index) => (
            <Screensaver
              key={`screensaver-${index}`}
              containerRef={containerRef}
              speed={1.5 + index * 0.5} // Different speeds for each image
              startPosition={{
                x: 20 + index * 15, // Different starting positions
                y: 10 + index * 12
              }}
              startAngle={45 + index * 30} // Different angles
              className="z-0"
            >
              <div className="rounded-md overflow-hidden shadow-xl opacity-40 hover:opacity-70 transition-opacity duration-500">
                <img
                  src={image}
                  alt="Severance"
                  className="w-24 h-24 sm:w-32 sm:h-32 object-cover"
                  style={{ filter: 'grayscale(70%)' }}
                />
              </div>
            </Screensaver>
          ))}
          <div className={`text-center max-w-md mx-auto px-8 py-10 transition-all duration-700 transform relative z-10 bg-severance-frost/80 backdrop-blur-sm rounded-lg shadow-lg ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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
