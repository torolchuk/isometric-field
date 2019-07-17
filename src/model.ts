import { IGameObject } from "./game-object";

export interface InitGameSettings {
  canvas: HTMLCanvasElement;
  map: string;
  declarations: IGameObject[];
}

export interface CanvasSettings {
  // padding: Size;
}

export interface Position {
  x: number;
  y: number;
}

export type ObjectList = { [pos: string]: IGameObject };

export interface Size extends Position {}

export interface MapConfig {
  size: Size;
  start: Position;
  map: string[][];
}

export interface CanvasStyles {
  shadow?: {
    offset: Position;
    color: string;
    blur: number;
  };
  fillColor?: string;
  strokeColor?: string;
}
