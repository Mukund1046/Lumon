import "./style.css";

import { AssetsId } from "./scripts/constants/AssetsId";
import { AssetsManager } from "./scripts/managers/AssetsManager";
import { Grid } from "./scripts/components/Grid";
import { MainThree } from "./scripts/MainThree";
import { Ticker } from "./scripts/utils/Ticker";

export class Main {
  static async Init() {
    MainThree.Init();
    Ticker.Start();

    await this.#_LoadAssets();
    this.#_CreateScene();
  }

  static async #_LoadAssets() {
    AssetsManager.AddTexture(AssetsId.TEXTURE_1, "textures/img1.webp");
    AssetsManager.AddTexture(AssetsId.TEXTURE_2, "textures/img2.webp");
    AssetsManager.AddTexture(AssetsId.TEXTURE_3, "textures/img3.webp");
    AssetsManager.AddTexture(AssetsId.TEXTURE_4, "textures/img4.webp");
    AssetsManager.AddTexture(AssetsId.TEXTURE_5, "textures/img5.webp");
    AssetsManager.AddTexture(AssetsId.TEXTURE_6, "textures/img6.webp");
    AssetsManager.AddTexture(AssetsId.TEXTURE_7, "textures/img7.webp");
    AssetsManager.AddTexture(AssetsId.TEXTURE_8, "textures/img8.webp");
    AssetsManager.AddTexture(AssetsId.TEXTURE_9, "textures/img9.webp");
    AssetsManager.AddTexture(AssetsId.TEXTURE_10, "textures/img10.webp");

    await AssetsManager.Load();
  }

  static #_CreateScene() {
    MainThree.Add(new Grid());
  }
}

Main.Init();
