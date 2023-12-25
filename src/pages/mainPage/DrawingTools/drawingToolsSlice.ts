import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IDrawingTools } from "../models";

const initialState: IDrawingTools = {
  penSize: 1,
  penSizes: [1, 2, 3, 4],
};

export const drawingToolsSlice = createSlice({
  name: "drawingTools",
  initialState,
  reducers: {
    setPenSize: (state, action) => {
      state.penSize = action.payload;
    },
  },
});

export const { setPenSize } = drawingToolsSlice.actions;

export default drawingToolsSlice.reducer;
