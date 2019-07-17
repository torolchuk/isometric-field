import { BaseCellObject } from "../base-cell.object";
import { GameObject } from "../game-object";
import { Position } from "../model";

@GameObject({
  selector: "__cursor",
  imageSrc: "../../assets/sprites/cursor.png",
  drawOpacity: 100
})
export class CursorObject extends BaseCellObject {
  private _show: boolean;
  public set show(value: boolean) {
    this._show = value;
  }
  public get show(): boolean {
    return this._show;
  }

  constructor() {
    super({ x: -1, y: -1 });
  }

  public setPosition(newPos: Position) {
    this.position = Object.assign({}, newPos);
  }

  public getPosition(): Position {
    return this.position;
  }

  reset() {
    this.show = false;
    this.position = { x: -1, y: -1 };
  }

  update(time: number) {
    this.drawOpacity = time % 300 > 200 ? 90 : 0;
  }
}
