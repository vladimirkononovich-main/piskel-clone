import { addPixelsToMatrix, preDrawPixelsOnCanvas } from ".";
import { RGBA } from "../../ColorPicker/models";
import { ICurrentToolParams } from "../../DrawingCanvas/models";
import { getFillRectXY } from "../../DrawingCanvas/prefillingTheRectangle";
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
  if (!params.matrix) return;
  const prevPixel = params.firstPixelPos;

  if (params.e.type === "pointerup") {
    prevPixel.xIndex = null;
    prevPixel.yIndex = null;
    return;
  }

  const ctx = params.ctx;
  const fillRectArgs = params.fillRectArgs;
  const xIndex = params.xIndex;
  const yIndex = params.yIndex;
  const scale = params.scale;
  const matrix = params.matrix;
  const width = params.width;
  const height = params.height;
  const e = params.e;

  let transformColor: (rgba: number[]) => number[];

  if (e.buttons === 1 || e.button === 0) transformColor = lightenRGBA;
  if (e.buttons === 2 || e.button === 2) transformColor = darkenRGBA;

  if (prevPixel.xIndex !== null && prevPixel.yIndex !== null) {
    const way = connectTwoPixels(params);
    const clearedWay = way.filter((pixel) => {
      if (pixel.xIndex! < 0 || pixel.yIndex! < 0) return false;
      if (pixel.xIndex! >= width || pixel.yIndex! >= height) return false;
      return true;
    });

    clearedWay.forEach((pix) => {
      const [r, g, b, a] = matrix[pix.yIndex!][pix.xIndex!];
      if (a === 0) return;

      const newRGBA = transformColor([r, g, b, a]);
      matrix[pix.yIndex!][pix.xIndex!] = newRGBA;
      ctx.fillStyle = `rgba(${newRGBA[0]},${newRGBA[1]},${newRGBA[2]},${newRGBA[3]})`;
      
      const coordinates = getFillRectXY(pix.xIndex!, pix.yIndex!, scale);
      ctx.clearRect(coordinates.x, coordinates.y, scale, scale);
      ctx.fillRect(coordinates.x, coordinates.y, scale, scale);
    });

    prevPixel.xIndex = xIndex;
    prevPixel.yIndex = yIndex;
    return;
  }

  if (xIndex >= 0 && xIndex < width && yIndex >= 0 && yIndex < height) {
    const pixel = matrix[yIndex][xIndex];
    const [r, g, b, a] = transformColor!(pixel);
    ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
    ctx.clearRect(fillRectArgs.x, fillRectArgs.y, scale, scale);
    ctx.fillRect(fillRectArgs.x, fillRectArgs.y, scale, scale);
    matrix[yIndex][xIndex] = [r, g, b, a];
  }

  prevPixel.xIndex = xIndex;
  prevPixel.yIndex = yIndex;
};
