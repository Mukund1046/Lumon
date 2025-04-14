
/**
 * Lanyard Utility - Inspired by Lumon's office management systems
 * This utility provides functions for managing data and transitions
 */

/**
 * Transforms data arrays with a delay between each item
 * @param data The array to process
 * @param callback Function to call for each item
 * @param delay Delay between processing items (in ms)
 */
export const processSequentially = <T>(
  data: T[],
  callback: (item: T, index: number) => void,
  delay = 100
): void => {
  data.forEach((item, index) => {
    setTimeout(() => {
      callback(item, index);
    }, index * delay);
  });
};

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * @param func Function to debounce
 * @param wait Wait time in milliseconds
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait = 300
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>): void => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Simple data filtering utility
 * @param items Array of items to filter
 * @param predicate Filter function
 */
export const filter = <T>(
  items: T[],
  predicate: (item: T) => boolean
): T[] => {
  return items.filter(predicate);
};
