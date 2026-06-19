// Global type declarations

interface Window {
  BulgeEffect: any;
  gsap: typeof import('gsap').gsap;
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger;
  Lenis?: new (options?: Record<string, unknown>) => {
    raf: (time: number) => void;
    on: (event: string, callback: () => void) => void;
    destroy: () => void;
  };
  syncOsmoMenuState?: (isOpen: boolean) => void;
  updateMobileMenuState?: (isOpen: boolean) => void;
  osmoOpenMenu?: () => void;
  osmoCloseMenu?: () => void;
}
