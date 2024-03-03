
export type IRGBA = number[]

export type Pixel = number[]

export type DrawingCanvasMatrix = Pixel[];

export interface IDrawingTools {
  penSize: number;
  penSizes: number[];
  currentToolName: string;
  colorRGBALeftClick: IRGBA;
  colorRGBARightClick: IRGBA;
}

export interface IParentCoordinates {
  x: number;
  y: number;
  prevScale: number;
}
