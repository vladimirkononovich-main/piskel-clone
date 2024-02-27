import { DrawingCanvasMatrix, IPixel, IRGBA } from "../models";

export interface IPenToolParams {
  xIndex: number;
  yIndex: number;
  fillRectArgs: {
    x: number;
    y: number;
    clickRGBA: IRGBA;
  };
  matrix: IPixel[][] | null;
  scale: number;
  ctx: CanvasRenderingContext2D;
}
