
/**
 * Data Service - Handles data operations for the Severance application
 * Simulates interaction with Lumon's MDR department
 */

interface DataPoint {
  id: string;
  value: number;
  category: string;
}

/**
 * Generates a random dataset of specified size
 * @param size Number of data points to generate
 */
export const generateDataset = (size: number): DataPoint[] => {
  const categories = ['Refiner', 'Macro Data', 'Optics', 'Design'];
  
  return Array.from({ length: size }, (_, i) => ({
    id: `data-${i}`,
    value: Math.floor(Math.random() * 100),
    category: categories[Math.floor(Math.random() * categories.length)]
  }));
};

/**
 * Processes data in the style of MDR refinement
 * @param data Data points to process
 */
export const refineData = (data: DataPoint[]): DataPoint[] => {
  return data.map(point => ({
    ...point,
    value: point.value > 50 ? point.value + 10 : point.value - 5
  }));
};

/**
 * Categorizes data into different buckets
 * @param data Data to categorize
 */
export const categorizeData = (data: DataPoint[]): Record<string, DataPoint[]> => {
  return data.reduce((acc, point) => {
    if (!acc[point.category]) {
      acc[point.category] = [];
    }
    acc[point.category].push(point);
    return acc;
  }, {} as Record<string, DataPoint[]>);
};
