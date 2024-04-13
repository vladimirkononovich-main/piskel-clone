import { fillPixel } from ".";
import { ICurrentToolParams } from "../../DrawingCanvas/models";
import { connectTwoPixels } from "./pixelConnector";

const lightenRGBA = (rgba: number[]) => {
  const [r, g, b, a] = rgba;

  return [
    Math.min(255, r + 8.5),
    Math.min(255, g + 8.5),
    Math.min(255, b + 8.5),
    a,
  ];
};
const darkenRGBA = (rgba: number[]) => {
  const [r, g, b, a] = rgba;

  return [Math.max(0, r - 8.5), Math.max(0, g - 8.5), Math.max(0, b - 8.5), a];
};

export const lightenTool = (params: ICurrentToolParams) => {
  const start = params.pointerStart;
  if (params.e.type === "pointerup") {
    start.x = null;
    start.y = null;
    return;
  }

  const e = params.e;
  const ctx = params.ctx;
  const width = params.width;
  const xIndex = params.xIndex;
  const yIndex = params.yIndex;
  const matrix = params.matrix;
  const height = params.height;
  const rowsColsValues = params.rowsColsValues;
  const drawVisibleArea = params.drawVisibleArea;

  let transformColor: (rgba: number[]) => number[];

  if (e.buttons === 1 || e.button === 0) transformColor = lightenRGBA;
  if (e.buttons === 2 || e.button === 2) transformColor = darkenRGBA;

  if (start.x !== null && start.y !== null) {
    const way = connectTwoPixels(params);
    const clearedWay = way.filter((pixel) => {
      if (pixel.xIndex! < 0 || pixel.yIndex! < 0) return false;
      if (pixel.xIndex! >= width || pixel.yIndex! >= height) return false;
      return true;
    });

    clearedWay.forEach((pix) => {
      const r = matrix.red[pix.xIndex! + width * pix.yIndex!];
      const g = matrix.green[pix.xIndex! + width * pix.yIndex!];
      const b = matrix.blue[pix.xIndex! + width * pix.yIndex!];
      const a = matrix.alpha[pix.xIndex! + width * pix.yIndex!];
      if (a === 0) return;

      const [r1, g1, b1, a1] = transformColor([r, g, b, a]);
      fillPixel(matrix, width, pix.xIndex!, pix.yIndex!, r1, g1, b1, a1);
      drawVisibleArea(height, width, ctx, rowsColsValues, matrix);
    });

    start.x = xIndex;
    start.y = yIndex;
    return;
  }

  if (xIndex >= 0 && xIndex < width && yIndex >= 0 && yIndex < height) {
    const r = matrix.red[xIndex + width * yIndex];
    const g = matrix.green[xIndex + width * yIndex];
    const b = matrix.blue[xIndex + width * yIndex];
    const a = matrix.alpha[xIndex + width * yIndex];

    const [r1, g1, b1, a1] = transformColor!([r, g, b, a]);
    fillPixel(matrix, width, xIndex, yIndex, r1, g1, b1, a1);
    drawVisibleArea(height, width, ctx, rowsColsValues, matrix);
  }

  start.x = xIndex;
  start.y = yIndex;
};
