export interface IPixel {
  x: number;
  y: number;
  isFilled: boolean;
}
export interface IDrawingCanvas {
  width: number;
  height: number;
  scale: number;
  matrix: IPixel[][] | null;
}
export interface IDrawingTools {
  penSize: number;
  penSizes: number[];
}
