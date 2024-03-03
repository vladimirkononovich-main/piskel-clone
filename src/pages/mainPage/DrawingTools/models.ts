import { Pixel, IRGBA } from "../models";

export interface IFillRectArgs {
  x: number;
  y: number;
  clickRGBA: IRGBA;
}

export interface IPenToolParams {
  xIndex: number;
  yIndex: number;
  fillRectArgs: IFillRectArgs;
  matrix: Pixel[][] | null;
  scale: number;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
}
