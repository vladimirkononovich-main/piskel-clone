import { left, top } from "./DrawingCanvas";

export const getFillRectXY = <T extends number>(
  xIndex: T,
  yIndex: T,
  scale: T
) => {
  return {
    x: Math.min(0, left) + xIndex * scale,
    y: Math.min(0, top) + yIndex * scale,
  };
};
