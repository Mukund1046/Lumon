
/**
 * Preload Manager
 *
 * Tracks real background resource loading (fonts, images, audio, scripts and
 * lazy route chunks) and reports honest 0-100 progress in real time. The
 * loading screen is driven by this manager instead of a fake continuous
 * count-up, so the numbers only move when an actual item finishes loading.
 */

export interface PreloadTask {
  id: string;
  weight: number;
  load: () => Promise<unknown>;
}

type ProgressListener = (progress: number) => void;

class PreloadManager {
  private tasks: PreloadTask[] = [];
  private totalWeight = 0;
  private completedWeight = 0;
  private started = false;
  private listeners = new Set<ProgressListener>();
  private _progress = 0;
  private forceTimer: number | null = null;

  get progress(): number {
    return this._progress;
  }

  register(task: PreloadTask): void {
    if (this.started) return;
    this.tasks.push(task);
    this.totalWeight += task.weight;
  }

  subscribe(listener: ProgressListener): () => void {
    this.listeners.add(listener);
    listener(this._progress);
    return () => {
      this.listeners.delete(listener);
    };
  }

  start(): void {
    if (this.started) return;
    this.started = true;

    // Safety net so the loader can never hang forever even if a resource
    // stalls or the page is already fully cached.
    this.forceTimer = window.setTimeout(() => this.forceComplete(), 20000);

    this.tasks.forEach((task) => {
      Promise.resolve()
        .then(task.load)
        .catch(() => undefined)
        .finally(() => {
          this.completedWeight += task.weight;
          this.update();
        });
    });
  }

  forceComplete(): void {
    this.completedWeight = this.totalWeight;
    this.update();
  }

  private update(): void {
    const next =
      this.totalWeight === 0
        ? 100
        : Math.min(100, Math.round((this.completedWeight / this.totalWeight) * 100));

    if (next === this._progress) return;

    this._progress = next;
    this.listeners.forEach((listener) => listener(next));

    if (next >= 100 && this.forceTimer !== null) {
      window.clearTimeout(this.forceTimer);
      this.forceTimer = null;
    }
  }
}

export const preloadManager = new PreloadManager();

/** Loads an image and resolves regardless of success/failure. */
export const loadImage = (src: string): Promise<void> =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });

/** Preloads an audio file's data and resolves regardless of success/failure. */
export const loadAudio = (src: string): Promise<void> =>
  new Promise((resolve) => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = src;
    const done = () => resolve();
    audio.addEventListener('loadeddata', done, { once: true });
    audio.addEventListener('error', done, { once: true });
  });

/** Injects a script tag and resolves when it has loaded (or failed). */
export const loadScript = (src: string): Promise<void> =>
  new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });

/** Resolves when all declared webfonts are ready. */
export const loadFonts = (): Promise<unknown> =>
  document.fonts?.ready ?? Promise.resolve();
