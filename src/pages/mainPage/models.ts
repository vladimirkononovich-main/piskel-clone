export interface IRGBA {
  red: string;
  green: string;
  blue: string;
  alpha: string;
}
export interface IPixel {
  colorRGBA: IRGBA;
}
export type DrawingCanvasMatrix = IPixel[];

export interface IDrawingCanvas {
  width: number;
  height: number;
  scale: number;
  matrix: DrawingCanvasMatrix | null;
}

export interface IDrawingTools {
  penSize: number;
  penSizes: number[];
  currentToolName: string;
  colorRGBALeftClick: IRGBA;
  colorRGBARightClick: IRGBA;
}

export interface IDrawingToolFunctions {
  penTool: (matrix: DrawingCanvasMatrix) => DrawingCanvasMatrix;
}

export interface IParentCoordinates {
  x: number;
  y: number;
  prevScale: number;
}
