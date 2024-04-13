import { IFillRectArgs } from "../DrawingCanvas/models";
import { Pixel } from "../models";

export interface IDrawingToolsState {
  penSize: number;
  penSizes: number[];
  currentToolName: string;
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

