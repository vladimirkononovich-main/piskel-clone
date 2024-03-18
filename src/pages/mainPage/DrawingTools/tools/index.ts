import { strokeTool } from "./strokeTool";
import { ICurrentToolParams, PixelPosition } from "../../DrawingCanvas/models";
import { getFillRectXY } from "../../DrawingCanvas/prefillingTheRectangle";
import { penTool } from "./penTool";
import { pickerTool } from "./pickerTool";

export const preDrawPixelsOnCanvas = (
  params: ICurrentToolParams,
  way: PixelPosition[]
) => {
  const { r, g, b, a } = params.fillRectArgs.clickRGBA;
  const scale = params.scale;

  params.ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
  way.forEach((elem) => {
    const coordinates = getFillRectXY(elem.xIndex!, elem.yIndex!, scale);
    params.ctx.clearRect(coordinates.x, coordinates.y, scale, scale);
    params.ctx.fillRect(coordinates.x, coordinates.y, scale, scale);
  });
};

export const addPixelsToMatrix = (
  params: ICurrentToolParams,
  way: PixelPosition[]
) => {
  const width = params.width;
  const height = params.height;
  const { r, g, b, a } = params.fillRectArgs.clickRGBA;
  const alphaUINT8 = a * 255;

  const clearedWay = way.filter((pixel) => {
    if (pixel.xIndex! < 0 || pixel.yIndex! < 0) return false;
    if (pixel.xIndex! >= width || pixel.yIndex! >= height) return false;
    return true;
  });

  clearedWay.forEach((pixel) => {
    params.matrix![pixel.yIndex!][pixel.xIndex!] = [r, g, b, alphaUINT8];
  });
};

export const drawingToolFunctions = { penTool, strokeTool, pickerTool };
