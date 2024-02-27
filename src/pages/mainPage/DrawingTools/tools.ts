import { IPixel } from "../models";
import { IPenToolParams } from "./models";

export const penTool = ({
  matrix,
  rgba,
  ctx,
  fillRectArgs,
  xIndex,
  yIndex,
}: IPenToolParams) => {
  if (!matrix) return;
  console.log(fillRectArgs);

  if (
    yIndex >= matrix.length ||
    xIndex >= matrix[0].length ||
    yIndex < 0 ||
    xIndex < 0
  )
    return;

  ctx.fillStyle = `rgba(${rgba.red},${rgba.green},${rgba.blue},${rgba.alpha})`;
  ctx.fillRect(
    fillRectArgs.x,
    fillRectArgs.y,
    fillRectArgs.width,
    fillRectArgs.height
  );

  matrix[yIndex][xIndex].colorRGBA = rgba;
};

export const drawingToolFunctions = { penTool };
