import { addPixelsToMatrix } from ".";
import { ICurrentToolParams, IFillRectArgs } from "../../DrawingCanvas/models";
import { connectTwoPixels } from "./pixelConnector";

export const eraserTool = (params: ICurrentToolParams) => {
  const xIndex = params.xIndex;
  const yIndex = params.yIndex;
  const start = params.pointerStart;
  const ctx = params.ctx;
  const width = params.width;
  const height = params.height;
  const matrix = params.matrix;
  const drawVisibleArea = params.drawVisibleArea;
  const rowsColsValues = params.rowsColsValues;

  const rgba = { r: 0, g: 0, b: 0, a: 0 };
  const fillRectArgs: IFillRectArgs = {
    ...params.fillRectArgs,
    clickRGBA: { ...rgba },
  };

  if (params.e.type === "pointerup") {
    start.x = null;
    start.y = null;
    return;
  }

  if (start.x !== null && start.y !== null) {
    const way = connectTwoPixels(params);
    addPixelsToMatrix({ ...params, fillRectArgs }, way);
    start.x = xIndex;
    start.y = yIndex;
    drawVisibleArea(height, width, ctx, rowsColsValues, matrix, params.scale);
    return;
  }

  if (xIndex >= 0 && xIndex < width && yIndex >= 0 && yIndex < height) {
    matrix.red[xIndex + width * yIndex] = 0;
    matrix.green[xIndex + width * yIndex] = 0;
    matrix.blue[xIndex + width * yIndex] = 0;
    matrix.alpha[xIndex + width * yIndex] = 0;
  }

  drawVisibleArea(height, width, ctx, rowsColsValues, matrix, params.scale);
  start.x = xIndex;
  start.y = yIndex;
};
