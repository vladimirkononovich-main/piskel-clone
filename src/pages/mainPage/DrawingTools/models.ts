import { DrawingCanvasMatrix, IPixel, IRGBA } from "../models";

export interface IPenToolParams {
  xIndex: number;
  yIndex: number;
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
