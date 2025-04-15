import { ShaderMaterial } from "three";

export class CardMaterial extends ShaderMaterial {
  onBeforeCompile(shader) {
    shader.vertexShader = this.#_rewriteVertexShader();
    shader.fragmentShader = this.#_rewriteFragmentShader();
  }

  #_rewriteVertexShader() {
    return /* glsl */`
      varying vec2 vUv;

      void main() {
        vUv = uv;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
      }
    `;
  }

  #_rewriteFragmentShader() {
    return /* glsl */ `
      uniform sampler2D uTexture;
      uniform float uDistance;
      
      varying vec2 vUv;

      vec3 getLuminance(vec3 color) {
        vec3 luminance = vec3(0.2126, 0.7152, 0.0722);
        return vec3(dot(luminance, color));
      }

      void main() {
        vec4 image = texture(uTexture, vUv);
        float distanceFactor = min(max(uDistance, 0.), 1.);

        vec3 imageLum = getLuminance(image.xyz);
        vec3 color = mix(image.xyz, imageLum, distanceFactor);

        gl_FragColor = vec4(color, 1.);
      }
    `;
  }
}
