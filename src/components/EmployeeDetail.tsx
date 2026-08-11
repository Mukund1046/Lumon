import React, { useEffect, useRef, useState } from 'react';
import Navbar from './Navbar';
import '../styles/employeeDetail.css';

export interface EmployeeFrame {
  src: string;
  alt: string;
  title: string;
  sub: string;
}

export interface EmployeeDetailConfig {
  theme: string;
  eyebrow: string;
  firstName: string;
  lastName: string;
  role: string;
  fileNo: string;
  frames: EmployeeFrame[];
}

const EmployeeDetail: React.FC<{ config: EmployeeDetailConfig }> = ({ config }) => {
  const pageRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const targetScrollRef = useRef(0);

  // One smooth, rAF-driven lerp for every input (mouse wheel, trackpad,
  // drag, touch). The wheel handler lives on the whole page so scrolling
  // works no matter where the cursor is.
  useEffect(() => {
    const el = galleryRef.current;
    const page = pageRef.current;
    if (!el || !page) return;

    let raf = 0;
    let dragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    const maxScroll = () => Math.max(0, el.scrollWidth - el.clientWidth);

    const clampTarget = () =>
      Math.max(0, Math.min(targetScrollRef.current, maxScroll()));

    const step = () => {
      const target = clampTarget();
      const cur = el.scrollLeft;
      const next = cur + (target - cur) * 0.14;
      if (Math.abs(target - cur) < 0.25) {
        el.scrollLeft = target;
        raf = 0;
      } else {
        el.scrollLeft = next;
        raf = requestAnimationFrame(step);
      }
    };

    const requestStep = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      const dx = e.deltaMode === 1 ? e.deltaX * 16 : e.deltaX;
      // Clamp immediately so surplus target never builds up at the ends —
      // otherwise reversing direction requires "paying back" the overshoot.
      targetScrollRef.current = Math.max(0, Math.min(targetScrollRef.current + dy + dx, maxScroll()));
      requestStep();
    };

    const onDown = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (target && target.closest('a, button')) return;
      dragging = true;
      startX = e.clientX;
      startScrollLeft = el.scrollLeft;
      targetScrollRef.current = startScrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      targetScrollRef.current = Math.max(0, Math.min(startScrollLeft - (e.clientX - startX), maxScroll()));
      requestStep();
    };
    const onUp = () => {
      dragging = false;
    };

    const onResize = () => {
      if (targetScrollRef.current > maxScroll()) {
        targetScrollRef.current = maxScroll();
        requestStep();
      }
    };

    page.addEventListener('wheel', onWheel, { passive: false });
    page.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    window.addEventListener('resize', onResize);

    return () => {
      page.removeEventListener('wheel', onWheel);
      page.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Keep the bottom counter in sync with the frame nearest the viewport center.
  useEffect(() => {
    const el = galleryRef.current;
    if (!el) return;

    const update = () => {
      const frames = Array.from(el.querySelectorAll<HTMLElement>('.ed-frame'));
      if (!frames.length) return;
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      frames.forEach((frame, i) => {
        const dist = Math.abs(frame.offsetLeft + frame.offsetWidth / 2 - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActiveIndex(best);
    };

    el.addEventListener('scroll', update, { passive: true });
    const timer = window.setTimeout(update, 300);
    return () => {
      el.removeEventListener('scroll', update);
      window.clearTimeout(timer);
    };
  }, [config]);

  const total = config.frames.length;

  return (
    <div className={`ed-page ${config.theme}`} ref={pageRef}>
      <Navbar />

      <div className="ed-bg" aria-hidden="true"></div>
      <div className="ed-grid" aria-hidden="true"></div>
      <div className="ed-noise" aria-hidden="true"></div>
      <div className="ed-glow" aria-hidden="true"></div>
      <div className="ed-watermark" aria-hidden="true">Lumon</div>

      <main className="ed-main">
        <header className="ed-head">
          <p className="ed-eyebrow">{config.eyebrow}</p>
          <h1 className="ed-name">
            <span className="ed-name-line">{config.firstName}</span>
            <span className="ed-name-line ed-name-line--offset">{config.lastName}</span>
          </h1>
          <p className="ed-role">
            <span className="ed-role-text">{config.role}</span>
            <span className="ed-file">FILE Nº {config.fileNo}</span>
          </p>
        </header>

        <div className="ed-gallery-wrap">
          <div className="ed-gallery" ref={galleryRef} tabIndex={0}>
            {config.frames.map((frame, i) => (
              <figure className="ed-frame" key={frame.src}>
                <div className="ed-frame-media">
                  <img src={frame.src} alt={frame.alt} className="ed-frame-img" loading="lazy" />
                  <span className="ed-frame-num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <figcaption className="ed-frame-caption">
                  <span className="ed-frame-index">{String(i + 1).padStart(2, '0')}</span>
                  <span className="ed-frame-title">{frame.title}</span>
                  <span className="ed-frame-sub">{frame.sub}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <footer className="ed-status">
          <span className="ed-status-hint">Scroll · Drag to explore</span>
          <span className="ed-status-count">
            <b className="ed-status-current">{String(activeIndex + 1).padStart(2, '0')}</b>
            <span className="ed-status-total"> / {String(total).padStart(2, '0')}</span>
          </span>
        </footer>
      </main>
    </div>
  );
};

export default EmployeeDetail;
