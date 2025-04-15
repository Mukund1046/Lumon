// We'll use the global GSAP instance loaded in the HTML

// Detect Closest Edge
const closestEdge = (x, y, w, h) => {
  const topEdgeDist = distMetric(x, y, w/2, 0);
  const bottomEdgeDist = distMetric(x, y, w/2, h);
  const min = Math.min(topEdgeDist, bottomEdgeDist);
  return min === topEdgeDist ? 'top' : 'bottom';
};

// Distance Formula
const distMetric = (x, y, x2, y2) => {
  const xDiff = x - x2;
  const yDiff = y - y2;
  return (xDiff * xDiff) + (yDiff * yDiff);
};

// MenuItem class for handling individual menu items
class MenuItem {
  constructor(el) {
    // .mobile-menu-item element
    this.DOM = {el: el};
    // .nav-link element
    this.DOM.link = this.DOM.el.querySelector('a');
    // .marquee element
    this.DOM.marquee = this.DOM.el.querySelector('.marquee');
    // .marquee__inner-wrap element
    this.DOM.marqueeInner = this.DOM.marquee.querySelector('.marquee__inner-wrap');
    // animation defaults
    this.animationDefaults = {duration: 0.6, ease: 'expo'};
    // events initialization
    this.initEvents();
  }

  initEvents() {
    this.onTouchStartFn = () => this.touchStart();
    this.DOM.link.addEventListener('touchstart', this.onTouchStartFn);

    this.onTouchEndFn = () => this.touchEnd();
    this.DOM.link.addEventListener('touchend', this.onTouchEndFn);

    // For desktop testing
    this.onMouseEnterFn = (ev) => this.mouseEnter(ev);
    this.DOM.link.addEventListener('mouseenter', this.onMouseEnterFn);

    this.onMouseLeaveFn = (ev) => this.mouseLeave(ev);
    this.DOM.link.addEventListener('mouseleave', this.onMouseLeaveFn);
  }

  touchStart() {
    if (!window.gsap) {
      console.warn('GSAP not available for marquee effect');
      return;
    }
    window.gsap.timeline({defaults: this.animationDefaults})
      .set(this.DOM.marquee, {y: '101%'}, 0)
      .set(this.DOM.marqueeInner, {y: '-101%'}, 0)
      .to([this.DOM.marquee, this.DOM.marqueeInner], {y: '0%'}, 0);
  }

  touchEnd() {
    if (!window.gsap) return;
    window.gsap.timeline({defaults: this.animationDefaults})
      .to(this.DOM.marquee, {y: '101%'}, 0)
      .to(this.DOM.marqueeInner, {y: '-101%'}, 0);
  }

  mouseEnter(ev) {
    if (!window.gsap) return;
    // find closest side to the mouse
    const edge = this.findClosestEdge(ev);

    window.gsap.timeline({defaults: this.animationDefaults})
      .set(this.DOM.marquee, {y: edge === 'top' ? '-101%' : '101%'}, 0)
      .set(this.DOM.marqueeInner, {y: edge === 'top' ? '101%' : '-101%'}, 0)
      .to([this.DOM.marquee, this.DOM.marqueeInner], {y: '0%'}, 0);
  }

  mouseLeave(ev) {
    if (!window.gsap) return;
    // find closest side to the mouse
    const edge = this.findClosestEdge(ev);

    window.gsap.timeline({defaults: this.animationDefaults})
      .to(this.DOM.marquee, {y: edge === 'top' ? '-101%' : '101%'}, 0)
      .to(this.DOM.marqueeInner, {y: edge === 'top' ? '101%' : '-101%'}, 0);
  }

  // find closest side to the mouse when entering/leaving
  findClosestEdge(ev) {
    const x = ev.pageX - this.DOM.el.offsetLeft;
    const y = ev.pageY - this.DOM.el.offsetTop;
    return closestEdge(x, y, this.DOM.el.clientWidth, this.DOM.el.clientHeight);
  }
}

// Menu class for handling the entire menu
class Menu {
  constructor(el) {
    // .mobile-menu element
    this.DOM = {el: el};
    // the menu items
    this.DOM.menuItems = this.DOM.el.querySelectorAll('.mobile-menu-item');
    // array of MenuItem
    this.menuItems = [];
    this.DOM.menuItems.forEach(menuItem => this.menuItems.push(new MenuItem(menuItem)));
  }
}

// Initialize the marquee menu effect
export const initMarqueeMenu = () => {
  console.log('Initializing marquee menu effect');

  // Check if GSAP is loaded
  if (typeof window.gsap === 'undefined') {
    console.warn('GSAP not loaded, waiting for it to load...');

    // Wait for GSAP to load
    const checkGSAP = setInterval(() => {
      if (typeof window.gsap !== 'undefined') {
        console.log('GSAP loaded, initializing marquee menu');
        clearInterval(checkGSAP);
        initMenu();
      }
    }, 100);

    // Timeout after 3 seconds
    setTimeout(() => {
      clearInterval(checkGSAP);
      console.warn('GSAP loading timeout, trying to initialize anyway');
      initMenu();
    }, 3000);
  } else {
    console.log('GSAP already loaded, initializing marquee menu');
    initMenu();
  }

  function initMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
      console.log('Mobile menu found, initializing marquee effect');
      new Menu(mobileMenu);
    } else {
      console.warn('Mobile menu not found');
    }
  }
};
