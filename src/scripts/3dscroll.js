// 3D Scroll Effect based on Codrops 3dscroll

// Helper function to preload images
const preloadImages = (selector = 'img') => {
  return new Promise((resolve) => {
    console.log('Starting image preloading...');

    // Get all elements with background images
    const elements = document.querySelectorAll(selector);
    console.log(`Found ${elements.length} elements to preload`);

    if (elements.length === 0) {
      console.warn('No elements found for preloading, continuing anyway');
      resolve();
      return;
    }

    // Log the first few elements to debug
    for (let i = 0; i < Math.min(5, elements.length); i++) {
      const el = elements[i];
      const style = window.getComputedStyle(el);
      const bgImage = style.backgroundImage;
      console.log(`Element ${i} background image: ${bgImage}`);
    }

    if (window.imagesLoaded) {
      console.log('Using imagesLoaded library for preloading');
      imagesLoaded(elements, { background: true }, (instance) => {
        console.log(`Preloaded ${instance.images.length} images with imagesLoaded`);

        // Log success and failures
        if (instance.images.length > 0) {
          let loadedCount = 0;
          let failedCount = 0;

          instance.images.forEach(img => {
            if (img.isLoaded) {
              loadedCount++;
            } else {
              failedCount++;
              console.warn(`Failed to load image: ${img.img.src}`);
            }
          });

          console.log(`Successfully loaded: ${loadedCount}, Failed: ${failedCount}`);
        }

        resolve();
      });
    } else {
      // Fallback if imagesLoaded is not available
      console.warn('imagesLoaded library not found, using manual preloading');

      // Create an array of promises for each image
      const imagePromises = [];
      const successfulImages = [];
      const failedImages = [];

      elements.forEach((el, index) => {
        const style = window.getComputedStyle(el);
        const bgImage = style.backgroundImage;

        if (bgImage && bgImage !== 'none') {
          const imageUrl = bgImage.replace(/url\(['"]?([^'"]*)['"]/g, '$1');

          if (imageUrl) {
            const img = new Image();
            const promise = new Promise((imgResolve) => {
              img.onload = () => {
                successfulImages.push(imageUrl);
                imgResolve();
              };
              img.onerror = () => {
                failedImages.push(imageUrl);
                console.warn(`Failed to load image: ${imageUrl}`);
                imgResolve(); // Continue even if some images fail
              };
            });

            img.src = imageUrl;
            imagePromises.push(promise);
          }
        }
      });

      // Resolve when all images are loaded or after a timeout
      if (imagePromises.length > 0) {
        Promise.all(imagePromises).then(() => {
          console.log(`Manual preloading complete. Success: ${successfulImages.length}, Failed: ${failedImages.length}`);
          resolve();
        });
      } else {
        console.log('No images to preload, continuing');
        resolve();
      }
    }
  });
};

// Helper function for grid manipulation
const getGrid = (selector) => {
  let elements = gsap.utils.toArray(selector);
  let bounds;

  const getSubset = (axis, dimension, alternating, merge) => {
    let a = [];
    let subsets = {};
    let onlyEven = alternating === "even";
    let p;

    bounds.forEach((b, i) => {
      let position = Math.round(b[axis] + b[dimension] / 2);
      let subset = subsets[position];
      subset || (subsets[position] = subset = []);
      subset.push(elements[i]);
    });

    for (p in subsets) {
      a.push(subsets[p]);
    }

    if (onlyEven || alternating === "odd") {
      a = a.filter((el, i) => !(i % 2) === onlyEven);
    }

    if (merge) {
      let a2 = [];
      a.forEach(subset => a2.push(...subset));
      return a2;
    }

    return a;
  };

  elements.refresh = () => bounds = elements.map(el => el.getBoundingClientRect());
  elements.columns = (alternating, merge) => getSubset("left", "width", alternating, merge);
  elements.rows = (alternating, merge) => getSubset("top", "height", alternating, merge);
  elements.refresh();

  return elements;
};

// Function to apply scroll-triggered animations to a given grid
const applyAnimation = (grid, animationType) => {
  // Child elements of grid
  const gridWrap = grid.querySelector('.grid-wrap');
  const gridItems = grid.querySelectorAll('.grid__item');
  const gridItemsInner = [...gridItems].map(item => item.querySelector('.grid__item-inner'));

  // Define GSAP timeline with ScrollTrigger
  const timeline = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: gridWrap,
      start: 'top bottom+=5%',
      end: 'bottom top-=5%',
      scrub: true
    }
  });

  // Apply different animations based on type
  switch(animationType) {
    case 'type1':
      // Set some CSS related style values
      grid.style.setProperty('--perspective', '1000px');
      grid.style.setProperty('--grid-inner-scale', '0.5');

      timeline
      .set(gridWrap, {
        rotationY: 25
      })
      .set(gridItems, {
        z: () => gsap.utils.random(-1600, 200)
      })
      .fromTo(gridItems, {
        xPercent: () => gsap.utils.random(-1000, -500)
      }, {
        xPercent: () => gsap.utils.random(500, 1000)
      }, 0)
      .fromTo(gridItemsInner, {
        scale: 2
      }, {
        scale: .5
      }, 0);
      break;

    case 'type2':
      // Set some CSS related style values
      grid.style.setProperty('--grid-width', '160%');
      grid.style.setProperty('--perspective', '2000px');
      grid.style.setProperty('--grid-inner-scale', '0.5');
      grid.style.setProperty('--grid-item-ratio', '0.8');
      grid.style.setProperty('--grid-columns', '6');
      grid.style.setProperty('--grid-gap', '14vw');

      timeline
      .set(gridWrap, {
        rotationX: 20
      })
      .set(gridItems, {
        z: () => gsap.utils.random(-3000, -1000)
      })
      .fromTo(gridItems, {
        yPercent: () => gsap.utils.random(100, 1000),
        rotationY: -45,
        filter: 'brightness(200%)'
      }, {
        ease: 'power2',
        yPercent: () => gsap.utils.random(-1000, -100),
        rotationY: 45,
        filter: 'brightness(0%)'
      }, 0)
      .fromTo(gridWrap, {
        rotationZ: -5,
      }, {
        rotationX: -20,
        rotationZ: 10,
        scale: 1.2
      }, 0)
      .fromTo(gridItemsInner, {
        scale: 2
      }, {
        scale: 0.5
      }, 0);
      break;

    case 'type3':
      // Set some CSS related style values
      grid.style.setProperty('--grid-width', '105%');
      grid.style.setProperty('--grid-columns', '8');
      grid.style.setProperty('--perspective', '1500px');
      grid.style.setProperty('--grid-inner-scale', '0.5');

      timeline
      .set(gridItems, {
        transformOrigin: '50% 0%',
        z: () => gsap.utils.random(-5000, -2000),
        rotationX: () => gsap.utils.random(-65, -25),
        filter: 'brightness(0%)'
      })
      .to(gridItems, {
        xPercent: () => gsap.utils.random(-150, 150),
        yPercent: () => gsap.utils.random(-300, 300),
        rotationX: 0,
        filter: 'brightness(200%)'
      }, 0)
      .to(gridWrap, {
        z: 6500
      }, 0)
      .fromTo(gridItemsInner, {
        scale: 2
      }, {
        scale: 0.5
      }, 0);
      break;

    case 'type4':
      // Set some CSS related style values
      grid.style.setProperty('--grid-width', '50%');
      grid.style.setProperty('--perspective', '3000px');
      grid.style.setProperty('--grid-item-ratio', '0.8');
      grid.style.setProperty('--grid-columns', '3');
      grid.style.setProperty('--grid-gap', '1vw');

      timeline
      .set(gridWrap, {
        transformOrigin: '0% 50%',
        rotationY: 30,
        xPercent: -75
      })
      .set(gridItems, {
        transformOrigin: '50% 0%'
      })
      .to(gridItems, {
        duration: 0.5,
        ease: 'power2',
        z: 500,
        stagger: 0.04
      }, 0)
      .to(gridItems, {
        duration: 0.5,
        ease: 'power2.in',
        z: 0,
        stagger: 0.04
      }, 0.5)
      .fromTo(gridItems, {
        rotationX: -70,
        filter: 'brightness(120%)'
      }, {
        duration: 1,
        rotationX: 70,
        filter: 'brightness(0%)',
        stagger: 0.04
      }, 0);
      break;

    case 'type5':
      // Set some CSS related style values
      grid.style.setProperty('--grid-width', '120%');
      grid.style.setProperty('--grid-columns', '8');
      grid.style.setProperty('--grid-gap', '0');

      const gridObj = getGrid(gridItems);

      timeline
      .set(gridWrap, {
        rotationX: 50
      })
      .to(gridWrap, {
        rotationX: 30
      })
      .fromTo(gridItems, {
        filter: 'brightness(0%)'
      }, {
        filter: 'brightness(100%)'
      }, 0)
      .to(gridObj.rows('even'), {
        xPercent: -100,
        ease: 'power1'
      }, 0)
      .to(gridObj.rows('odd'), {
        xPercent: 100,
        ease: 'power1'
      }, 0)
      .addLabel('rowsEnd', '>-=0.15')
      .to(gridItems, {
        ease: 'power1',
        yPercent: () => gsap.utils.random(-100, 200),
      }, 'rowsEnd');
      break;

    case 'type6':
      // Set some CSS related style values
      grid.style.setProperty('--perspective', '2500px');
      grid.style.setProperty('--grid-width', '100%');
      grid.style.setProperty('--grid-gap', '6');
      grid.style.setProperty('--grid-columns', '3');
      grid.style.setProperty('--grid-item-ratio', '1');

      timeline
      .fromTo(gridItems, {
        transformOrigin: '50% 200%',
        rotationX: 0,
        yPercent: 400,
      }, {
        yPercent: 0,
        rotationY: 360,
        opacity: 0.2,
        scale: 0.8,
        stagger: 0.03,
      });
      break;

    default:
      console.error('Unknown animation type.');
      break;
  }
};

