// Import necessary utilities and modules
import { preloadImages } from './utils.js'; // Imported utilities
import { Item } from './item.js'; // Imported Item module

// Variable to store the Lenis smooth scrolling object
let lenis;

// Finding elements with 'data-text' attribute which are items in your case
let items = [];
let ItemsArray = []; // Array to store items
let decoEl;
let images = [];

// Function to initialize the sliced text effect
export const initSlicedText = () => {
  console.log('Initializing sliced text effect...');
  
  // Find the container element holding background images and extracting those images
  decoEl = document.querySelector('.deco');
  if (decoEl) {
    images = [...decoEl.querySelectorAll('.deco__item')];
  }
  
  // Find elements with 'data-text' attribute
  items = [...document.querySelectorAll('[data-text]')];
  
  // Initialize smooth scrolling with Lenis
  initSmoothScrolling();
  
  // Create items and apply animations
  createItems();
  scroll();
  
  console.log('Sliced text effect initialized');
};

// Function to create items based on 'data-text' attributes
const createItems = () => {
  ItemsArray = []; // Reset the array
  
  items.forEach(item => {
    let totalCells; // Variable to store the totalCells value for an item
    const effect = item.dataset.effect; // Get the data-effect attribute of the item

    // Set different totalCells values based on the effect
    switch (effect) {
      case '1':
      case '2':
      case '3':
        totalCells = 4;
        break;
      case '4':
        totalCells = 6;
        break;
      default:
        totalCells = 6; // Default value if no effect matches
        break;
    }

    ItemsArray.push(new Item(item, totalCells)); // Creating an Item instance and storing it in ItemsArray
  });
}

// Initializes Lenis for smooth scrolling with specific properties
const initSmoothScrolling = () => {
  console.log('Initializing Lenis smooth scrolling...');
  
  // Check if Lenis is available
  if (!window.Lenis) {
    console.warn('Lenis not found, falling back to native scrolling');
    return null;
  }
  
  // Instantiate the Lenis object with specified properties
  lenis = new window.Lenis({
    lerp: 0.1, // Lower values create a smoother scroll effect
    smoothWheel: true, // Enables smooth scrolling for mouse wheel events
    wheelMultiplier: 1,
    touchMultiplier: 1,
    infinite: false
  });

  // Update ScrollTrigger each time the user scrolls
  lenis.on('scroll', () => {
    if (window.ScrollTrigger) {
      window.ScrollTrigger.update();
    }
  });

  // Define a function to run at each animation frame
  const scrollFn = (time) => {
    lenis.raf(time); // Run Lenis' requestAnimationFrame method
    requestAnimationFrame(scrollFn); // Recursively call scrollFn on each frame
  };
  
  // Start the animation frame loop
  requestAnimationFrame(scrollFn);
  
  return lenis;
};

// Functions defining different timelines/animations based on effect numbers
const fx1Timeline = item => {
  // Define animations for effectNumber 1
  const itemInner = item.DOM.inner;
  
  const initialValues = {
    x: 13
  };

  gsap.fromTo(itemInner, {
    xPercent: (pos, _, arr) => pos < arr.length/2 ? -initialValues.x*pos-initialValues.x : initialValues.x*(pos-arr.length/2)+initialValues.x,
  }, {
    ease: 'power1',
    xPercent: 0,
    scrollTrigger: {
      trigger: item.DOM.el,
      start: 'top bottom',
      end: 'top top+=10%',
      scrub: true
    }
  });
}

const fx2Timeline = item => {
  const itemInner = item.DOM.inner;
  const itemInnerWrap = item.DOM.innerWrap;

  const initialValues = {
    x: 30
  };

  gsap.timeline({
    defaults: {
      ease: 'power1'
    },
    scrollTrigger: {
      trigger: item.DOM.el,
      start: 'top bottom',
      end: 'top top+=10%',
      scrub: true
    }
  })
  .fromTo(itemInner, {
    xPercent: pos => initialValues.x*pos
  }, {
    xPercent: 0
  }, 0)
  .fromTo(itemInnerWrap, {
    xPercent: pos => 2*(pos+1)*10
  }, {
    xPercent: 0
  }, 0);
}

