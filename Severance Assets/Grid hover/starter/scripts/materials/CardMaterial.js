import { ShaderMaterial } from "three";

export class CardMaterial extends ShaderMaterial {
  onBeforeCompile(shader) {
    shader.vertexShader = this.#_rewriteVertexShader(shader.vertexShader);
    shader.fragmentShader = this.#_rewriteFragmentShader(shader.fragmentShader);
  }

  #_rewriteVertexShader(vS) {
    return vS;
  }

  #_rewriteFragmentShader(fS) {
    return fS;
  } 
}