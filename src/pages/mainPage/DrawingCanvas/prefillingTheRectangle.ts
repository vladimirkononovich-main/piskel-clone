import { left, top } from "./DrawingCanvas";

export const getFillRectXY = <T extends number>(
  xIndex: T,
  yIndex: T,
  scale: T
) => {
  const fillRectX = Math.min(0, left) + xIndex * scale;
  const fillRectY = Math.min(0, top) + yIndex * scale;

  return {
    x: fillRectX,
    y: fillRectY,
  };
};
