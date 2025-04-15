import { ACESFilmicToneMapping, OrthographicCamera, Scene, WebGLRenderer } from "three";

import { DomElements } from "./constants/DomElements";
import { ExtendedObject3D } from "./utils/ExtendedObject3D";
import { Ticker } from "./utils/Ticker";

export class MainThree {
  static #_Scene = new Scene();

  /**  @type {HTMLElement} */
  static #_CanvasContainer;

  /**  @type {OrthographicCamera} */
  static #_Camera;

  /**  @type {WebGLRenderer} */
  static #_Renderer;

  /** * @type {Set<ExtendedObject3D>} */
  static #_ExtendedObject3D = new Set();

  // #region public methods
  static Init() {
    this.#_CreateRenderer();
    this.#_CreateCanvas();
    this.#_CreateCamera();

    window.addEventListener("resize", this.#_HandleResize);
    Ticker.Add(this.#_Update);
  }

  static Add(object3d) {
    object3d.traverse((child) => {
      if (child.isExtendedObject3D) {
        this.#_ExtendedObject3D.add(child);
      }
    });

    this.#_Scene.add(object3d);
  }

  static Remove(object3d) {
    object3d.traverse((child) => {
      if (child.isExtendedObject3D) {
        this.#_ExtendedObject3D.delete(child);
      }
    });

    this.#_Scene.remove(object3d);
  }
  // #endregion

  static #_CreateCanvas() {
    this.#_CanvasContainer = document.getElementById(
      DomElements.THREE_CONTAINER
    );
    this.#_CanvasContainer.appendChild(this.#_Renderer.domElement);
  }

  static #_CreateRenderer() {
    this.#_Renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    this.#_Renderer.toneMapping = ACESFilmicToneMapping;
    this.#_Renderer.setSize(window.innerWidth, window.innerHeight);
    this.#_Renderer.setPixelRatio(window.devicePixelRatio);
  }

  static #_CreateCamera() {
    this.#_Camera = new OrthographicCamera(-1, 1, 1, -1);
    this.#_Camera.position.z = 5;
  }

  static #_HandleResize = (event) => {
    this.#_Renderer.setSize(window.innerWidth, window.innerHeight);

    for (const object of this.#_ExtendedObject3D) {
      object.resize(event);
    }
  };

  static #_Update = (dt) => {
    this.#_Renderer.render(this.#_Scene, this.#_Camera);

    for (const object of this.#_ExtendedObject3D) {
      object.update(dt);
    }
  };

  // #region getters
  /** @returns {Scene} */
  static get Scene() {
    return this.#_Scene;
  }

  /** @returns {OrthographicCamera} */
  static get Camera() {
    return this.#_Camera;
  }

  /** @returns {WebGLRenderer} */
  static get Renderer() {
    return this.#_Camera;
  }

  /** @returns {HTMLCanvasElement} */
  static get Canvas() {
    return this.#_Renderer.domElement;
  }
  // #endregion
}