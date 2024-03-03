import { IRGBA, Pixel } from "../models";

export interface IWheelPos {
  offSetX: number;
  offSetY: number;
}

export interface IScalingParams {
  event: React.WheelEvent<HTMLCanvasElement> | null;
  prevScale: number | null;
}

export type GetFillRectXY = (
  xIndex: number,
  yIndex: number,
  scale: number
) => {
  x: number;
  y: number;
};

export type PixelIndexes = {
  xIndex: number | null;
  yIndex: number | null;
};

export interface IFillRectArgs {
  x: number;
  y: number;
  clickRGBA: IRGBA;
}

export interface ICurrentToolParams {
  xIndex: number;
  yIndex: number;
  fillRectArgs: IFillRectArgs;
  matrix: DrawingCanvasMatrix;
  scale: number;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  prevPixelIndexes: PixelIndexes;
}

export interface IDrawingCanvasProps {
  parentRef: React.MutableRefObject<null>;
  parentCoordinates: {
    x: number;
    y: number;
    prevScale: number;
  } | null;
}

export type DrawingCanvasMatrix = Pixel[][] | null;

export interface IDrawingToolFunctions {
  penTool: (params: ICurrentToolParams) => void;
}

export interface IDrawingCanvasInitState {
  width: number;
  height: number;
  scale: number;
}