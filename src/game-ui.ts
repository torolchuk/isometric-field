import { Drawer } from "./drawer";
import { MainState } from "./state/main.state-manager";
import { InitialConfig } from "./game";
import { Size } from "./model";

export class GameUI {
  constructor(private config: InitialConfig, private canvasSize: Size) {}

  public draw(state: MainState, drawer: Drawer): void {
    this.remainingTime(state.remainTime, drawer);
    this.score(state.score, drawer);
  }

  private remainingTime(remainingTime: number, drawer: Drawer) {
    const width =
      (Math.ceil(((remainingTime / this.config.tickPeriod) * 100) / 9) *
        9 *
        360) /
      100;
    drawer.rect(
      {
        x: this.canvasSize.x / 2 - 100,
        y: this.canvasSize.y - 40
      },
      {
        x: 200,
        y: 10
      },
      {
        fillColor: "rgba(0,0,0, .7)"
      }
    );

    drawer.rect(
      {
        x: this.canvasSize.x / 2 - width / 2,
        y: this.canvasSize.y - 38
      },
      {
        x: width,
        y: 6
      },
      {
        fillColor: "#fff"
      }
    );
  }

  private score(score: number, drawer: Drawer) {
    drawer.text({ x: 20, y: 20 }, `Score: ${score}`, {});
  }
}
