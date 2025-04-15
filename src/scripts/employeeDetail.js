import * as THREE from 'three';
import { gsap } from 'gsap';
import { SplitText } from './vendors/gsap/SplitText';

// Register GSAP plugins
gsap.registerPlugin(SplitText);

// Vertex shader
const vertexShader = `
  varying vec2 v_uv;

  void main() {
    v_uv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader for gooey effect
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

    float progressHover = u_progressHover;
    vec2 uv = v_uv;
    vec2 uv_h = v_uv;

    vec2 st = gl_FragCoord.xy / resolution.xy - vec2(.5);
    st.y *= resolution.y / resolution.x;

    vec2 mouse = vec2((u_mouse.x / u_res.x) * 2. - 1.,-(u_mouse.y / u_res.y) * 2. + 1.) * -.5;
    mouse.y *= resolution.y / resolution.x;

    vec2 cpos = st + mouse;

    float grd = 0.1 * progressHover;

    float sqr = 100. * ((smoothstep(0., grd, uv.x) - smoothstep(1. - grd, 1., uv.x)) * (smoothstep(0., grd, uv.y) - smoothstep(1. - grd, 1., uv.y))) - 10.;

    float c = circle(cpos, .04 * progressHover + progress * 0.8, 2.) * 50.;
    float c2 = circle(cpos, .01 * progressHover + progress * 0.5, 2.);

    float offX = uv.x + sin(uv.y + time * 2.);
    float offY = uv.y - time * .2 - cos(time * 2.) * 0.1;
    float nc = (snoise(vec3(offX, offY, time * .5) * 8.)) * progressHover;
    float nh = (snoise(vec3(offX, offY, time * .5 ) * 2.)) * .1;

    c2 = smoothstep(.1, .8, c2 * 5. + nc * 3. - 1.);

    uv_h -= vec2(0.5);
    uv_h *= 1. - u_progressHover * 0.1;
    uv_h += vec2(0.5);

    uv_h *= u_hoverratio;

    uv -= vec2(0.5);
    uv *= 1. - u_progressHover * 0.2;
    uv += mouse * 0.1 * u_progressHover;
    uv *= u_ratio;
    uv += vec2(0.5);

    vec4 color = vec4(0.0314, 0.0314, 0.2235, 1.);

    vec4 image = texture2D(u_map, uv);
    vec4 hover = texture2D(u_hovermap, uv_h + vec2(nh) * progressHover * (1. - progress));
    hover = mix(hover, color * hover, .8 * (1. - progress));

    float finalMask = smoothstep(.0, .1, sqr - c);

    image = mix(image, hover, clamp(c2 + progress, 0., 1.));

    gl_FragColor = vec4(image.rgb, u_alpha * finalMask);
  }
`;

// Main class for handling the gooey hover effect
export class GooeyEffect {
  constructor() {
    this.container = document.querySelector('.employee-detail');
    this.canvas = document.getElementById('scene');
    this.tiles = document.querySelectorAll('.js-tile');
    this.slideshow = document.querySelector('.slideshow');
    this.slideshowList = document.querySelector('.slideshow-list');
    this.progressBar = document.querySelector('.slideshow__progress');
    this.detailView = document.querySelector('.detail-view');
    this.closeDetailBtn = document.querySelector('.close-detail');

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.clock = new THREE.Clock();
    this.mouse = new THREE.Vector2(0, 0);

    this.meshes = [];
    this.textures = [];
    this.hoverTextures = [];

    this.isAnimating = false;
    this.slideWidth = 0;
    this.slideshowWidth = 0;
    this.currentScroll = 0;
    this.scrollTarget = 0;
    this.scrollStrength = 0.1;

    this.init();
  }

  init() {
    this.loadTextures();
    this.setupEventListeners();
    this.calculateSizes();
    this.animate();
    this.initDetailView();
  }

  calculateSizes() {
    if (!this.slideshowList) return;

    const slides = this.slideshowList.querySelectorAll('.slideshow-list__el');
    if (slides.length === 0) return;

    // Calculate the width of each slide
    this.slideWidth = slides[0].offsetWidth;

    // Calculate the total width of the slideshow
    this.slideshowWidth = this.slideWidth * slides.length;

    // Set the width of the slideshow list
    this.slideshowList.style.width = `${this.slideshowWidth}px`;
  }

