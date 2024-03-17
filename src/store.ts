import drawingCanvasSlice from "./pages/mainPage/DrawingCanvas/drawingCanvasSlice";
import { configureStore } from "@reduxjs/toolkit";
import drawingToolsSlice from "./pages/mainPage/DrawingTools/drawingToolsSlice";
import colorPickerSlice from "./pages/mainPage/ColorPicker/colorPickerSlice";

export const store = configureStore({
  reducer: {
    drawingCanvas: drawingCanvasSlice,
    drawingTools: drawingToolsSlice,
    colorPicker: colorPickerSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
