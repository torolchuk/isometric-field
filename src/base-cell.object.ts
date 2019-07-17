import { IGameObject } from "./game-object";
import { Drawer } from "./drawer";
import { Position } from "./model";

export abstract class BaseCellObject implements IGameObject {
  protected drawOpacity: number;

  public image;
  public readonly isSolid;

  constructor(protected position: Position) {}

  draw(drawer: Drawer, drawPosition: Position) {
    drawer.cell(drawPosition, this.image, this.drawOpacity);
  }

  public getPositionJSON() {
    return JSON.stringify(this.position);
  }

  tick() {}

  update(time: number) {}
}
