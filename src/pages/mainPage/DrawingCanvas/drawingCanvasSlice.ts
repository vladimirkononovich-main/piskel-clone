import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IDrawingCanvasInitState } from "./models";

const scalingSteps = [
  1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.71, 1.82, 1.94, 2.07, 2.21, 2.36, 2.51,
  2.68, 2.86, 3.05, 3.25, 3.47, 3.7, 3.95, 4.21, 4.49, 4.79, 5.11, 5.45, 5.82,
  6.2, 6.62, 7.06, 7.53, 8.03, 8.57, 9.14, 9.75, 10.4, 11.09, 11.83, 12.62,
  13.46, 14.36, 15.32, 16.34, 17.43, 18.59, 19.83, 21.15, 22.56, 24.06, 25.67,
  27.38, 29.2, 31.15, 33.23, 35.44, 37.8, 40.32, 43.01, 45.88, 48.94, 52.2,
  55.68, 59.39, 63.35, 67.57, 72.08, 76.89, 82.01, 87.48, 89.5,
];

const initialState: IDrawingCanvasInitState = {
  width: 100  ,
  height: 100,
  scale: scalingSteps[30],
  prevScale: scalingSteps[30],
  scalingSteps,
};

export const drawingCanvasSlice = createSlice({
  name: "drawingCanvas",
  initialState,
  reducers: {
    setScale: (state, action: PayloadAction<number>) => {
      state.scale = action.payload;
    },
    setPrevScale: (state, action: PayloadAction<number>) => {
      state.prevScale = action.payload;
    },
  },
});

export const { setScale, setPrevScale } = drawingCanvasSlice.actions;

export default drawingCanvasSlice.reducer;
