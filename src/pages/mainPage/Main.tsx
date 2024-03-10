import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { RootState } from "../../store";
import DrawingCanvas from "./DrawingCanvas/DrawingCanvas";
import { setScale } from "./DrawingCanvas/drawingCanvasSlice";
import DrawingTools from "./DrawingTools/DrawingTools";
import "./main.css";
import { IParentCoordinates } from "./models";

const Main = () => {
  const drawingCanvas = useAppSelector(
    (state: RootState) => state.drawingCanvas
  );
  const [coordinates, setCoordinates] = useState<IParentCoordinates | null>(
    null
  );
  const dispatch = useAppDispatch();
  const middleSectionRef = useRef(null);
  const drawingCanvasRef = useRef(null);
  const drawingCanvasWidthToScale = drawingCanvas.scale * drawingCanvas.width;
  const drawingCanvasHeightToScale = drawingCanvas.scale * drawingCanvas.height;
  const scale = drawingCanvas.scale;
  let middleSection: HTMLDivElement;
  let drawingCanvasHTML: HTMLCanvasElement;
  let middleSectionWidth: number;
  let middleSectionHeight: number;

  useEffect(() => {
    drawingCanvasHTML = drawingCanvasRef.current!;
    middleSection = middleSectionRef.current!;
    middleSectionWidth = middleSection.clientWidth;
    middleSectionHeight = middleSection.clientHeight;
  });

  const changeDrawingCanvasScale = (e: React.WheelEvent<HTMLDivElement>) => {
    const w = drawingCanvas.width;
    const h = drawingCanvas.height;
    const w2 = middleSectionWidth;
    const h2 = middleSectionHeight;

    const maxScale = 100;
    const minScale = 1;
    let dividend = w2 - w >= h2 - h ? w2 : h2;
    let divisor = w2 - w >= h2 - h ? w : h;
    let step = Math.round(dividend / divisor / 10);
    if (maxScale * w < w2 || maxScale * h < h2) step = 10;
    if (drawingCanvasWidthToScale > w2) step = 5;
    if (drawingCanvasHeightToScale > h2) step = 5;

    setCoordinates({
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
      prevScale: scale,
    });

    setTimeout(() => {
      if (Math.sign(e.deltaY) === -1)
        dispatch(setScale(scale + Math.max(step, minScale)));
      if (Math.sign(e.deltaY) === 1)
        dispatch(setScale(scale - Math.max(step, minScale)));

      setCoordinates(null);
    });
  };

  const pointerHandler = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drawingCanvasHTML) return;

    switch (e.type) {
      case "pointermove":
        if (!drawingCanvasHTML.hasPointerCapture(e.pointerId))
          drawingCanvasHTML.setPointerCapture(e.pointerId);
        return;

      case "pointerdown":
        drawingCanvasHTML.setPointerCapture(e.pointerId);
        return;
    }
  };

  return (
    <main className="main">
      <div className="main__left-section">
        <DrawingTools />
      </div>
      <div
        className="main__middle-section"
        onPointerMove={pointerHandler}
        onPointerDown={pointerHandler}
        // onPointerUp={pointerHandler}
        onWheel={(e) => changeDrawingCanvasScale(e)}
        ref={middleSectionRef}
      >
        <DrawingCanvas
          ref={drawingCanvasRef}
          parentRef={middleSectionRef}
          parentCoordinates={coordinates}
        />
      </div>
      <div className="main__right-section">
        <div className="main__drawing-canvas-info">x{scale}</div>
      </div>
    </main>
  );
};

export default Main;