// Function to initialize Lenis for smooth scrolling
const initSmoothScrolling = () => {
  console.log('Initializing Lenis smooth scrolling...');

  // Check if Lenis is available
  if (!window.Lenis) {
    console.warn('Lenis not found, falling back to native scrolling');
    return null;
  }

  // Instantiate the Lenis object with specified properties
  const lenis = new window.Lenis({
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

// Initialize the 3D scroll effect
export const init3DScroll = () => {
  console.log('Initializing 3D scroll effect...');

  // Check if GSAP and ScrollTrigger are available
  if (!window.gsap) {
    console.error('GSAP not found');
    return;
  }

  if (!window.ScrollTrigger) {
    console.error('ScrollTrigger not found');
    return;
  }

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);
  console.log('ScrollTrigger registered');

  // Initialize smooth scrolling with Lenis
  const lenis = initSmoothScrolling();

  // All elements with class .grid
  const grids = document.querySelectorAll('.grid');
  console.log(`Found ${grids.length} grid elements`);

  if (grids.length === 0) {
    console.warn('No grid elements found');
    return;
  }

  // Check if grid items exist
  const gridItems = document.querySelectorAll('.grid__item');
  console.log(`Found ${gridItems.length} grid items`);

  if (gridItems.length === 0) {
    console.warn('No grid items found');
  }

  // Check if grid item inners exist
  const gridItemsInner = document.querySelectorAll('.grid__item-inner');
  console.log(`Found ${gridItemsInner.length} grid item inners`);

  if (gridItemsInner.length === 0) {
    console.warn('No grid item inners found');
  }

  // Preload images then initialize animations
  preloadImages('.grid__item-inner').then(() => {
    // Apply animations to each grid
    grids.forEach((grid, i) => {
      // Determine animation type based on grid class
      let animationType;
      if (grid.classList.contains('grid--1')) animationType = 'type1';
      else if (grid.classList.contains('grid--2')) animationType = 'type2';
      else if (grid.classList.contains('grid--3')) animationType = 'type3';
      else if (grid.classList.contains('grid--4')) animationType = 'type4';
      else if (grid.classList.contains('grid--5')) animationType = 'type5';
      else if (grid.classList.contains('grid--6')) animationType = 'type6';
      else animationType = `type${(i % 6) + 1}`; // Fallback

      applyAnimation(grid, animationType);
    });
  });
};
