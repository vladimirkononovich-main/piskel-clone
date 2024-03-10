import { connectTwoPixels } from "./pixelConnector";
import { ICurrentToolParams, PixelPosition } from "../../DrawingCanvas/models";
import { getFillRectXY } from "../../DrawingCanvas/prefillingTheRectangle";
import { addPixelsToMatrix, preDrawPixelsOnCanvas } from ".";

let prevWay: PixelPosition[] = [];

export const strokeTool = (params: ICurrentToolParams) => {
  const e = params.e;

  const xIndex = params.xIndex;
  const yIndex = params.yIndex;
  const firstPixel = params.firstPixelPos;
  const matrix = params.matrix!;
  const scale = params.scale;
  const height = params.height;
  const width = params.width;

  if (
    e.type === "pointerdown" ||
    firstPixel.xIndex === null ||
    firstPixel.yIndex === null
  ) {
    firstPixel.xIndex = xIndex;
    firstPixel.yIndex = yIndex;
    prevWay = connectTwoPixels(params);
  }

  prevWay.forEach((elem) => {
    if (elem.yIndex! < 0 || elem.yIndex! >= height) return;
    if (elem.xIndex! < 0 || elem.xIndex! >= width) return;

    const rgba = matrix[elem.yIndex!][elem.xIndex!];

    params.ctx.fillStyle = `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3]})`;
    const coordinates = getFillRectXY(elem.xIndex!, elem.yIndex!, scale);

    params.ctx.clearRect(coordinates.x, coordinates.y, scale, scale);
    params.ctx.fillRect(coordinates.x, coordinates.y, scale, scale);
  });

  const currWay = connectTwoPixels(params);
  preDrawPixelsOnCanvas(params, currWay);

  if (e.type === "pointerup") {
    addPixelsToMatrix(params, currWay);
    firstPixel.xIndex = null;
    firstPixel.yIndex = null;
    return
  }
  prevWay = currWay;
};
