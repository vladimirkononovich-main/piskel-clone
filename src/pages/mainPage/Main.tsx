import React from "react";
import { useAppSelector } from "../../hooks";
import { ColorPicker } from "./ColorPicker/ColorPicker";
import DrawingCanvas from "./DrawingCanvas/DrawingCanvas";
import DrawingTools from "./DrawingTools/DrawingTools";
import "./main.css";

const Main = () => {
  const { scale } = useAppSelector((state) => state.drawingCanvas);
  return (
    <main className="main">
      <div className="main__left-section">
        <DrawingTools />
        <ColorPicker />
      </div>
      <DrawingCanvas />
      <div className="main__right-section">
        <div className="main__drawing-canvas-info">x{scale}</div>
      </div>
    </main>
  );
};

export default Main;