const fx3Timeline = item => {
  const itemInner = item.DOM.inner;
  const itemInnerWrap = item.DOM.innerWrap;
  
  const intervalPixels = 100; // pixel interval
  const totalElements = itemInnerWrap.length;
  // Calculate the total width occupied by all itemInner elements except the last one
  const totalWidth = (totalElements - 1) * intervalPixels;
  // Calculate the offset to center the elements
  const offset = (totalWidth / 2) * -1;

  const initialValues = {
    x: 30,
    y: -15,
    rotation: -5
  };

  gsap.timeline({
    defaults: {
      ease: 'power1',
    },
    scrollTrigger: {
      trigger: item.DOM.el,
      start: 'top bottom',
      end: 'top top+=10%',
      scrub: true
    }
  })
  .fromTo(itemInner, {
    xPercent: (pos, _, arr) => pos < arr.length/2 ? -initialValues.x*pos-initialValues.x : initialValues.x*(pos-arr.length/2)+initialValues.x,
    yPercent: (pos, _, arr) => pos < arr.length/2 ? initialValues.y*(arr.length/2-pos) : initialValues.y*((pos+1)-arr.length/2),
  }, {
    xPercent: 0,
    yPercent: 0
  }, 0)

  .fromTo(itemInnerWrap, {	
    xPercent: pos => {
      const distanceFromCenter = pos * intervalPixels;
      const xPercent = distanceFromCenter + offset;
      return xPercent;
    },		
    rotationZ: (pos, _, arr) => pos < arr.length/2 ? -initialValues.rotation*(arr.length/2-pos)-initialValues.rotation : initialValues.rotation*(pos-arr.length/2)+initialValues.rotation
  }, {
    xPercent: 0,
    rotationZ: 0
  }, 0);
}

const fx4Timeline = item => {
  const itemInner = item.DOM.inner;
  const itemInnerWrap = item.DOM.innerWrap;
  
  const intervalPixels = 100; // pixel interval
  const totalElements = itemInnerWrap.length;
  // Calculate the total width occupied by all itemInner elements except the last one
  const totalWidth = (totalElements - 1) * intervalPixels;
  // Calculate the offset to center the elements
  const offset = (totalWidth / 2) * -1;

  const initialValues = {
    x: 50
  };
  
  gsap.timeline({
    defaults: {
      ease: 'power1',
    },
    scrollTrigger: {
      trigger: item.DOM.el,
      start: 'top bottom+=30%',
      end: 'top top+=10%',
      scrub: true
    }
  })
  .fromTo(itemInner, {
    xPercent: (pos, _, arr) => pos < arr.length/2 ? -initialValues.x*pos-initialValues.x : initialValues.x*(pos-arr.length/2)+initialValues.x,
  }, {
    xPercent: 0,
  }, 0)
  .fromTo(itemInner, {
    scaleX: 1.5,
    scaleY: 0,
    transformOrigin: '50% 0%'
  }, {
    ease: 'power2.inOut',
    scaleX: 1,
    scaleY: 1
  }, 0)
  .fromTo(itemInnerWrap, {			
    xPercent: pos => {
      const distanceFromCenter = pos * intervalPixels;
      const xPercent = distanceFromCenter + offset;
      return xPercent;
    },
  }, {
    xPercent: 0,
    stagger: {
      amount: 0.07,
      from: 'center'
    }
  }, 0);
}

const defaultTimeline = item => {
  // Define animations for effectNumber 1
  const itemInner = item.DOM.inner;
  
  const initialValues = {
    x: 10
  };
  
  gsap.fromTo(itemInner, {
    xPercent: (pos, _, arr) => pos < arr.length/2 ? pos*-initialValues.x-initialValues.x : (pos-arr.length/2)*initialValues.x+initialValues.x,
  }, {
    ease: 'power1',
    xPercent: 0,
    scrollTrigger: {
      trigger: item.DOM.el,
      start: 'top bottom',
      end: 'top top+=10%',
      scrub: true
    }
  });
}

// Function to create animations for images triggered by scrolling
const fxImagesTimeline = () => {
  if (images.length === 0) return;
  
  images.forEach(image => {
    gsap.fromTo(image, {
      transformOrigin: '800% 50%',
      rotationZ: -8
    }, {
      ease: 'power1',
      rotationZ: 5,
      scrollTrigger: {
        trigger: image,
        start: 'top bottom',
        end: 'top top+=10%',
        scrub: true
      }
    });
  });
}

// Function to apply scroll-triggered animations to items
const scroll = () => {
  if (!window.gsap || !window.ScrollTrigger) {
    console.error('GSAP or ScrollTrigger not found');
    return;
  }

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);
  
  for (let i = 0, length = ItemsArray.length; i <= length-1; ++i ) {
    const item = ItemsArray[i];
    
    // Effect number passed in data-effect
    const effect = item.DOM.el.dataset.effect; // Get the data-effect attribute
    // Apply different timelines based on the effect number using switch statements
    switch (effect) {
      case '1':
        fx1Timeline(item);
        break;
      case '2':
        fx2Timeline(item);
        break;
      case '3':
        fx3Timeline(item);
        break;
      case '4':
        fx4Timeline(item);
        break;
      default:
        // Set a default timeline in case no matching effect is found
        defaultTimeline(item);
        break;
    }
  }
  // Apply image animations triggered by scrolling
  fxImagesTimeline();
}
