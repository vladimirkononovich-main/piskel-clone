import { prevPixelIndexes } from "./pages/mainPage/DrawingCanvas/DrawingCanvas";

export let windowPressedMouseButton: string | null = null;

document.body.addEventListener("mousedown", (e) => {
  if (e.button === 0) windowPressedMouseButton = "left";
  if (e.button === 2) windowPressedMouseButton = "right";
});

document.body.addEventListener("mouseup", () => {
  windowPressedMouseButton = null;
  prevPixelIndexes.xIndex = null;
  prevPixelIndexes.yIndex = null;
});

document.body.addEventListener("mouseleave", () => {
  prevPixelIndexes.xIndex = null;
  prevPixelIndexes.yIndex = null;
});
