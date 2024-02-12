import { IPixel } from "../models";
import { IPenToolParams } from "./drawingToolsModels";

const colorRGBA = {
  red: "0",
  green: "0",
  blue: "0",
  alpha: "1",
};

export const penTool = ({ e, matrix, scale, rgba, ctx }: IPenToolParams) => {
  if (!matrix) return;

  const x = Math.floor(e.nativeEvent.offsetX / scale);
  const y = Math.floor(e.nativeEvent.offsetY / scale);
  if (y >= matrix.length || x >= matrix[0].length) return;
  if (y < 0 || x < 0) return;

  
  ctx.fillStyle = `rgba(${rgba.red},${rgba.green},${rgba.blue},${rgba.alpha})`;
  ctx.fillRect(x * scale, y * scale, scale, scale);

  // console.log("x", x, "y", y, matrix);

  matrix[y][x].colorRGBA = rgba;
};

export const drawingToolFunctions = { penTool };
