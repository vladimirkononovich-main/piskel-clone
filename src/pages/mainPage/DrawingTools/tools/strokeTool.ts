import { connectTwoPixels } from "./pixelConnector";
import {
  ICurrentToolParams,
  Matrix,
  PixelPosition,
} from "../../DrawingCanvas/models";
import { addPixelsToMatrix } from ".";

let prevWay: PixelPosition[] = [];

export const strokeTool = (params: ICurrentToolParams) => {
  const e = params.e;
  const xIndex = params.xIndex;
  const yIndex = params.yIndex;
  const start = params.pointerStart;
  const matrix = params.matrix;
  const height = params.height;
  const width = params.width;
  const ctx = params.ctx
  const rowsColsValues = params.rowsColsValues

  if (e.type === "pointerdown" || start.x === null || start.y === null) {
    start.x = xIndex;
    start.y = yIndex;
    prevWay = connectTwoPixels(params);
  }

  const copyRed = new Uint8ClampedArray(matrix.red);
  const copyGreen = new Uint8ClampedArray(matrix.green);
  const copyBlue = new Uint8ClampedArray(matrix.blue);
  const copyAlpha = new Uint8ClampedArray(matrix.alpha);

  const copyMatrix: Matrix = {
    red: copyRed,
    green: copyGreen,
    blue: copyBlue,
    alpha: copyAlpha,
  };

  const currWay = connectTwoPixels(params);
  addPixelsToMatrix({ ...params, matrix: copyMatrix }, currWay);
  params.drawVisibleArea(height, width, ctx, rowsColsValues, copyMatrix)

  if (e.type === "pointerup") {
    addPixelsToMatrix(params, currWay);
    start.x = null;
    start.y = null;
    return;
  }
};
