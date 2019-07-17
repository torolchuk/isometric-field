import { GameObject } from "../game-object";
import { BaseCellObject } from "../base-cell.object";

@GameObject({
  selector: "f",
  imageSrc: "../../assets/sprites/floor.png",
  shadowImageSrc: "../../assets/sprites/floor-shadow.png",
  isSolid: false
})
export class FloorObject extends BaseCellObject {}
