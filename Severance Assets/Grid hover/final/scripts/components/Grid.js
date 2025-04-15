import { Card } from './Card';
import { ExtendedObject3D } from "../utils/ExtendedObject3D";
import { Vector2 } from 'three';

export class Grid extends ExtendedObject3D {
  static COLUMNS = Math.floor(window.innerWidth / 100) | 1;
  static ROWS = Math.floor(window.innerHeight / 100) | 1;

  static MousePosition = new Vector2();
  #_targetMousePosition = new Vector2();

  constructor() {
    super();

    Card.SetScale();
    this.#_createCards();
    this.#_setListeners();
  }

  #_setListeners() {
    window.addEventListener('mousemove', this.#_updateMousePos)
    window.addEventListener('touchmove', this.#_updateMousePos)
  }

  #_createCards() {
    for(let i = 0; i < Grid.COLUMNS; i++) {
      for(let j = 0; j < Grid.ROWS; j++) {
        const card = new Card(i, j);
        this.add(card);
      }
    }
  }

  #_updateMousePos = (event) => {
    const isMobile = event.type === 'touchmove';
    
    const { clientX, clientY } = isMobile ? event.changedTouches[0] : event;

    const halfW = 0.5 * window.innerWidth;
    const halfH = 0.5 * window.innerHeight;

    // our position, normalized on a [-1, 1] range.
    const x = (clientX - halfW) / window.innerWidth * 2
    const y = -(clientY - halfH) / window.innerHeight * 2

    this.#_targetMousePosition.set(x, y)
  }

  resize() {
    Grid.COLUMNS = Math.floor(window.innerWidth / 100) | 1;
    Grid.ROWS = Math.floor(window.innerHeight / 100) | 1;
    
    Card.SetScale();
  }

  update(dt) {
    this.#_lerpMousePosition(dt);
  }

  #_lerpMousePosition(dt) {
    Grid.MousePosition.lerp(this.#_targetMousePosition, 1 - Math.pow(0.0125, dt));
  }
}