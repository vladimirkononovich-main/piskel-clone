import { store } from "../../../store";

let matrixRed: Uint8ClampedArray;
let matrixGreen: Uint8ClampedArray;
let matrixBlue: Uint8ClampedArray;
let matrixAlpha: Uint8ClampedArray;

let prevH: number;
let prevW: number;

store.subscribe(() => {
  const { height, width } = store.getState().drawingCanvas;

  if (prevH !== height || prevW !== width) {
    matrixRed = new Uint8ClampedArray(width * height);
    matrixGreen = new Uint8ClampedArray(width * height);
    matrixBlue = new Uint8ClampedArray(width * height);
    matrixAlpha = new Uint8ClampedArray(width * height);
    prevH = height;
    prevW = width;
  }
});

export { matrixRed, matrixGreen, matrixBlue, matrixAlpha };
