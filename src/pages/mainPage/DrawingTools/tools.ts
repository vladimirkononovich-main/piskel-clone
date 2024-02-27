import { IPenToolParams } from "./models";

export const penTool = ({
  matrix,
  ctx,
  fillRectArgs,
  xIndex,
  yIndex,
  scale,
}: IPenToolParams) => {
  if (!matrix) return;

  if (
    yIndex >= matrix.length ||
    xIndex >= matrix[0].length ||
    yIndex < 0 ||
    xIndex < 0
  )
    return;

  const rgba = fillRectArgs.clickRGBA;
  ctx.fillStyle = `rgba(${rgba.red},${rgba.green},${rgba.blue},${rgba.alpha})`;
  ctx.fillRect(fillRectArgs.x, fillRectArgs.y, scale, scale);

  matrix[yIndex][xIndex].colorRGBA = rgba;
};

export const drawingToolFunctions = { penTool };
