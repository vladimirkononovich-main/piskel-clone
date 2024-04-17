import React from "react";
import { useAppSelector } from "../../hooks";
import { ColorPicker } from "./ColorPicker/ColorPicker";
import DrawingCanvas from "./DrawingCanvas/DrawingCanvas";
import DrawingTools from "./DrawingTools/DrawingTools";
import "./main.css";
import PreviewList from "./PreviewList/PreviewList";

const Main = () => {
  const { scale } = useAppSelector((state) => state.drawingCanvas);
  return (
    <main className="main">
      <div className="main__left-section">
        <div className="main__left-wrapper">
          <div className="main__left-wrapper2">
            <DrawingTools />
            <ColorPicker />
          </div>
        </div>
        <div className="main__right-wrapper">
          <PreviewList />
        </div>
      </div>
      <DrawingCanvas />
      <div className="main__right-section">
        <div className="main__drawing-canvas-info">x{scale}</div>
      </div>
    </main>
  );
};

export default Main;
