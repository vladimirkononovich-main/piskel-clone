import { addPixelsToMatrix, preDrawPixelsOnCanvas } from ".";
import { ICurrentToolParams } from "../../DrawingCanvas/models";
import { connectTwoPixels } from "./pixelConnector";

export const penTool = (params: ICurrentToolParams) => {
  if (!params.matrix) return;
  const prevPixel = params.firstPixelPos;

  if (params.e.type === "pointerup") {
    prevPixel.xIndex = null;
    prevPixel.yIndex = null;
    return;
  }

  const { r, g, b, a } = params.fillRectArgs.clickRGBA;
  const alphaUINT8 = a * 255
  const ctx = params.ctx;
  const fillRectArgs = params.fillRectArgs;
  const xIndex = params.xIndex;
  const yIndex = params.yIndex;
  const scale = params.scale;
  const matrix = params.matrix;
  const width = params.width;
  const height = params.height;

  if (prevPixel.xIndex !== null && prevPixel.yIndex !== null) {
    const way = connectTwoPixels(params);
    preDrawPixelsOnCanvas(params, way);
    addPixelsToMatrix(params, way);

    prevPixel.xIndex = xIndex;
    prevPixel.yIndex = yIndex;

    return;
  }

  ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
  ctx.clearRect(fillRectArgs.x, fillRectArgs.y, scale, scale);
  ctx.fillRect(fillRectArgs.x, fillRectArgs.y, scale, scale);

  if (xIndex >= 0 && xIndex < width && yIndex >= 0 && yIndex < height) {
    matrix[yIndex][xIndex] = [r, g, b, alphaUINT8];
  }

  prevPixel.xIndex = xIndex;
  prevPixel.yIndex = yIndex;
};
