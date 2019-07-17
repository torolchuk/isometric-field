import { Position, MapConfig, ObjectList } from "./model";
import { Drawer } from "./drawer";
import { GameObjectResolver } from "./game-object-resolver";
import { IGameObject } from "./game-object";

export class GameMap {
  private map: any[][];
  private objects: IGameObject[][] = [];

  constructor(private config: MapConfig) {
    this.map = config.map;
  }

  public getCenterCoordinate(): Position {
    return {
      x: Math.floor(this.config.size.x / 2),
      y: Math.floor(this.config.size.y / 2)
    };
  }

  public initMap(
    resolver: GameObjectResolver
  ): { objectList: ObjectList; start: Position } {
    const objectList: ObjectList = {};
    let start: Position;
    this.map.forEach((row, x) => {
      row.forEach((item, y) => {
        if (!this.objects[x]) this.objects[x] = [];
        const [cellTag, objectName] = item.split("-");
        const object = resolver.resolveObject(cellTag);
        const pos: Position = { x, y };
        this.objects[x][y] = new object(pos);

        if (!!objectName) {
          switch (objectName) {
            case "__player":
              start = pos;
              break;
            default:
              const objectConsturtor = resolver.resolveObject(objectName);
              objectList[JSON.stringify(pos)] = new objectConsturtor(pos);
              break;
          }
        }
      });
    });

    return {
      objectList,
      start
    };
  }

  private calcLightValue(
    cameraPos: Position,
    cellPos: Position,
    viewAngle: number
  ) {
    // const distance = Math.sqrt(
    //   Math.pow(cameraPos.x - cellPos.x, 2) +
    //     Math.pow(cameraPos.y - cellPos.y, 2)
    // );

    const distance = Math.max(
      Math.abs(cameraPos.x - cellPos.x),
      Math.abs(cameraPos.y - cellPos.y)
    );

    if (distance === 0) return 0;
    const coef = Math.floor(distance);
    const res = 100 - (viewAngle * 10) / coef;
    return res;
  }

  public draw(
    drawer: Drawer,
    cameraPos: Position,
    viewAngle: number = 5,
    guests?: { [pos: string]: any }
  ) {
    const sx = Math.max(0, cameraPos.x - viewAngle);
    const fx = Math.min(this.config.size.x, viewAngle + cameraPos.x);
    const sy = Math.max(0, cameraPos.y - viewAngle);
    const fy = Math.min(this.config.size.y, viewAngle + cameraPos.y);

    // const maxValue = this.map.length - 1;
    for (let x = viewAngle * 2; x >= 0; x--) {
      for (let y = 0; y <= viewAngle * 2; y++) {
        const px = x + sx;
        const py = y + sy;

        if (px <= fx && py <= fy) {
          if (!!this.objects[px] && !!this.objects[px][py]) {
            const posJSON = JSON.stringify({ x: px, y: py });
            const obj = this.objects[px][py];
            const light: number = this.calcLightValue(
              cameraPos,
              { x: px, y: py },
              viewAngle
            );
            const drawPos: Position = {
              x: x,
              y: y
            };
            obj.draw(drawer, drawPos);
            const shadowImg = obj.shadow;

            if (!!shadowImg) {
              drawer.cell(drawPos, shadowImg, light);
            }
            if (!!guests && !!guests[posJSON]) {
              guests[posJSON].draw(drawer, drawPos);
            }
          }
        }
      }
    }
  }

  public isSolidBlock(position: Position) {
    const { x, y } = position;
    return this.objects[x][y].isSolid;
  }
}
