import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Define the color scheme types
export type ColorScheme = 'woe' | 'malice' | 'dread' | 'frolic' | 'default';

// Map routes to color schemes
const routeToColorScheme: Record<string, ColorScheme> = {
  '/': 'default',
  '/about': 'woe',      // WOE color scheme
  '/departments': 'malice', // MALICE color scheme
  '/employees': 'dread',   // DREAD color scheme
  '/join-us': 'frolic'    // FROLIC color scheme
};

// Create context
interface ColorSchemeContextType {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
}

const ColorSchemeContext = createContext<ColorSchemeContextType>({
  colorScheme: 'default',
  setColorScheme: () => {}
});

// Hook to use the color scheme
export const useColorScheme = () => useContext(ColorSchemeContext);

// Provider component
interface ColorSchemeProviderProps {
  children: React.ReactNode;
}

export const ColorSchemeProvider: React.FC<ColorSchemeProviderProps> = ({ children }) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('default');
  const location = useLocation();

  // Update color scheme based on route
  useEffect(() => {
    const pathname = location.pathname;
    const newScheme = routeToColorScheme[pathname] || 'default';
    setColorScheme(newScheme);
    
    // Apply color scheme to document body
    document.body.setAttribute('data-color-scheme', newScheme);
    
    console.log(`Applied color scheme: ${newScheme} for route: ${pathname}`);
  }, [location.pathname]);

  return (
    <ColorSchemeContext.Provider value={{ colorScheme, setColorScheme }}>
      {children}
    </ColorSchemeContext.Provider>
  );
};

export default ColorSchemeProvider;
