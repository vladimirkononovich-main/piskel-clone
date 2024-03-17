import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IDrawingToolsState } from "./models";

const initialState: IDrawingToolsState = {
  penSize: 1,
  penSizes: [1, 2, 3, 4],
  currentToolName: "penTool",
  colorRGBALeftClick: [0, 0, 0, 255],
  colorRGBARightClick: [0, 255, 0, 255],
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
