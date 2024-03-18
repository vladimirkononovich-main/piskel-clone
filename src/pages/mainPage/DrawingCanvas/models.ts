import {  Pixel, RGBA } from "../models";

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

export type PixelPosition = {
  xIndex: number | null;
  yIndex: number | null;
}

export interface IFillRectArgs {
  x: number;
  y: number;
  clickRGBA: RGBA;
}

export interface ICurrentToolParams {
  e: React.PointerEvent<HTMLCanvasElement>;
  xIndex: number;
  yIndex: number;
  fillRectArgs: IFillRectArgs;
  matrix: DrawingCanvasMatrix;
  scale: number;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  firstPixelPos: PixelPosition;
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
