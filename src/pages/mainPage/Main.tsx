import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks";
import { RootState } from "../../store";
import DrawingCanvas from "./DrawingCanvas/DrawingCanvas";
import { setScale } from "./DrawingCanvas/drawingCanvasSlice";
import DrawingTools from "./DrawingTools/DrawingTools";
import "./main.css";
import { IParentCoordinates } from "./models";


const Main = () => {
  const drawingCanvas = useSelector((state: RootState) => state.drawingCanvas);
  const [coordinates, setCoordinates] = useState<IParentCoordinates | null>(
    null
  );
  const dispatch = useAppDispatch();
  const middleSectionRef = useRef(null);
  const drawingCanvasWidthToScale = drawingCanvas.scale * drawingCanvas.width;
  const drawingCanvasHeightToScale = drawingCanvas.scale * drawingCanvas.height;
  const scale = drawingCanvas.scale;
  let middleSection: HTMLDivElement;
  let middleSectionWidth: number;
  let middleSectionHeight: number;

  useEffect(() => {
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

  return (
    <main className="main">
      <div className="main__left-section">
        <DrawingTools />
      </div>
      <div
        className="main__middle-section"
        onWheel={(e) => changeDrawingCanvasScale(e)}
        ref={middleSectionRef}
      >
        <DrawingCanvas
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
