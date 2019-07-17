import { Drawer } from "./drawer";
import { Position } from "./model";
import { Action, StateManager } from "./state-manager";

export interface IGameObject {
  draw(drawer: Drawer, drawPosition: Position): void;
  update(time: number): void;
  shadow?: HTMLImageElement;
  image?: HTMLImageElement;
  isSolid: boolean;
}

export interface GameObjectParams {
  selector?: string;
  imageSrc: string;
  shadowImageSrc?: string;
  isSolid?: boolean;
  drawOpacity?: number;
}

export interface GameObjectInitial {
  position: Position;
}

export interface InteractResult {
  action: Action;
  selfDestruct: boolean;
}

export interface Interactable {
  interact(): InteractResult;
}

export function GameObject(params: GameObjectParams) {
  return function(constructor: Function) {
    Object.assign(
      constructor.prototype,
      {
        isSolid: false,
        drawOpacity: 100
      },
      params,
      {
        resolveTag: constructor.name,
        setImage: (image: HTMLImageElement) => {
          constructor.prototype.image = image;
        }
      }
    );
  };
}
