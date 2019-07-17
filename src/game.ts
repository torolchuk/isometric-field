import { Drawer } from "./drawer";
import { GameMap } from "./game-map";
import { GameObjectResolver } from "./game-object-resolver";
import mapConfig from "../assets/maps/default.json";
import { Position, ObjectList } from "./model";
import { Ticker } from "./ticker";
import { CursorObject } from "./objects/cursor.object";
import { GameUI } from "./game-ui";
import {
  MainState,
  MainStateManager,
  initialMainState
} from "./state/main.state-manager";
import { SetRemainingTimeAction } from "./state/main.state-actions";
import { InteractResult } from "./game-object";
import { PlayerObject } from "./objects/player.object";

const START_TICK_PERIOD = 2000;
const MINIMUM_TICK_PERIOD = 250;
const REDUCE_TICK_VALUE = 25;

export interface InitialConfig {
  tickPeriod: number;
}

export class Game {
  private run: boolean = false;
  private drawer: Drawer;
  private map: GameMap;
  private gameObjectResolver: GameObjectResolver;
  private onreadyFn: () => void;
  private cameraPos: Position;
  private player: PlayerObject;
  private ticker: Ticker;
  private cursor: CursorObject;
  private objectList: ObjectList;
  private state: MainStateManager = new MainStateManager(initialMainState);
  private gameUI: GameUI;

  constructor(
    private canvas: HTMLCanvasElement,
    private initialConfig: InitialConfig,
    objectsList: any[]
  ) {
    this.drawer = new Drawer(canvas, { x: 64, y: 16 });
    this.map = new GameMap(mapConfig);
    this.gameUI = new GameUI(this.initialConfig, {
      x: canvas.width,
      y: canvas.height
    });
    this.cameraPos = this.map.getCenterCoordinate();
    this.gameObjectResolver = new GameObjectResolver();
    this.gameObjectResolver.registerObjects(objectsList).then(() => {
      const { objectList, start } = this.map.initMap(this.gameObjectResolver);
      this.objectList = Object.assign({}, objectList);
      this.cameraPos = start;

      const playerConst = this.gameObjectResolver.resolveObject("__player");
      this.player = new playerConst();
      const cursorConst = this.gameObjectResolver.resolveObject("__cursor");
      this.cursor = new cursorConst();

      this.ticker.start();
      this.ticker.registerCallback(this.onTick, this);
      this.onreadyFn.call(null);
    });
    this.ticker = new Ticker(START_TICK_PERIOD, MINIMUM_TICK_PERIOD);

    window.addEventListener("keydown", ({ keyCode }) => {
      let newPos: Position;
      switch (keyCode) {
        case 40:
          //left
          newPos = {
            x: Math.max(0, this.cameraPos.x - 1),
            y: this.cameraPos.y
          };
          break;
        case 37:
          //top
          newPos = {
            x: this.cameraPos.x,
            y: Math.max(0, this.cameraPos.y - 1)
          };
          break;
        case 38:
          //right
          newPos = {
            x: Math.min(mapConfig.size.x - 1, this.cameraPos.x + 1),
            y: this.cameraPos.y
          };
          break;
        case 39:
          //bottom
          newPos = {
            x: this.cameraPos.x,
            y: Math.min(mapConfig.size.y - 1, this.cameraPos.y + 1)
          };
      }

      if (!!newPos && !this.map.isSolidBlock(newPos)) {
        this.cursor.setPosition(newPos);
        this.cursor.show = true;
      }
    });
  }

  public onTick() {
    this.ticker.reduce(new Date().getTime(), REDUCE_TICK_VALUE);

    if (this.cursor.show) {
      this.cameraPos = this.cursor.getPosition();
      this.cursor.reset();

      const posString = JSON.stringify(this.cameraPos);
      if (
        !!this.objectList[posString] &&
        !!this.objectList[posString]["interact"]
      ) {
        const { action, selfDestruct }: InteractResult = this.objectList[
          posString
        ]["interact"]();
        this.state.dispatch(action);
        if (!!selfDestruct) {
          this.objectList[posString] = null;
          delete this.objectList[posString];
        }
      }
    }
  }

  public onready(callback: () => void) {
    this.onreadyFn = callback;
  }

  public start() {
    this.run = true;
    requestAnimationFrame(() => this.loop());
  }

  private loop() {
    const time = new Date().getTime();
    this.drawer.clear();

    const remainTime = this.ticker.tick(time);
    this.state.dispatch(new SetRemainingTimeAction(remainTime));

    Object.keys(this.objectList).forEach(key =>
      this.objectList[key].update(time)
    );

    const visiters: ObjectList = Object.assign({}, this.objectList);
    if (this.cursor.show) {
      this.cursor.update(time);
      visiters[this.cursor.getPositionJSON()] = this.cursor;
    }
    visiters[JSON.stringify(this.cameraPos)] = this.player;
    this.map.draw(this.drawer, this.cameraPos, 3, visiters);

    if (remainTime < this.ticker.getTickerPeriod() / 2) {
      const maskAlpha = 0.5 - remainTime / this.ticker.getTickerPeriod();
      this.drawer.rect(
        { x: 0, y: 0 },
        { x: this.canvas.width, y: this.canvas.height },
        {
          fillColor: `rgba(255,255,255, ${maskAlpha})`
        }
      );
    }

    // this.drawUI(remainTime);
    this.gameUI.draw(this.state.getState(), this.drawer);

    if (this.run) requestAnimationFrame(() => this.loop());
  }
}
