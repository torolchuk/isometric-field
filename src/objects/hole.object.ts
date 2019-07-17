import { BaseCellObject } from "../base-cell.object";
import { GameObject } from "../game-object";

@GameObject({
  selector: "h",
  imageSrc: "../../assets/sprites/coin.png"
})
export class HoleObject extends BaseCellObject {}
