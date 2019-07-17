import { GameObject, Interactable, InteractResult } from "../game-object";
import { BaseCellObject } from "../base-cell.object";
import { Drawer } from "../drawer";
import { randomLog } from "../helpers";
import { Position } from "../model";
import { IncreaseScoreAction } from "../state/main.state-actions";
import { MainState, MainStateManager } from "../state/main.state-manager";

@GameObject({
  selector: "__coin",
  imageSrc: "../../assets/sprites/coin.png"
  // shadowImageSrc: "../../assets/sprites/wall-shadow.png"
})
export class CoinObject extends BaseCellObject implements Interactable {
  private currentFrame: number;
  private animationDuration: number = 2000;
  private frameDuration: number = 500;

  constructor(position: Position) {
    super(position);
    console.log(position);
  }

  interact(): InteractResult {
    return { action: new IncreaseScoreAction(), selfDestruct: true };
  }

  draw(drawer: Drawer, position) {
    drawer.cell(position, this.image, this.drawOpacity, {
      pos: { x: this.currentFrame, y: 0 },
      size: { x: 64, y: 64 }
    });
    randomLog(0.05, `cointDrawed: ${JSON.stringify(position)}`);
  }

  update(time: number) {
    this.currentFrame = Math.floor(
      (time % this.animationDuration) / this.frameDuration
    );
  }
}
