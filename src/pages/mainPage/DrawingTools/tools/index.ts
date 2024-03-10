import { strokeTool } from "./strokeTool";
import { ICurrentToolParams, PixelPosition } from "../../DrawingCanvas/models";
import { getFillRectXY } from "../../DrawingCanvas/prefillingTheRectangle";
import { penTool } from "./penTool";

export const preDrawPixelsOnCanvas = (
  params: ICurrentToolParams,
  way: PixelPosition[]
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
  way: PixelPosition[]
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

// export const drawCoveredPixels = (
//   params: ICurrentToolParams,
//   way: PixelIndexes[]
// ) => {
//   if (!params.matrix) return;
//   const matrix = params.matrix;
//   // const rgba = params.fillRectArgs.clickRGBA;
//   const scale = params.scale;

//   way.forEach((elem) => {
//     const pixel = matrix[elem.yIndex!][elem.xIndex!];
//     const rgba = pixel;
//     params.ctx.fillStyle = `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3]})`;

//     const coordinates = getFillRectXY(elem.xIndex!, elem.yIndex!, scale);
//     params.ctx.fillRect(coordinates.x, coordinates.y, scale, scale);
//   });
// };

export const drawingToolFunctions = { penTool, strokeTool };
