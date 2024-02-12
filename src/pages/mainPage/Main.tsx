import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks";
import { RootState } from "../../store";
import DrawingCanvas from "./DrawingCanvas/DrawingCanvas";
import { setScale } from "./DrawingCanvas/drawingCanvasSlice";
import DrawingTools from "./DrawingTools/DrawingTools";
import "./main.css";
import { DrawingCanvasMatrix } from "./models";

const Main = () => {
  const drawingCanvas = useSelector((state: RootState) => state.drawingCanvas);
  const dispatch = useAppDispatch();
  const middleSectionRef = useRef(null);


  const changeDrawingCanvasScale = (e: React.WheelEvent<HTMLDivElement>) => {
    if (Math.sign(e.deltaY) === -1) dispatch(setScale(drawingCanvas.scale + 1));
    if (Math.sign(e.deltaY) === 1) dispatch(setScale(drawingCanvas.scale - 1));
  };

  return (
    <main className="main">
      <div className="main__left-section">
        <DrawingTools />
      </div>
      <div className="main__middle-section" onWheel={changeDrawingCanvasScale} ref={middleSectionRef}>
        <DrawingCanvas middleSectionRef={middleSectionRef}/>
      </div>
      <div className="main__right-section"></div>
    </main>
  );
};

export default Main;
