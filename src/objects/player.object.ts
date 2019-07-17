import { GameObject } from "../game-object";
import { BaseCellObject } from "../base-cell.object";

@GameObject({
  selector: "__player",
  imageSrc: "../../assets/sprites/cursor.png",
  drawOpacity: 100
})
export class PlayerObject extends BaseCellObject {}
