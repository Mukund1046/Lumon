// Improved Bulge Effect for Hero Background based on Codrops implementation
class BulgeEffect {
  constructor(options = {}) {
    this.canvas = options.canvas;
    this.image = options.image;
    this.strength = options.strength || 1.5;
    this.radius = options.radius || 0.6;

    // Initialize state
    this.mouse = { x: 0.5, y: 0.5 };
    this.mouseTarget = { x: 0.5, y: 0.5 };
    this.bulgeAmount = 0;
    this.isActive = false;

    // Initialize WebGL
    this.init();
  }

  init() {
    // Create WebGL context
    this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');

    if (!this.gl) {
      console.error('WebGL not supported');
      return;
    }

    // Set canvas size
    this.resize();

    // Create shaders
    this.createShaders();

    // Load texture
    this.loadTexture();

    // Set up events
    this.setupEvents();

    // Start animation
    this.animate();
  }

  createShaders() {
    // Vertex shader - simple pass-through
    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;

      varying vec2 v_texCoord;

      void main() {
        gl_Position = vec4(a_position, 0, 1);
        v_texCoord = a_texCoord;
      }
    `;

    // Fragment shader - implements the bulge effect
    const fragmentShaderSource = `
      precision highp float;

      uniform sampler2D u_image;
      uniform vec2 u_mouse;
      uniform float u_radius;
      uniform float u_strength;
      uniform float u_bulge;

      varying vec2 v_texCoord;

      vec2 bulge(vec2 uv, vec2 center) {
        // Vector from center to current position
        vec2 dir = uv - center;

        // Distance from center (normalized by radius)
        float dist = length(dir) / u_radius;

        // Apply exponential falloff for smoother transition
        float distPow = pow(dist, 4.0);

        // Calculate strength based on distance
        float strengthAmount = u_strength / (1.0 + distPow);

        // Apply bulge effect - scale the position vector
        // When u_bulge is 0, no effect; when 1, full effect
        uv = center + dir * ((1.0 - u_bulge) + u_bulge * strengthAmount);

        // Ensure coordinates are within bounds
        uv = clamp(uv, 0.0, 1.0);

        return uv;
      }

      void main() {
        // Apply bulge effect to texture coordinates (already includes clamping)
        vec2 bulgeUV = bulge(v_texCoord, u_mouse);

        // Sample the texture at the distorted position
        vec4 color = texture2D(u_image, bulgeUV);

        gl_FragColor = color;
      }
    `;

    // Create and compile shaders
    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);

    // Create program
    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error('Unable to initialize the shader program:', this.gl.getProgramInfoLog(this.program));
      return;
    }

    // Look up attribute locations
    this.positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
    this.texCoordLocation = this.gl.getAttribLocation(this.program, 'a_texCoord');

    // Look up uniform locations
    this.imageLocation = this.gl.getUniformLocation(this.program, 'u_image');
    this.mouseLocation = this.gl.getUniformLocation(this.program, 'u_mouse');
    this.radiusLocation = this.gl.getUniformLocation(this.program, 'u_radius');
    this.strengthLocation = this.gl.getUniformLocation(this.program, 'u_strength');
    this.bulgeLocation = this.gl.getUniformLocation(this.program, 'u_bulge');

    // Create buffers
    this.createBuffers();
  }

  createShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('An error occurred compiling the shaders:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  createBuffers() {
    // Create position buffer
    this.positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

    // Triangle that covers the entire canvas
    const positions = [
      -1, -1,
      1, -1,
      -1, 1,
      -1, 1,
      1, -1,
      1, 1
    ];

    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);

    // Create texture coordinate buffer
    this.texCoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);

    // WebGL texture coordinates with Y flipped to fix the inversion
    const texCoords = [
      0, 1,  // bottom-left
      1, 1,  // bottom-right
      0, 0,  // top-left
      0, 0,  // top-left
      1, 1,  // bottom-right
      1, 0   // top-right
    ];

    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(texCoords), this.gl.STATIC_DRAW);
  }

  loadTexture() {
    this.texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

    // Set texture parameters
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

    // Load image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = this.image;

    img.onload = () => {
      // Create a canvas to flip the image if needed
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      // Draw the image normally (no flipping needed with our texture coordinates)
      ctx.drawImage(img, 0, 0);

      // Use the canvas as the texture source
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, canvas);

      console.log('Image loaded successfully:', img.width, 'x', img.height);

      // Initial render
      this.render();

      // Add a subtle initial animation
      setTimeout(() => {
        this.animateBulge(0.5);
        setTimeout(() => {
          this.animateBulge(0);
        }, 1000);
      }, 500);
    };

    img.onerror = (err) => {
      console.error('Error loading image:', err);
    };
  }

  setupEvents() {
    window.addEventListener('resize', this.resize.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
    this.canvas.addEventListener('mouseleave', this.handleMouseLeave.bind(this));

    // Touch events
    this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
    this.canvas.addEventListener('touchstart', this.handleMouseEnter.bind(this));
    this.canvas.addEventListener('touchend', this.handleMouseLeave.bind(this));
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = (e.clientX - rect.left) / this.canvas.width;
    this.mouse.y = 1.0 - (e.clientY - rect.top) / this.canvas.height; // Flip Y to match our flipped texture coordinates

    // If not active, activate on mouse move
    if (!this.isActive) {
      this.isActive = true;
      this.animateBulge(1.0);
    }
  }

  handleTouchMove(e) {
    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = (e.touches[0].clientX - rect.left) / this.canvas.width;
    this.mouse.y = 1.0 - (e.touches[0].clientY - rect.top) / this.canvas.height; // Flip Y to match our flipped texture coordinates
  }

  handleMouseEnter() {
    console.log('Mouse enter');
    this.isActive = true;
    this.animateBulge(1.0);
  }

  handleMouseLeave() {
    console.log('Mouse leave');
    this.isActive = false;
    this.animateBulge(0.0);
  }

  animateBulge(target) {
    console.log('Animating bulge to:', target);
    const duration = 800; // 0.8 seconds
    const start = this.bulgeAmount;
    const startTime = performance.now();

    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out expo for smoother animation
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      this.bulgeAmount = start + (target - start) * eased;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  resize() {
    const displayWidth = this.canvas.clientWidth;
    const displayHeight = this.canvas.clientHeight;

    if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
      this.canvas.width = displayWidth;
      this.canvas.height = displayHeight;
      this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    }
  }

  animate() {
    this.render();
    requestAnimationFrame(this.animate.bind(this));
  }

  render() {
    if (!this.gl) return;

    // Interpolate mouse position for smoother movement
    this.mouseTarget.x += (this.mouse.x - this.mouseTarget.x) * 0.05; // Slower for smoother effect
    this.mouseTarget.y += (this.mouse.y - this.mouseTarget.y) * 0.05;

    // Clear the canvas
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    // Use our program
    this.gl.useProgram(this.program);

    // Set up position attribute
    this.gl.enableVertexAttribArray(this.positionLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);

    // Set up texture coordinate attribute
    this.gl.enableVertexAttribArray(this.texCoordLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer);
    this.gl.vertexAttribPointer(this.texCoordLocation, 2, this.gl.FLOAT, false, 0, 0);

    // Set uniforms
    this.gl.uniform1i(this.imageLocation, 0);
    this.gl.uniform2f(this.mouseLocation, this.mouseTarget.x, this.mouseTarget.y);
    this.gl.uniform1f(this.radiusLocation, this.radius);
    this.gl.uniform1f(this.strengthLocation, this.strength);
    this.gl.uniform1f(this.bulgeLocation, this.bulgeAmount);

    // Bind texture
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

    // Draw
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }
}

// Export the BulgeEffect class
window.BulgeEffect = BulgeEffect;
