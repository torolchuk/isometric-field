import { IGameObject } from "./game-object";

export class GameObjectResolver {
  readonly objectsMap: Map<string, Function> = new Map();
  readonly assotionationMap: Map<string, string> = new Map();
  readonly imagesMap: Map<string, HTMLImageElement> = new Map();

  constructor() {}

  public async registerObjects(objectsList: Function[]) {
    for (const item of objectsList) {
      const name = item.prototype.resolveTag;
      const tag = item.prototype.selector;
      this.objectsMap.set(name, item);
      this.assotionationMap.set(tag, name);
      const imgSrc = item.prototype.imageSrc;
      const shadowSrc = item.prototype.shadowImageSrc;
      if (!!imgSrc && !this.imagesMap.has(imgSrc)) {
        const img = await this.resolveImg(imgSrc);
        this.imagesMap.set(imgSrc, img);
      }
      if (!!shadowSrc && !this.imagesMap.has(shadowSrc)) {
        const img = await this.resolveImg(shadowSrc);
        this.imagesMap.set(shadowSrc, img);
      }
    }
  }

  private async resolveImg(imgSrc: string): Promise<HTMLImageElement> {
    return new Promise(resolve => {
      const img = new Image();
      img.src = imgSrc;
      img.onload = () => {
        resolve(img);
      };
    });
  }

  public resolveObject(tag): Function {
    const selector = this.assotionationMap.get(tag);
    const obj = this.objectsMap.get(selector);
    const img = this.imagesMap.get(obj.prototype.imageSrc);
    const sImg = this.imagesMap.get(obj.prototype.shadowImageSrc);
    obj.prototype.image = img;
    obj.prototype.shadow = sImg;
    return obj;
  }
}
