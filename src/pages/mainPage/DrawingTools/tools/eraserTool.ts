import { addPixelsToMatrix, preDrawPixelsOnCanvas } from ".";
import { ICurrentToolParams, IFillRectArgs } from "../../DrawingCanvas/models";
import { connectTwoPixels } from "./pixelConnector";

export const eraserTool = (params: ICurrentToolParams) => {
  if (!params.matrix) return;
  const xIndex = params.xIndex;
  const yIndex = params.yIndex;
  const prevPixel = params.firstPixelPos;
  const ctx = params.ctx;
  const scale = params.scale;
  const width = params.width;
  const height = params.height;

  const rgba = { r: 0, g: 0, b: 0, a: 0 };
  const fillRectArgs: IFillRectArgs = {
    ...params.fillRectArgs,
    clickRGBA: { ...rgba },
  };

  if (params.e.type === "pointerup") {
    prevPixel.xIndex = null;
    prevPixel.yIndex = null;
    return;
  }

  if (prevPixel.xIndex !== null && prevPixel.yIndex !== null) {
    const way = connectTwoPixels(params);
    preDrawPixelsOnCanvas({ ...params, fillRectArgs }, way);
    addPixelsToMatrix({ ...params, fillRectArgs }, way);

    prevPixel.xIndex = xIndex;
    prevPixel.yIndex = yIndex;

    return;
  }

  ctx.fillStyle = `rgba(${0},${0},${0},${0})`;
  ctx.clearRect(fillRectArgs.x, fillRectArgs.y, scale, scale);
  ctx.fillRect(fillRectArgs.x, fillRectArgs.y, scale, scale);

  if (xIndex >= 0 && xIndex < width && yIndex >= 0 && yIndex < height) {
    params.matrix[yIndex][xIndex] = [0, 0, 0, 0];
  }

  prevPixel.xIndex = xIndex;
  prevPixel.yIndex = yIndex;
};
