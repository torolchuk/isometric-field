import { GameObject } from "../game-object";
import { BaseCellObject } from "../base-cell.object";

@GameObject({
  selector: "w",
  imageSrc: "../../assets/sprites/wall.png",
  shadowImageSrc: "../../assets/sprites/wall-shadow.png",
  isSolid: true
})
export class WallObject extends BaseCellObject {}
