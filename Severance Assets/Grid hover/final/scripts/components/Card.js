import {
  Mesh,
  PlaneGeometry,
  Uniform,
  Vector2,
  Vector3,
} from "three";

import { AssetsId } from "../constants/AssetsId";
import { AssetsManager } from '../managers/AssetsManager';
import { CardMaterial } from "../materials/CardMaterial";
import { ExtendedObject3D } from "../utils/ExtendedObject3D";
import { Grid } from './Grid';
import { MainThree } from "../MainThree";
import { mapLinear } from "three/src/math/MathUtils.js";

export class Card extends ExtendedObject3D {
  static #_DefaultScale = new Vector3();
  static #_MaxScale = new Vector3();
  static #_Textures = [
    AssetsId.TEXTURE_1,
    AssetsId.TEXTURE_2,
    AssetsId.TEXTURE_3,
    AssetsId.TEXTURE_4,
    AssetsId.TEXTURE_5,
    AssetsId.TEXTURE_6,
    AssetsId.TEXTURE_7,
    AssetsId.TEXTURE_8,
    AssetsId.TEXTURE_9,
    AssetsId.TEXTURE_10,
  ]

  static Geometry = new PlaneGeometry(1, 1);

  #_defaultScale = new Vector3().setScalar(0.4);
  #_targetScale = new Vector3();

  #_gridPosition = new Vector3();
  #_targetPosition = new Vector3();

  mesh;
  material;
  gridPosition = new Vector2();

  constructor(i, j) {
    super();

    this.gridPosition.set(i, j);

    this.#_createMesh();
    this.#_setTargetPosition();
    this.scale.copy(this.#_defaultScale);
  }

  #_createMesh() {
    const randomIndex = Math.floor(Math.random() * Card.#_Textures.length);
    const textureId = Card.#_Textures[randomIndex];
    const texture = AssetsManager.GetAsset(textureId);

    this.material = new CardMaterial({
      uniforms: {
        uDistance: new Uniform(0),
        uTexture: new Uniform(texture),
      }
    });
    
    this.mesh = new Mesh(
      Card.Geometry,
      this.material
    );

    this.mesh.scale.copy(Card.#_DefaultScale);

    this.add(this.mesh);
  }

  #_setTargetPosition() {
    let { x, y } = this.gridPosition;

    const cardWidth = Card.#_DefaultScale.x * 0.5;
    const cardHeight = Card.#_DefaultScale.y * 0.5;

    x = mapLinear(
      x,
      0,
      Grid.COLUMNS,
      MainThree.Camera.left,
      MainThree.Camera.right
    ) + cardWidth;
    
    y =
      mapLinear(
        y,
        0,
        Grid.ROWS,
        MainThree.Camera.bottom,
        MainThree.Camera.top
      ) + cardHeight;

    this.#_gridPosition.set(x, y, 0);
  }

  static SetScale() {
    const aspect = window.innerWidth / window.innerHeight;
    const viewWidth = MainThree.Camera.right - MainThree.Camera.left;

    const columnWidth = viewWidth / Grid.COLUMNS;

    this.#_DefaultScale.x = columnWidth;
    this.#_DefaultScale.y = columnWidth * aspect;

		const isPortrait = window.innerWidth < window.innerHeight;
    const scaleFactor = isPortrait ? 2 : 4;

    this.#_MaxScale.copy(this.#_DefaultScale).multiplyScalar(scaleFactor);
  }

  resize(event) {
    this.mesh.scale.copy(Card.#_DefaultScale);
  }

  update(dt) {
    this.#_updateScale(dt);
    this.#_updatePosition(dt);
  }

  #_updatePosition(dt) {
    const distanceX = Math.abs(this.#_gridPosition.x - this.position.x);

    this.#_targetPosition.set(
      this.#_gridPosition.x,
      distanceX < 0.075 ? this.#_gridPosition.y : 0,
      this.position.z
    );

    this.position.lerp(
      this.#_targetPosition,
      1 - Math.pow(0.005 / Grid.COLUMNS, dt)
    );
  }

  #_updateScale(dt) {
    const aspect = window.innerWidth / window.innerHeight;

    const distanceX = Grid.MousePosition.x - this.position.x;
    let distanceY = Grid.MousePosition.y - this.position.y;
    distanceY /= aspect;

    let distance = Math.pow(distanceX, 2) + Math.pow(distanceY, 2);
    distance *= aspect > 1 ? 12 : 3;

    this.#_targetScale.lerpVectors(
      Card.#_DefaultScale,
      Card.#_MaxScale,
      Math.max(1 - distance, 0)
    );

    this.mesh.scale.lerp(this.#_targetScale, 1 - Math.pow(0.0002, dt));
    
    this.position.z = -distance;
    this.material.uniforms.uDistance.value = distance;
  }
}