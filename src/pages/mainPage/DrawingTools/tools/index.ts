import { ICurrentToolParams, PixelIndexes } from "../../DrawingCanvas/models";
import { getFillRectXY } from "../../DrawingCanvas/prefillingTheRectangle";
import { penTool } from "./penTool";

export const preDrawPixelsOnCanvas = (
  params: ICurrentToolParams,
  way: PixelIndexes[]
) => {
  const rgba = params.fillRectArgs.clickRGBA;
  const scale = params.scale;

  params.ctx.fillStyle = `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3]})`;
  way.forEach((elem) => {
    const coordinates = getFillRectXY(elem.xIndex!, elem.yIndex!, scale);
    params.ctx.fillRect(coordinates.x, coordinates.y, scale, scale);
  });
};

export const addPixelsToMatrix = (
  params: ICurrentToolParams,
  way: PixelIndexes[]
) => {
  const width = params.width;
  const height = params.height;
  const rgba = params.fillRectArgs.clickRGBA;

  const clearedWay = way.filter((pixel) => {
    if (pixel.xIndex! < 0 || pixel.yIndex! < 0) return false;
    if (pixel.xIndex! >= width || pixel.yIndex! >= height) return false;
    return true;
  });

  clearedWay.forEach((pixel) => {
    params.matrix![pixel.yIndex!][pixel.xIndex!] = rgba;
  });
};

export const drawingToolFunctions = { penTool };
