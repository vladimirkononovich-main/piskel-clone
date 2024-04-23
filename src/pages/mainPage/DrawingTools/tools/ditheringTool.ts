import { fillPixel } from ".";
import { ICurrentToolParams } from "../../DrawingCanvas/models";
import { connectTwoPixels } from "./pixelConnector";

export const ditheringTool = (params: ICurrentToolParams) => {
  const start = params.pointerStart;

  if (params.e.type === "pointerup") {
    start.x = null;
    start.y = null;
    return;
  }

  const xIndex = params.xIndex;
  const yIndex = params.yIndex;
  const matrix = params.matrix;
  const width = params.width;
  const height = params.height;
  const ctx = params.ctx;
  const drawVisibleArea = params.drawVisibleArea;
  const rowsColsValues = params.rowsColsValues;

  const e = params.e;
  let color1 = { ...params.fillRectArgs.colorPicker.left };
  let color2 = { ...params.fillRectArgs.colorPicker.right };

  if (e.buttons === 2 || e.button === 2) {
    color1 = { ...params.fillRectArgs.colorPicker.right };
    color2 = { ...params.fillRectArgs.colorPicker.left };
  }

  color1.a *= 255;
  color2.a *= 255;
  const { r: r1, g: g1, b: b1, a: a1 } = color1;
  const { r: r2, g: g2, b: b2, a: a2 } = color2;

  if (start.x !== null && start.y !== null) {
    const way = connectTwoPixels(params);
    const clearedWay = way.filter((pixel) => {
      if (pixel.xIndex! < 0 || pixel.yIndex! < 0) return false;
      if (pixel.xIndex! >= width || pixel.yIndex! >= height) return false;
      return true;
    });

    clearedWay.forEach((pixel) => {
      const x = pixel.xIndex!;
      const y = pixel.yIndex!;
      if (pixel.yIndex! % 2 !== 0) {
        if (pixel.xIndex! % 2 !== 0) {
          fillPixel(matrix, width, x, y, r2, g2, b2, a2);
        } else {
          fillPixel(matrix, width, x, y, r1, g1, b1, a1);
        }
      }

      if (pixel.yIndex! % 2 === 0) {
        if (pixel.xIndex! % 2 === 0) {
          fillPixel(matrix, width, x, y, r2, g2, b2, a2);
        } else {
          fillPixel(matrix, width, x, y, r1, g1, b1, a1);
        }
      }
    });

    drawVisibleArea(height, width, ctx, rowsColsValues, matrix, params.scale);
    start.x = xIndex;
    start.y = yIndex;
    return;
  }

  if (xIndex >= 0 && xIndex < width && yIndex >= 0 && yIndex < height) {
    if (yIndex! % 2 !== 0) {
      if (xIndex! % 2 !== 0) {
        fillPixel(matrix, width, xIndex!, yIndex!, r2, g2, b2, a2);
      } else {
        fillPixel(matrix, width, xIndex!, yIndex!, r1, g1, b1, a1);
      }
    }
    if (yIndex! % 2 === 0) {
      if (xIndex! % 2 === 0) {
        fillPixel(matrix, width, xIndex!, yIndex!, r2, g2, b2, a2);
      } else {
        fillPixel(matrix, width, xIndex!, yIndex!, r1, g1, b1, a1);
      }
    }
  }

  drawVisibleArea(height, width, ctx, rowsColsValues, matrix, params.scale);
  start.x = xIndex;
  start.y = yIndex;
};
