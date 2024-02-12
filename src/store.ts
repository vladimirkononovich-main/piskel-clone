import drawingCanvasSlice from "./pages/mainPage/DrawingCanvas/drawingCanvasSlice";
import { configureStore } from "@reduxjs/toolkit";
import drawingToolsSlice from "./pages/mainPage/DrawingTools/drawingToolsSlice";

export const store = configureStore({
  reducer: {
    drawingCanvas: drawingCanvasSlice,
    drawingTools: drawingToolsSlice,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
