import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DrawingCanvasMatrix, IDrawingCanvas, IPixel } from "../models";

const initialState: IDrawingCanvas = {
  width: 1,
  height: 1,
  scale: 1,
  matrix: null,
};

export const drawingCanvasSlice = createSlice({
  name: "drawingCanvas",
  initialState,
  reducers: {
    setMatrix: (state, action: PayloadAction<DrawingCanvasMatrix>) => {
      state.matrix = action.payload;
    },

    setScale: (state, action: PayloadAction<number>) => {
      const minScale = 1;
      const maxScale = 100;
      if (action.payload > maxScale) {
        state.scale = maxScale;
        return state;
      }
      if (action.payload < minScale) {
        state.scale = minScale;
        return state;
      }

      state.scale = action.payload;
    },
  },
});

export const { setMatrix, setScale } = drawingCanvasSlice.actions;

export default drawingCanvasSlice.reducer;
