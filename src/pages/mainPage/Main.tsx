import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { RootState } from "../../store";
import DrawingCanvas, {
  left,
  top,
  matrix,
  prevPixelIndexes,
} from "./DrawingCanvas/DrawingCanvas";
import { setScale } from "./DrawingCanvas/drawingCanvasSlice";
import {
  ICurrentToolParams,
  IDrawingToolFunctions,
  IFillRectArgs,
} from "./DrawingCanvas/models";
import { getFillRectXY } from "./DrawingCanvas/prefillingTheRectangle";
import DrawingTools from "./DrawingTools/DrawingTools";
import { drawingToolFunctions } from "./DrawingTools/tools";
import "./main.css";
import { IParentCoordinates } from "./models";

const Main = () => {
  const drawingCanvas = useAppSelector(
    (state: RootState) => state.drawingCanvas
  );
  const drawingTools = useAppSelector((state: RootState) => state.drawingTools);
  const [coordinates, setCoordinates] = useState<IParentCoordinates | null>(
    null
  );
  const currentTool =
    drawingToolFunctions[
      drawingTools.currentToolName as keyof IDrawingToolFunctions
    ];
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

  const mouseEvent = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!drawingCanvasHTML) return;

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const width = drawingCanvas.width;
    const height = drawingCanvas.height;
    const ctx = drawingCanvasHTML.getContext("2d")!;

    let yIndex = Math.floor((y - top) / scale);
    let xIndex = Math.floor((x - left) / scale);
    let currClick: string;

    if (e.buttons === 0) return;
    if (e.buttons === 1) currClick = "left";
    if (e.buttons === 2) currClick = "right";

    const rgba =
      currClick! === "left"
        ? drawingTools.colorRGBALeftClick
        : drawingTools.colorRGBARightClick;

    const fillRectArgs: IFillRectArgs = {
      ...getFillRectXY(xIndex, yIndex, scale),
      clickRGBA: rgba,
    };

    const arg: ICurrentToolParams = {
      ctx,
      fillRectArgs,
      matrix,
      scale,
      xIndex,
      yIndex,
      width,
      height,
      prevPixelIndexes,
    };

    currentTool(arg);
  };

  return (
    <main className="main">
      <div className="main__left-section">
        <DrawingTools />
      </div>
      <div
        className="main__middle-section"
        onMouseMove={mouseEvent}
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
