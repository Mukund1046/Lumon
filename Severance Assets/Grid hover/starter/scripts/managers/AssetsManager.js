import { TextureLoader } from "../loaders/TextureLoader";

const ASSETS_TYPE = {
  TEXTURE: 'TEXTURE',
}

export class AssetsManager {
  static #_AssetsQueue = [];
  static #_Assets = new Map();

  /**
   * @param {AssetsId} id
   * @param {string} path
   * @returns {any}
  */
  static AddTexture(id, path) {
    this.#_AssetsQueue.push({
      id,
      path,
      type: ASSETS_TYPE.TEXTURE
    })  
  }

  static GetAsset(id) {
    return this.#_Assets.get(id);
  }

  static async Load() {
    let promises = this.#_AssetsQueue
      .map(async ({ id, path, type }) => {
        let asset = undefined;

        switch(type) {
          case ASSETS_TYPE.TEXTURE:
            asset = await TextureLoader.Load(path);
            this.#_Assets.set(id, asset);
            break;
          default:
            console.error(`Assets type: ${type} not recognized and ignored by AssetsManager.js`)
            break;
        }
      });

    await Promise.all(promises)
  }
}