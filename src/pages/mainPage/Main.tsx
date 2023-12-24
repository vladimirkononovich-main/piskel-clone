import React, { forwardRef, useEffect, useRef, useState } from "react";
import DrawingCanvas from "./DrawingCanvas/DrawingCanvas";
import DrawingTools from "./DrawingTools/DrawingTools";
import "./main.css";
import { IDrawingCanvas, IPixel } from "./models";

const Main = () => {
  return (
    <main className="main">
      <div className="main__left-section">
        <div className="main__drawing-tools-wrapper">
          <DrawingTools />
        </div>
      </div>
      <div className="main__middle-section">
        <DrawingCanvas />
      </div>
      <div className="main__right-section"></div>
    </main>
  );
};

export default Main;
