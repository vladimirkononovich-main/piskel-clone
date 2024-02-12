import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DrawingCanvasMatrix, IDrawingTools, IPixel } from "../models";

const initialState: IDrawingTools = {
  penSize: 1,
  penSizes: [1, 2, 3, 4],
  currentToolName: "penTool",
  colorRGBALeftClick: {
    red: "0",
    green: "0",
    blue: "0",
    alpha: "255",
  },
  colorRGBARightClick: {
    red: "0",
    green: "0",
    blue: "0",
    alpha: "1",
  },
};

export const drawingToolsSlice = createSlice({
  name: "drawingTools",
  initialState,
  reducers: {
    setPenSize: (state, action: PayloadAction<number>) => {
      state.penSize = action.payload;
    },
    setCurrentToolName: (state, action: PayloadAction<string>) => {
      state.currentToolName = action.payload;
    },
  },
});

export const { setPenSize, setCurrentToolName } = drawingToolsSlice.actions;

export default drawingToolsSlice.reducer;