  initDetailView() {
    if (!this.detailView || !this.closeDetailBtn) return;

    // Add event listener to close detail view
    this.closeDetailBtn.addEventListener('click', () => {
      this.hideDetailView();
    });

    // Add event listeners to tiles to open detail view
    this.tiles.forEach(tile => {
      const link = tile.querySelector('a');
      if (link) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          this.showDetailView();
        });
      }
    });
  }

  showDetailView() {
    if (!this.detailView) return;

    // Add visible class to detail view
    this.detailView.classList.add('is-visible');

    // Add interactive class after a short delay
    setTimeout(() => {
      this.detailView.classList.add('is-interactive');
    }, 400);
  }

  hideDetailView() {
    if (!this.detailView) return;

    // Remove interactive class
    this.detailView.classList.remove('is-interactive');

    // Remove visible class after a short delay
    setTimeout(() => {
      this.detailView.classList.remove('is-visible');
    }, 400);
  }

  loadTextures() {
    const loader = new THREE.TextureLoader();

    this.tiles.forEach((tile, index) => {
      const img = tile.querySelector('img');
      const baseTexture = loader.load(img.src);
      const hoverTexture = loader.load(img.dataset.hover || img.src);

      baseTexture.minFilter = THREE.LinearFilter;
      hoverTexture.minFilter = THREE.LinearFilter;

      this.textures.push(baseTexture);
      this.hoverTextures.push(hoverTexture);

      this.createMesh(tile, baseTexture, hoverTexture, index);
    });
  }

  createMesh(tile, texture, hoverTexture, index) {
    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

    const uniforms = {
      u_alpha: { value: 1.0 },
      u_map: { value: texture },
      u_hovermap: { value: hoverTexture },
      u_ratio: { value: new THREE.Vector2(1.0, 1.0) },
      u_hoverratio: { value: new THREE.Vector2(1.0, 1.0) },
      u_mouse: { value: this.mouse },
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
    this.scene.add(mesh);

    this.meshes.push({
      mesh,
      uniforms,
      element: tile
    });

    this.updateMeshSize(index);
  }

  updateMeshSize(index) {
    const mesh = this.meshes[index];
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
  }

  setupEventListeners() {
    window.addEventListener('resize', this.onResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('wheel', this.onWheel.bind(this));
    window.addEventListener('touchstart', this.onTouchStart.bind(this));
    window.addEventListener('touchmove', this.onTouchMove.bind(this));

    this.tiles.forEach((tile, index) => {
      tile.addEventListener('mouseenter', () => this.onTileEnter(index));
      tile.addEventListener('mouseleave', () => this.onTileLeave(index));
    });
  }

  onWheel(e) {
    if (this.detailView && this.detailView.classList.contains('is-visible')) return;

    // Update scroll target based on wheel delta
    this.scrollTarget += e.deltaY * 0.5;

    // Clamp scroll target to slideshow width
    this.scrollTarget = Math.max(0, Math.min(this.scrollTarget, this.slideshowWidth - window.innerWidth));
  }

  onTouchStart(e) {
    if (this.detailView && this.detailView.classList.contains('is-visible')) return;

    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
    this.lastTouchX = this.touchStartX;
  }

  onTouchMove(e) {
    if (this.detailView && this.detailView.classList.contains('is-visible')) return;
    if (!this.touchStartX) return;

    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;

    // Calculate touch delta
    const deltaX = this.lastTouchX - touchX;

    // Update scroll target based on touch delta
    this.scrollTarget += deltaX * 2;

    // Clamp scroll target to slideshow width
    this.scrollTarget = Math.max(0, Math.min(this.scrollTarget, this.slideshowWidth - window.innerWidth));

    this.lastTouchX = touchX;
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.meshes.forEach((mesh, index) => {
      this.updateMeshSize(index);
      mesh.uniforms.u_res.value.set(window.innerWidth, window.innerHeight);
    });
  }

  onMouseMove(event) {
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
  }

  onTileEnter(index) {
    const mesh = this.meshes[index];
    if (!mesh) return;

    gsap.to(mesh.uniforms.u_progressHover, {
      value: 1.0,
      duration: 0.8,
      ease: 'power2.out'
    });
  }

  onTileLeave(index) {
    const mesh = this.meshes[index];
    if (!mesh) return;

    gsap.to(mesh.uniforms.u_progressHover, {
      value: 0.0,
      duration: 0.8,
      ease: 'power2.out'
    });
  }

  animate() {
    const time = this.clock.getElapsedTime();

    // Smooth scrolling
    if (this.slideshowList) {
      // Lerp the current scroll towards the target
      this.currentScroll += (this.scrollTarget - this.currentScroll) * this.scrollStrength;

      // Apply the scroll to the slideshow list
      this.slideshowList.style.transform = `translateX(${-this.currentScroll}px)`;

      // Update progress bar
      if (this.progressBar) {
        const progress = this.currentScroll / (this.slideshowWidth - window.innerWidth);
        this.progressBar.style.transform = `translateX(${progress * 100}%)`;
      }
    }

    // Update uniforms
    this.meshes.forEach(mesh => {
      mesh.uniforms.u_time.value = time;
    });

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate.bind(this));
  }


}

// Initialize the effect when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new GooeyEffect();
});
