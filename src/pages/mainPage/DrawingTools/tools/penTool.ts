import { addPixelsToMatrix } from ".";
import { ICurrentToolParams } from "../../DrawingCanvas/models";
import { connectTwoPixels } from "./pixelConnector";

export const penTool = (params: ICurrentToolParams) => {
  const start = params.pointerStart;
  if (params.e.type === "pointerup") {
    start.x = null;
    start.y = null;
    return;
  }

  const { r, g, b, a } = params.fillRectArgs.clickRGBA;
  const alphaUINT8 = a * 255;
  const ctx = params.ctx;
  const xIndex = params.xIndex;
  const yIndex = params.yIndex;
  const width = params.width;
  const height = params.height;
  const matrix = params.matrix;
  const rowsColsValues = params.rowsColsValues;
  const drawVisibleArea = params.drawVisibleArea;

  if (start.x !== null && start.y !== null) {
    const way = connectTwoPixels(params);
    addPixelsToMatrix(params, way);
    start.x = xIndex;
    start.y = yIndex;
    drawVisibleArea(height, width, ctx, rowsColsValues, matrix);
    return;
  }

  if (xIndex >= 0 && xIndex < width && yIndex >= 0 && yIndex < height) {
    matrix.red[xIndex! + width * yIndex!] = r;
    matrix.green[xIndex! + width * yIndex!] = g;
    matrix.blue[xIndex! + width * yIndex!] = b;
    matrix.alpha[xIndex! + width * yIndex!] = alphaUINT8;
  }

  drawVisibleArea(height, width, ctx, rowsColsValues, matrix);
  start.x = xIndex;
  start.y = yIndex;
};
