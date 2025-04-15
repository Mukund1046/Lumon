import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLenisScroll } from '../hooks/useLenisScroll';
import Navbar from '../components/Navbar';

import '../styles/employeeDetail.css';
import '../styles/employeeDetailMobile.css';
import * as THREE from 'three';
import { gsap } from 'gsap';

const MarkDetailPage: React.FC = () => {
  // Initialize Lenis smooth scrolling
  const lenisRef = useLenisScroll({
    lerp: 0.1,
    smoothWheel: true,
    wheelMultiplier: 0.8,
    touchMultiplier: 1,
    infinite: false
  });

  // Refs for DOM elements
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideshowRef = useRef<HTMLDivElement>(null);
  const slideshowListRef = useRef<HTMLUListElement>(null);
  const progressBarRef = useRef<HTMLSpanElement>(null);
  const detailViewRef = useRef<HTMLElement>(null);
  const closeDetailBtnRef = useRef<HTMLButtonElement>(null);
  const tilesRef = useRef<HTMLElement[]>([]);

  // State for WebGL effect
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
  const meshesRef = useRef<any[]>([]);
  const texturesRef = useRef<THREE.Texture[]>([]);
  const hoverTexturesRef = useRef<THREE.Texture[]>([]);

  // State for scrolling
  const isAnimatingRef = useRef<boolean>(false);
  const slideWidthRef = useRef<number>(0);
  const slideshowWidthRef = useRef<number>(0);
  const currentScrollRef = useRef<number>(0);
  const scrollTargetRef = useRef<number>(0);
  const scrollStrengthRef = useRef<number>(0.1);

  // Mobile-specific refs
  const touchStartXRef = useRef<number>(0);
  const touchScrollIndicatorRef = useRef<HTMLDivElement>(null);
  const isMobileRef = useRef<boolean>(window.innerWidth <= 768);

  // Vertex shader
  const vertexShader = `
    varying vec2 v_uv;

    void main() {
      v_uv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  // Fragment shader - Enhanced Gooey Effect
  const fragmentShader = `
    #define PI 3.14159265359
    #define PR 1.0

    uniform sampler2D u_map;
    uniform sampler2D u_hovermap;

    uniform float u_alpha;
    uniform float u_time;
    uniform float u_progressHover;
    uniform float u_progressClick;

    uniform vec2 u_res;
    uniform vec2 u_mouse;
    uniform vec2 u_ratio;
    uniform vec2 u_hoverratio;

    varying vec2 v_uv;

    float circle(in vec2 _st, in float _radius, in float blurriness){
        vec2 dist = _st;
        return 1. - smoothstep(_radius-(_radius*blurriness), _radius+(_radius*blurriness), dot(dist,dist)*4.0);
    }

    // Simplex noise function
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

      // First corner
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);

      // Other corners
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);

      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;

      // Permutations
      i = mod289(i);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));

      // Gradients: 7x7 points over a square, mapped onto an octahedron.
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);

      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);

      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);

      // Normalise gradients
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

      // Mix final noise value
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
      vec2 resolution = u_res * PR;
      float time = u_time * 0.05;
      float progress = u_progressClick;

      // Enhanced hover progress for stronger effect
      float progressHover = u_progressHover * 1.5;
      vec2 uv = v_uv;
      vec2 uv_h = v_uv;

      vec2 st = gl_FragCoord.xy / resolution.xy - vec2(.5);
      st.y *= resolution.y / resolution.x;

      vec2 mouse = vec2((u_mouse.x / u_res.x) * 2. - 1.,-(u_mouse.y / u_res.y) * 2. + 1.) * -.5;
      mouse.y *= resolution.y / resolution.x;

      vec2 cpos = st + mouse;

      // Enhanced gooey effect parameters
      float grd = 0.15 * progressHover; // Increased from 0.1 to 0.15

      float sqr = 100. * ((smoothstep(0., grd, uv.x) - smoothstep(1. - grd, 1., uv.x)) * (smoothstep(0., grd, uv.y) - smoothstep(1. - grd, 1., uv.y))) - 10.;

      // Larger circle radius for more pronounced effect
      float c = circle(cpos, .08 * progressHover + progress * 0.8, 2.) * 50.; // Increased from .04 to .08
      float c2 = circle(cpos, .03 * progressHover + progress * 0.5, 2.); // Increased from .01 to .03

      // More dynamic noise
      float offX = uv.x + sin(uv.y + time * 3.); // Increased time multiplier from 2 to 3
      float offY = uv.y - time * .3 - cos(time * 3.) * 0.15; // Increased movement
      float nc = (snoise(vec3(offX, offY, time * .7) * 8.)) * progressHover * 1.5; // Increased noise influence
      float nh = (snoise(vec3(offX, offY, time * .7) * 2.)) * .2; // Increased from .1 to .2

      // Enhanced smoothstep for more dramatic transition
      c2 = smoothstep(.05, .9, c2 * 5. + nc * 4. - 1.); // Adjusted parameters for stronger effect

      // Enhanced distortion for hover image
      uv_h -= vec2(0.5);
      uv_h *= 1. - u_progressHover * 0.2; // Increased from 0.1 to 0.2
      uv_h += vec2(0.5);

      uv_h *= u_hoverratio;

      // Enhanced distortion for base image
      uv -= vec2(0.5);
      uv *= 1. - u_progressHover * 0.3; // Increased from 0.2 to 0.3
      uv += mouse * 0.2 * u_progressHover; // Increased mouse influence from 0.1 to 0.2
      uv *= u_ratio;
      uv += vec2(0.5);

      // Base color with more saturation
      vec4 color = vec4(0.0314, 0.0314, 0.2235, 1.);

      vec4 image = texture2D(u_map, uv);
      vec4 hover = texture2D(u_hovermap, uv_h + vec2(nh) * progressHover * (1. - progress) * 1.5); // Enhanced distortion
      hover = mix(hover, color * hover, .7 * (1. - progress)); // Changed from .8 to .7 for less color tinting

      float finalMask = smoothstep(.0, .15, sqr - c); // Increased edge smoothness from .1 to .15

      // Enhanced mixing between images
      image = mix(image, hover, clamp(c2 + progress, 0., 1.));

      gl_FragColor = vec4(image.rgb, u_alpha * finalMask);
    }
  `;

  useEffect(() => {
    // Initialize WebGL
    initWebGL();

    // Initialize event listeners
    setupEventListeners();

    // Calculate sizes
    calculateSizes();

    // Initialize detail view
    initDetailView();

    // Start animation loop
    animate();

    // Cleanup on unmount - Enhanced for proper event handling
    return () => {
      // Dispose WebGL renderer
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }

      // Remove window event listeners
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);

      // Remove tile event listeners
      if (tilesRef.current.length && window.tileEnterHandlers && window.tileLeaveHandlers) {
        tilesRef.current.forEach((tile, index) => {
          const link = tile.querySelector('a');
          if (link) {
            const enterHandler = window.tileEnterHandlers[index];
            const leaveHandler = window.tileLeaveHandlers[index];

            if (enterHandler) link.removeEventListener('mouseenter', enterHandler);
            if (leaveHandler) link.removeEventListener('mouseleave', leaveHandler);
          }
        });
      }
    };
  }, []);

  // Initialize WebGL
  const initWebGL = () => {
    if (!canvasRef.current) return;

    // Create scene
    sceneRef.current = new THREE.Scene();

    // Create camera
    cameraRef.current = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraRef.current.position.z = 5;

    // Create renderer
    rendererRef.current = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create clock
    clockRef.current = new THREE.Clock();

    // Load textures
    loadTextures();
  };

  // Load textures
  const loadTextures = () => {
    // Wait for DOM to be ready
    setTimeout(() => {
      if (!slideshowListRef.current) return;

      // Get all tiles from the DOM
      const tiles = slideshowListRef.current.querySelectorAll('.js-tile');
      if (tiles.length === 0) return;

      // Update tilesRef with the actual DOM elements
      tilesRef.current = Array.from(tiles) as HTMLElement[];

      const loader = new THREE.TextureLoader();

      tilesRef.current.forEach((tile, index) => {
        const img = tile.querySelector('img');
        if (!img) return;

        const baseTexture = loader.load(img.src);
        const hoverTexture = loader.load(img.dataset.hover || img.src);

        baseTexture.minFilter = THREE.LinearFilter;
        hoverTexture.minFilter = THREE.LinearFilter;

        texturesRef.current.push(baseTexture);
        hoverTexturesRef.current.push(hoverTexture);

        createMesh(tile, baseTexture, hoverTexture, index);
      });

      // Re-setup event listeners for the tiles
      setupEventListeners();
    }, 100); // Small delay to ensure DOM is ready
  };

  // Create mesh
  const createMesh = (tile: HTMLElement, texture: THREE.Texture, hoverTexture: THREE.Texture, index: number) => {
    if (!sceneRef.current) return;

    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

    const uniforms = {
      u_alpha: { value: 1.0 },
      u_map: { value: texture },
      u_hovermap: { value: hoverTexture },
      u_ratio: { value: new THREE.Vector2(1.0, 1.0) },
      u_hoverratio: { value: new THREE.Vector2(1.0, 1.0) },
      u_mouse: { value: mouseRef.current },
      u_progressHover: { value: 0.0 },
      u_progressClick: { value: 0.0 },
      u_time: { value: 0.0 },
      u_res: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    };

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    sceneRef.current.add(mesh);

    // Store mesh with additional properties for hover effect
    meshesRef.current.push({
      mesh,
      uniforms,
      element: tile,
      isHovering: false // Add isHovering flag for proper gooey effect
    });

    updateMeshSize(index);
  };

  // Update mesh size
  const updateMeshSize = (index: number) => {
    const mesh = meshesRef.current[index];
    if (!mesh) return;

    const { width, height, left, top } = mesh.element.getBoundingClientRect();

    mesh.mesh.scale.set(width, height, 1);
    mesh.mesh.position.x = left - window.innerWidth / 2 + width / 2;
    mesh.mesh.position.y = -top + window.innerHeight / 2 - height / 2;

    // Update texture ratio
    const imageAspect = 1; // Assuming square images for simplicity
    const meshAspect = width / height;

    let ratio;
    if (meshAspect > imageAspect) {
      ratio = new THREE.Vector2(1.0, meshAspect / imageAspect);
    } else {
      ratio = new THREE.Vector2(imageAspect / meshAspect, 1.0);
    }

    mesh.uniforms.u_ratio.value.copy(ratio);
    mesh.uniforms.u_hoverratio.value.copy(ratio);
  };

  // Setup event listeners - Fixed for proper gooey effect
  const setupEventListeners = () => {
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('wheel', handleWheel);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);

    // Add event listeners to tiles
    if (tilesRef.current.length) {
      // Store event handler references to properly remove them later
      const enterHandlers = [];
      const leaveHandlers = [];

      tilesRef.current.forEach((tile, index) => {
        // Create bound event handlers that we can reference later
        const enterHandler = () => handleTileEnter(index);
        const leaveHandler = () => handleTileLeave(index);

        // Store handlers for this index
        enterHandlers[index] = enterHandler;
        leaveHandlers[index] = leaveHandler;

        // Add event listeners to the link inside the tile
        const link = tile.querySelector('a');
        if (link) {
          // Add the event listeners
          link.addEventListener('mouseenter', enterHandler);
          link.addEventListener('mouseleave', leaveHandler);

          // Initialize mesh isHovering property
          if (meshesRef.current[index]) {
            meshesRef.current[index].isHovering = false;
          }
        }
      });

      // Store handlers for cleanup
      window.tileEnterHandlers = enterHandlers;
      window.tileLeaveHandlers = leaveHandlers;
    }
  };

  // Calculate sizes
  const calculateSizes = () => {
    if (!slideshowListRef.current) return;

    const slides = slideshowListRef.current.querySelectorAll('.slideshow-list__el');
    if (slides.length === 0) return;

    // Calculate the width of each slide
    slideWidthRef.current = slides[0].getBoundingClientRect().width;

    // Calculate the total width of the slideshow
    slideshowWidthRef.current = slideWidthRef.current * slides.length;
  };

  // Initialize detail view - removed functionality
  const initDetailView = () => {
    // Detail view functionality removed
    if (tilesRef.current.length) {
      tilesRef.current.forEach(tile => {
        const link = tile.querySelector('a');
        if (link) {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            // Detail view functionality removed
          });
        }
      });
    }
  };

  // Handle resize
  const handleResize = () => {
    if (!cameraRef.current || !rendererRef.current) return;

    // Update camera
    cameraRef.current.aspect = window.innerWidth / window.innerHeight;
    cameraRef.current.updateProjectionMatrix();

    // Update renderer
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);

    // Update mesh sizes
    meshesRef.current.forEach((mesh, index) => {
      updateMeshSize(index);
      mesh.uniforms.u_res.value.set(window.innerWidth, window.innerHeight);
    });

    // Recalculate sizes
    calculateSizes();

    // Update mobile detection
    isMobileRef.current = window.innerWidth <= 768;

    // Show touch scroll indicator on mobile devices
    if (isMobileRef.current && touchScrollIndicatorRef.current) {
      showTouchScrollIndicator();
    }
  };

  // Show touch scroll indicator for mobile users
  const showTouchScrollIndicator = () => {
    if (!touchScrollIndicatorRef.current) return;

    touchScrollIndicatorRef.current.classList.add('visible', 'animate');

    // Hide after 3 seconds
    setTimeout(() => {
      if (touchScrollIndicatorRef.current) {
        touchScrollIndicatorRef.current.classList.remove('visible', 'animate');
      }
    }, 3000);
  };

  // Handle mouse move
  const handleMouseMove = (event: MouseEvent) => {
    mouseRef.current.x = event.clientX;
    mouseRef.current.y = event.clientY;
  };

  // Handle wheel
  const handleWheel = (event: WheelEvent) => {
    // Update scroll target based on wheel delta
    scrollTargetRef.current += event.deltaY * 0.5;

    // Clamp scroll target to slideshow width
    scrollTargetRef.current = Math.max(0, Math.min(scrollTargetRef.current, slideshowWidthRef.current - window.innerWidth));
  };

  // Handle touch start
  const handleTouchStart = (event: TouchEvent) => {
    if (event.touches.length === 1) {
      // Store the initial touch position
      touchStartXRef.current = event.touches[0].clientX;
      mouseRef.current.x = touchStartXRef.current;
      mouseRef.current.y = event.touches[0].clientY;

      // Show touch scroll indicator on first touch for mobile users
      if (isMobileRef.current && touchScrollIndicatorRef.current) {
        showTouchScrollIndicator();
      }
    }
  };

  // Handle touch move
  const handleTouchMove = (event: TouchEvent) => {
    if (event.touches.length === 1) {
      const touchX = event.touches[0].clientX;
      const touchY = event.touches[0].clientY;

      // Calculate touch delta with improved sensitivity for mobile
      const deltaX = touchX - mouseRef.current.x;
      const sensitivity = isMobileRef.current ? 2.5 : 2.0;

      // Update scroll target based on touch delta
      scrollTargetRef.current -= deltaX * sensitivity;

      // Clamp scroll target to slideshow width
      scrollTargetRef.current = Math.max(0, Math.min(scrollTargetRef.current, slideshowWidthRef.current - window.innerWidth));

      // Update mouse position for WebGL effects
      mouseRef.current.x = touchX;
      mouseRef.current.y = touchY;

      // Prevent default to avoid page scrolling on mobile
      if (isMobileRef.current && Math.abs(deltaX) > 5) {
        event.preventDefault();
      }
    }
  };

  // Handle tile enter - Fixed for proper gooey effect
  const handleTileEnter = (index: number) => {
    const mesh = meshesRef.current[index];
    if (!mesh) return;

    // Set isHovering flag
    mesh.isHovering = true;

    // Apply hover effect with proper animation timing
    gsap.to(mesh.uniforms.u_progressHover, {
      value: 1.0,
      duration: 0.8,
      ease: 'power2.inOut'
    });

    // Animate the link text color
    const link = tilesRef.current[index]?.querySelector('a');
    if (link) {
      gsap.to(link.querySelector('.tile__title'), {
        color: '#ffffff',
        duration: 0.3
      });
    }

    // Change background color based on index (optional)
    document.documentElement.style.setProperty('--color-bg', `var(--color-bg${index + 1 || 1})`);
    document.documentElement.style.setProperty('--color-text', `var(--color-text${index + 1 || 1})`);
  };

  // Handle tile leave - Fixed for proper gooey effect
  const handleTileLeave = (index: number) => {
    const mesh = meshesRef.current[index];
    if (!mesh) return;

    // Remove hover effect with proper animation timing
    gsap.to(mesh.uniforms.u_progressHover, {
      value: 0.0,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        // Reset isHovering flag when animation completes
        if (mesh) mesh.isHovering = false;
      }
    });

    // Reset the link text color
    const link = tilesRef.current[index]?.querySelector('a');
    if (link) {
      gsap.to(link.querySelector('.tile__title'), {
        color: '',
        duration: 0.3
      });
    }

    // Reset background color (optional)
    document.documentElement.style.setProperty('--color-bg', 'var(--color-bg)');
    document.documentElement.style.setProperty('--color-text', 'var(--color-text)');
  };

  // Animation loop - Enhanced for proper gooey effect
  const animate = () => {
    if (!clockRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    const time = clockRef.current.getElapsedTime();

    // Smooth scrolling
    if (slideshowListRef.current) {
      // Lerp the current scroll towards the target
      currentScrollRef.current += (scrollTargetRef.current - currentScrollRef.current) * scrollStrengthRef.current;

      // Apply the scroll to the slideshow list
      slideshowListRef.current.style.transform = `translateX(${-currentScrollRef.current}px)`;

      // Update progress bar
      if (progressBarRef.current) {
        const progress = currentScrollRef.current / (slideshowWidthRef.current - window.innerWidth);
        progressBarRef.current.style.transform = `translateX(${progress * 100}%)`;
      }
    }

    // Calculate scroll delta for mesh animation
    const delta = Math.abs((currentScrollRef.current - scrollTargetRef.current) * 0.01);

    // Update uniforms and mesh positions
    meshesRef.current.forEach((mesh, index) => {
      // Update time uniform for all meshes
      mesh.uniforms.u_time.value = time;

      // Update mouse position in uniforms
      mesh.uniforms.u_mouse.value.copy(mouseRef.current);

      // Only update time for hovering meshes (important for gooey effect)
      if (mesh.isHovering) {
        // This ensures the shader animation only runs when hovering
        mesh.uniforms.u_time.value += clockRef.current.getDelta();
      }

      // Update mesh position based on scroll
      updateMeshSize(index);
    });

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    requestAnimationFrame(animate);
  };

  return (
    <div className="w-full h-full overflow-hidden bg-wardrobe-dark mark-theme">
      <Navbar />

      <div className="employee-detail mark-theme" ref={containerRef}>
        {/* Background elements */}
        <div className="employee-detail__bg"></div>
        <div className="employee-detail__grid"></div>
        <div className="employee-detail__noise"></div>

        {/* Canvas for WebGL effect */}
        <canvas id="scene" ref={canvasRef}></canvas>

        {/* Page title */}
        <h1 className="page-title | title">
          Mark Scout <span className="slideshow__title__offset | title__offset">MDR Team Lead</span>
        </h1>

        {/* Content */}
        <section className="content | scrollarea-ctn">
          <div className="scrollarea | slideshow" ref={slideshowRef}>
            <ul className="slideshow-list" ref={slideshowListRef}>
              <li className="slideshow-list__el">
                <article className="tile | js-tile" ref={(el) => { if (el) tilesRef.current[0] = el; }}>
                  <a href="#">
                    <figure className="tile__fig">
                      <img
                        src="/assets/Mark1/Severance1.jpeg"
                        data-hover="/assets/Mark2/Severance7.jpeg"
                        alt="Mark Scout"
                        className="tile__img"
                      />
                    </figure>
                    <div className="tile__content">
                      <h2 className="tile__title | title title--medium">Mark <span className="title__offset title__offset--medium">Scout</span></h2>

                    </div>
                  </a>
                </article>
              </li>

              <li className="slideshow-list__el">
                <article className="tile | js-tile" ref={(el) => { if (el) tilesRef.current[1] = el; }}>
                  <a href="#">
                    <figure className="tile__fig">
                      <img
                        src="/assets/Mark2/Severance11.jpg"
                        data-hover="/assets/Mark3/Severance14.jpg"
                        alt="Mark Scout"
                        className="tile__img"
                      />
                    </figure>
                    <div className="tile__content">
                      <h2 className="tile__title | title title--medium">MDR <span className="title__offset title__offset--medium">Team Lead</span></h2>

                    </div>
                  </a>
                </article>
              </li>

              <li className="slideshow-list__el">
                <article className="tile | js-tile" ref={(el) => { if (el) tilesRef.current[2] = el; }}>
                  <a href="#">
                    <figure className="tile__fig">
                      <img
                        src="/assets/Mark3/Severance14.jpg"
                        data-hover="/assets/Mark4/Severance55.jpg"
                        alt="Mark Scout"
                        className="tile__img"
                      />
                    </figure>
                    <div className="tile__content">
                      <h2 className="tile__title | title title--medium">Lumon <span className="title__offset title__offset--medium">Industries</span></h2>

                    </div>
                  </a>
                </article>
              </li>

              <li className="slideshow-list__el">
                <article className="tile | js-tile" ref={(el) => { if (el) tilesRef.current[3] = el; }}>
                  <a href="#">
                    <figure className="tile__fig">
                      <img
                        src="/assets/Mark4/Severance55.jpg"
                        data-hover="/assets/Mark1/Severance1.jpeg"
                        alt="Mark Scout"
                        className="tile__img"
                      />
                    </figure>
                    <div className="tile__content">
                      <h2 className="tile__title | title title--medium">Severed <span className="title__offset title__offset--medium">Employee</span></h2>

                    </div>
                  </a>
                </article>
              </li>
            </ul>
          </div>
          <div className="slideshow__progress-ctn"><span className="slideshow__progress" ref={progressBarRef}></span></div>

          {/* Touch scroll indicator for mobile */}
          <div className="touch-scroll-indicator" ref={touchScrollIndicatorRef}>
            Swipe to explore
          </div>
        </section>


      </div>

    </div>
  );
};

export default MarkDetailPage;
