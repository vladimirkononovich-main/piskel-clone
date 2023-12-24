import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import DrawingCanvas from "./DrawingCanvas/DrawingCanvas";
import { setScale } from "./DrawingCanvas/drawingCanvasSlice";
import DrawingTools from "./DrawingTools/DrawingTools";
import "./main.css";

const Main = () => {
  const drawingCanvas = useSelector((state: RootState) => state.drawingCanvas);
  const dispatch = useDispatch();

  const drawingCanvasHandler = (e: React.WheelEvent<HTMLDivElement>) => {
    if (Math.sign(e.deltaY) === -1) dispatch(setScale(drawingCanvas.scale + 1));
    if (Math.sign(e.deltaY) === 1) dispatch(setScale(drawingCanvas.scale - 1));
  };

  return (
    <main className="main">
      <div className="main__left-section">
        <div className="main__drawing-tools-wrapper">
          <DrawingTools />
        </div>
      </div>
      <div className="main__middle-section" onWheel={drawingCanvasHandler}>
        <DrawingCanvas />
      </div>
      <div className="main__right-section"></div>
    </main>
  );
};

export default Main;
