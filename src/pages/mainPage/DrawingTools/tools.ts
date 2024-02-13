import { IPixel } from "../models";
import { IPenToolParams } from "./drawingToolsModels";

export const penTool = ({
  matrix,
  rgba,
  ctx,
  fillRectArgs,
  xWithOverflow,
  yWithOverflow,
}: IPenToolParams) => {
  if (!matrix) return;

  if (
    yWithOverflow >= matrix.length ||
    xWithOverflow >= matrix[0].length ||
    yWithOverflow < 0 ||
    xWithOverflow < 0
  )
    return;

  ctx.fillStyle = `rgba(${rgba.red},${rgba.green},${rgba.blue},${rgba.alpha})`;
  ctx.fillRect(
    fillRectArgs.x,
    fillRectArgs.y,
    fillRectArgs.width,
    fillRectArgs.height
  );

  matrix[yWithOverflow][xWithOverflow].colorRGBA = rgba;
};

export const drawingToolFunctions = { penTool };
