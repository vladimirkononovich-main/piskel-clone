import { DrawingCanvasMatrix, IPixel, IRGBA } from "../models";

export interface IPenToolParams {
  xWithOverflow: number;
  yWithOverflow: number;
  fillRectArgs: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  matrix: IPixel[][] | null;
  scale: number;
  rgba: IRGBA;
  ctx: CanvasRenderingContext2D;
}
