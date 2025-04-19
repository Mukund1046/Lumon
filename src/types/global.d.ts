// Global type declarations

interface Window {
  BulgeEffect: any;
  syncOsmoMenuState?: (isOpen: boolean) => void;
  updateMobileMenuState?: (isOpen: boolean) => void;
  osmoOpenMenu?: () => void;
  osmoCloseMenu?: () => void;
}
