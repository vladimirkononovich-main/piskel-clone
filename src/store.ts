import drawingCanvasSlice from "./pages/mainPage/DrawingCanvas/drawingCanvasSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    drawingCanvas: drawingCanvasSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
