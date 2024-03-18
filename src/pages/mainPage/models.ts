// export type IRGBA = number[];

export type RGBA = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type Pixel = number[];

export type DrawingCanvasMatrix = Pixel[];

export interface IParentCoordinates {
  x: number;
  y: number;
  prevScale: number;
}
