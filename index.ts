import { Game } from "./src/game";
import { WallObject } from "./src/objects/wall.object";
import { FloorObject } from "./src/objects/floor.object";
import { CursorObject } from "./src/objects/cursor.object";
import { PlayerObject } from "./src/objects/player.object";
import { CoinObject } from "./src/objects/coin.object";
import { HoleObject } from "./src/objects/hole.object";

const canvas: HTMLCanvasElement = document.querySelector("#canvas");

const game = new Game(canvas, { tickPeriod: 2000 }, [
  WallObject,
  FloorObject,
  PlayerObject,
  CursorObject,
  CoinObject,
  HoleObject
]);
game.onready(() => game.start());
