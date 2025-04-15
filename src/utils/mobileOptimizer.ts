/**
 * Utility functions for optimizing performance on mobile devices
 */

/**
 * Detects if the current device is a mobile device
 * @returns {boolean} True if the device is mobile, false otherwise
 */
export const isMobileDevice = (): boolean => {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth <= 768
  );
};

/**
 * Optimizes WebGL renderer settings for mobile devices
 * @param {THREE.WebGLRenderer} renderer - The THREE.js WebGLRenderer to optimize
 */
export const optimizeRendererForMobile = (renderer: any): void => {
  if (!renderer) return;
  
  if (isMobileDevice()) {
    // Lower pixel ratio for better performance
    renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
    
    // Disable certain features for better performance
    renderer.shadowMap.enabled = false;
    renderer.powerPreference = 'high-performance';
    
    // Set precision to medium for better performance
    if (renderer.getContext) {
      const gl = renderer.getContext();
      gl.getExtension('WEBGL_lose_context');
    }
  } else {
    // For desktop, use higher quality settings
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.shadowMap.enabled = true;
  }
};

/**
 * Optimizes shader complexity based on device capabilities
 * @param {string} shader - The shader code to optimize
 * @param {boolean} isMobile - Whether the device is mobile
 * @returns {string} The optimized shader code
 */
export const optimizeShaderForMobile = (shader: string, isMobile: boolean): string => {
  if (!isMobile) return shader;
  
  // Replace high precision with medium precision
  return shader.replace(/precision highp float;/g, 'precision mediump float;');
};

/**
 * Throttles animation frame updates for mobile devices
 * @param {Function} callback - The animation callback function
 * @param {number} fps - Target frames per second (default: 30 for mobile)
 * @returns {Function} The throttled animation callback
 */
export const throttleAnimationForMobile = (callback: Function, fps: number = 30): Function => {
  if (!isMobileDevice()) return callback;
  
  const interval = 1000 / fps;
  let lastTime = 0;
  
  return (time: number) => {
    if (time - lastTime < interval) return;
    lastTime = time;
    callback(time);
  };
};
