import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { AppDispatch } from "../../../store";
import { ColorParams } from "../ColorPicker/models";
import { Pixel, RGBA } from "../models";

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
};

export interface IFillRectArgs {
  clickRGBA: RGBA;
  colorPicker: {
    left: ColorParams;
    right: ColorParams;
  };
}

export type ActionColorParams = ActionCreatorWithPayload<
  ColorParams,
  "colorPicker/setLeftColorParams" | "colorPicker/setRightColorParams"
>;

export type Matrix = {
  red: Uint8ClampedArray;
  green: Uint8ClampedArray;
  blue: Uint8ClampedArray;
  alpha: Uint8ClampedArray;
};

export interface ICurrentToolParams {
  e: React.PointerEvent<HTMLCanvasElement>;
  xIndex: number;
  yIndex: number;
  fillRectArgs: IFillRectArgs;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  dispatch: AppDispatch;
  setColorParams: ActionColorParams;
  allPresetColors: ColorParams[];
  currPreset: ColorParams[];
  pointerStart: {
    x: number | null;
    y: number | null;
  };
  matrix: Matrix;
  rowsColsValues: RowsColsValues;
  scale: number;
  drawVisibleArea: (
    height: number,
    width: number,
    ctx: CanvasRenderingContext2D,
    rowsColsValues: RowsColsValues,
    matrix: Matrix,
    scale: number
  ) => void;
}

export type DrawingCanvasMatrix = Pixel[][] | null;

export interface IDrawingToolFunctions {
  penTool: (params: ICurrentToolParams) => void;
}

export interface IDrawingCanvasInitState {
  width: number;
  height: number;
  scale: number;
  prevScale: number;
  scalingSteps: number[];
  canvasPosition: CanvasPosition
}

export type CanvasPosition = {
  top: number;
  left: number;
  bot: number;
  right: number;
};
export type RowsColsValues = {
  [key: string]: {
    rows: Uint16Array;
    cols: Uint16Array;
  };
};

export type CenteringParams = {
  canvasEvent: string | React.WheelEvent<HTMLCanvasElement> | null;
  scaledH: number;
  scaledW: number;
  parentW: number;
  parentH: number;
  prevScaledW: number;
  prevScaledH: number;
  position: CanvasPosition;
  prevScale: number;
  scale: number;
  rowsColsValues: RowsColsValues | null;
  height: number;
  width: number;
  visibleH: number;
  visibleW: number;
};

export type CalcIntervalsCoords = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  remainderTop: number;
  remainderLeft: number;
};


