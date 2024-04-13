import { strokeTool } from "./strokeTool";
import { ICurrentToolParams, Matrix, PixelPosition } from "../../DrawingCanvas/models";
import { penTool } from "./penTool";
import { pickerTool } from "./pickerTool";
import { eraserTool } from "./eraserTool";
import { paintPixelsSameColorTool } from "./paintPixelsSameColorTool";
import { ditheringTool } from "./ditheringTool";
import { lightenTool } from "./lightenTool";
import { moveTool } from "./moveTool";

export const addPixelsToMatrix = (
  params: ICurrentToolParams,
  way: PixelPosition[]
) => {
  const width = params.width;
  const height = params.height;
  const { r, g, b, a } = params.fillRectArgs.clickRGBA;
  const alphaUINT8 = a * 255;
  const matrix = params.matrix;

  const clearedWay = way.filter((pixel) => {
    if (pixel.xIndex! < 0 || pixel.yIndex! < 0) return false;
    if (pixel.xIndex! >= width || pixel.yIndex! >= height) return false;
    return true;
  });

  clearedWay.forEach((pixel) => {
    matrix.red[pixel.xIndex! + width * pixel.yIndex!] = r;
    matrix.green[pixel.xIndex! + width * pixel.yIndex!] = g;
    matrix.blue[pixel.xIndex! + width * pixel.yIndex!] = b;
    matrix.alpha[pixel.xIndex! + width * pixel.yIndex!] = alphaUINT8;
  });

};

export const fillPixel = (
  matrix: Matrix,
  width: number,
  x: number,
  y: number,
  r: number,
  g: number,
  b: number,
  a: number
) => {
  matrix.red[x + width * y] = r;
  matrix.green[x + width * y] = g;
  matrix.blue[x + width * y] = b;
  matrix.alpha[x + width * y] = a;
};



export const drawingToolFunctions = {
  penTool,
  strokeTool,
  pickerTool,
  eraserTool,
  paintPixelsSameColorTool,
  ditheringTool,
  lightenTool,
  moveTool,
};
