import { store } from "../../../store";
import { Matrix } from "../DrawingCanvas/models";

const { height, width } = store.getState().drawingCanvas;

export const createNewFrame = (width: number, height: number): Matrix => {
  return {
    red: new Uint8ClampedArray(width * height),
    green: new Uint8ClampedArray(width * height),
    blue: new Uint8ClampedArray(width * height),
    alpha: new Uint8ClampedArray(width * height),
  };
};


export const defaultFrame = createNewFrame(width, height);
export const frames: Matrix[] = [defaultFrame];
