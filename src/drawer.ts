import { Position, Size, CanvasStyles } from "./model";

function drawCall() {
  return function(target: any, propertyKey: string, descriptor: any) {
    const method = descriptor.value;

    descriptor.value = function(...args: any[]) {
      this.context.save();
      method.apply(this, args);
      this.context.restore();
    };
  };
}

export class Drawer {
  private size: Size;
  private context: CanvasRenderingContext2D;
  constructor(private canvas: HTMLCanvasElement, private cellSize: Size) {
    this.size = {
      x: canvas.width,
      y: canvas.height
    };
    this.context = canvas.getContext("2d");
  }

  private setStyles(styleObj: CanvasStyles) {
    if (!!styleObj.fillColor) {
      this.context.fillStyle = styleObj.fillColor;
    }
  }

  private getPositionOnCellGrid(position: Position): Position {
    const { x, y } = position;
    const cx = this.cellSize.x;
    const cy = this.cellSize.y;

    const posX = (y + 1) * (cx / 2) + (x - 1) * (cx / 2);
    const posY = this.size.y / 2 - cy * 2 + y * cy - x * cy;

    return {
      x: posX,
      y: posY
    };
  }

  @drawCall()
  public clear() {
    this.context.clearRect(0, 0, this.size.x, this.size.y);
  }

  @drawCall()
  public rect(position: Position, size: Size, style: CanvasStyles) {
    this.setStyles(style);
    this.context.fillRect(position.x, position.y, size.x, size.y);
  }

  @drawCall()
  cell(
    position: Position,
    image: HTMLImageElement,
    light: number,
    spriteInstruction?: { pos: Position; size: Size }
  ) {
    const { x, y } = this.getPositionOnCellGrid(position);

    this.context.globalAlpha = Math.pow(light / 100, 8);
    if (!spriteInstruction) {
      this.context.drawImage(image, x, y);
    } else {
      let px = spriteInstruction.pos.x * spriteInstruction.size.x;
      let py = spriteInstruction.pos.y * spriteInstruction.size.y;
      let sx = spriteInstruction.size.x;
      let sy = spriteInstruction.size.x;
      this.context.drawImage(image, px, py, sx, sy, x, y, sx, sy);
    }
  }

  @drawCall()
  text(position: Position, text: string, canvasStyles: CanvasStyles) {
    const { x, y } = position;
    this.setStyles(canvasStyles);
    this.context.fillText(text, x, y);
  }
}
