import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IDrawingCanvasInitState } from "./models";

const initialState: IDrawingCanvasInitState = {
  width: 50,
  height: 50,
  scale: 1,
};

export const drawingCanvasSlice = createSlice({
  name: "drawingCanvas",
  initialState,
  reducers: {
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

export const { setScale } = drawingCanvasSlice.actions;

export default drawingCanvasSlice.reducer;
