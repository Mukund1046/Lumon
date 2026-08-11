/**
 * App Resource Registry
 *
 * Declares every resource the application needs so the loading screen can
 * report honest, real-time progress. Each item is preloaded in the background
 * while the loading animation plays, then the overlay is released once
 * everything has finished (or the safety timeout fires).
 */

import {
  preloadManager,
  loadImage,
  loadFonts,
} from './preloadManager';

// Critical single-copy assets used across the site.
const singleAssets: Array<{ id: string; weight: number; load: () => Promise<unknown> }> = [
  { id: 'fonts', weight: 12, load: loadFonts },
  { id: 'hero-image', weight: 8, load: () => loadImage('/Mark-optimized.jpg') },
  { id: 'hero-video', weight: 10, load: () => loadVideo('/elevator-scene.mp4') },
  { id: 'noise-texture', weight: 2, load: () => loadImage('/assets/noise.png') },
  { id: 'og-image', weight: 2, load: () => loadImage('/assets/severance126.jpg') },
];

// Preloads a hero scene video (the video carries its own elevator audio, so no
// separate audio file is needed). Warming the cache avoids a stall on first play.
const loadVideo = (src: string): Promise<void> =>
  new Promise((resolve) => {
    fetch(src)
      .then((res) => (res.ok ? res.arrayBuffer() : undefined))
      .then(() => resolve())
      .catch(() => resolve());
  });

// Employee gallery images shown on the employees page.
const employeeImages = [
  '/assets/Severance128.jpg', // Mark
  '/assets/Severance31.jpeg', // Helly
  '/assets/Severance47.jpg',  // Irving
  '/assets/Severance52.jpg',  // Dylan
];

// Images used on the individual employee detail pages.
const detailImages = [
  // Mark
  '/assets/Mark1/Severance1.jpeg',
  '/assets/Mark2/Severance11.jpg',
  '/assets/Mark3/Severance14.jpg',
  '/assets/Mark4/Severance55.jpg',
  // Helly
  '/assets/Helly1/Severance31.jpeg',
  '/assets/Helly2/Severance23.jpg',
  '/assets/Helly3/Severance102.jpg',
  '/assets/Helly4/Severance127.jpg',
  // Irving
  '/assets/Irving1/Severance21.jpg',
  '/assets/Irving2/Severance22.jpg',
  '/assets/Irving3/Severance63.jpg',
  '/assets/Irving4/Severance74.jpg',
  // Dylan
  '/assets/Dylan1/Severance27.jpeg',
  '/assets/Dylan2/Severance22.jpg',
  '/assets/Dylan3/Severance134.avif',
  '/assets/Dylan4/Severance136.avif',
];

// About page 3D grid images (Severance1-12).
const aboutGridImages = Array.from({ length: 12 }, (_, i) => {
  const n = i + 1;
  return n <= 10
    ? `/assets/Severance${n}.jpeg`
    : `/assets/Severance${n}.jpg`;
});

// Lazy-loaded route chunks. Preloading them guarantees instant navigation.
const routeChunks: Array<{ id: string; weight: number; load: () => Promise<unknown> }> = [
  { id: 'about', weight: 6, load: () => import('../pages/AboutPage') },
  { id: 'departments', weight: 6, load: () => import('../pages/DepartmentsPage') },
  { id: 'employees', weight: 6, load: () => import('../pages/EmployeesPage') },
  { id: 'mark', weight: 5, load: () => import('../pages/MarkDetailPage') },
  { id: 'helly', weight: 5, load: () => import('../pages/HellyDetailPage') },
  { id: 'irving', weight: 5, load: () => import('../pages/IrvingDetailPage') },
  { id: 'dylan', weight: 5, load: () => import('../pages/DylanDetailPage') },
  { id: 'join-us', weight: 5, load: () => import('../pages/JoinUsPage') },
  { id: 'not-found', weight: 3, load: () => import('../pages/NotFound') },
  { id: 'typography', weight: 3, load: () => import('../components/TypographyDemo') },
];

/** Registers every resource with the shared preload manager. */
export const registerAppResources = (): void => {
  singleAssets.forEach((task) => preloadManager.register(task));
  employeeImages.forEach((src, i) =>
    preloadManager.register({ id: `employee-${i}`, weight: 2, load: () => loadImage(src) })
  );
  detailImages.forEach((src, i) =>
    preloadManager.register({ id: `detail-${i}`, weight: 3, load: () => loadImage(src) })
  );
  aboutGridImages.forEach((src, i) =>
    preloadManager.register({ id: `about-grid-${i}`, weight: 1, load: () => loadImage(src) })
  );
  routeChunks.forEach((task) => preloadManager.register(task));
};
