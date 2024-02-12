import { DrawingCanvasMatrix, IPixel, IRGBA } from "../models";

export interface IPenToolParams {
  e: React.MouseEvent<HTMLCanvasElement, MouseEvent>;
  // matrix: DrawingCanvasMatrix;
  matrix: IPixel[][] | null;

  scale: number;
  rgba: IRGBA;
  ctx: CanvasRenderingContext2D;
}
