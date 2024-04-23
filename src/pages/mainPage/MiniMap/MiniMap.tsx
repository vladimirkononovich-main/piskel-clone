import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import canvasBackImg from "../../../assets/canvas-background-img.png";
import {
  ctx,
  drawVisibleArea,
  position,
  rowsColsValues,
  visibleH,
  visibleW,
} from "../DrawingCanvas/DrawingCanvas";
import { setCanvasPosition } from "../DrawingCanvas/drawingCanvasSlice";
import { frames } from "../frames/frames";
import { framesPNG } from "../frames/framesPNG";
import "./miniMap.css";

function MiniMap() {
  const miniMapRef = useRef(null);
  const cropFrameRef = useRef(null);
  const dispatch = useAppDispatch();
  const { height, width, scale } = useAppSelector(
    (state) => state.drawingCanvas
  );
  const { selectedFrameIndex } = useAppSelector((state) => state.previewList);
  const matrix = frames[selectedFrameIndex];

  const isOverflowY = position.top <= 0;
  const isOverflowX = position.left <= 0;

  const drawingCanvasH =
    Math.abs(Math.min(position.top, 0)) +
    visibleH +
    Math.abs(Math.min(position.bot, 0));

  const drawingCanvasW =
    Math.abs(Math.min(position.left, 0)) +
    visibleW +
    Math.abs(Math.min(position.right, 0));

  const yRatio = drawingCanvasH / 200;
  const xRatio = drawingCanvasW / 200;

  let miniMapNode: HTMLDivElement;
  let cropFrameNode: HTMLDivElement;

  useEffect(() => {
    miniMapNode = miniMapRef.current!;
    cropFrameNode = cropFrameRef.current!;

    miniMapNode.style.backgroundImage = `url(${framesPNG[0]}), url(${canvasBackImg})`;

    // console.log(framesPNG[0]);
    
    // console.log(`url(${framesPNG[0]}), url(${canvasBackImg})`);

    if (cropFrameNode) {
      if (isOverflowY) {
        cropFrameNode.style.height = "";
        cropFrameNode.style.top = Math.abs(position.top) / yRatio + "px";
        cropFrameNode.style.bottom = Math.abs(position.bot) / yRatio + "px";
      }

      if (isOverflowX) {
        cropFrameNode.style.width = "";
        cropFrameNode.style.left = Math.abs(position.left) / xRatio + "px";
        cropFrameNode.style.right = Math.abs(position.right) / xRatio + "px";
      }

      if (isOverflowY && !isOverflowX) {
        cropFrameNode.style.left = "0px";
        cropFrameNode.style.width = "200px";
      }
      if (isOverflowX && !isOverflowY) {
        cropFrameNode.style.top = "0px";
        cropFrameNode.style.height = "200px";
      }
    }
  });

  const miniMapHandler = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons === 0 && e.type === "pointermove") return;

    let x = e.nativeEvent.offsetX;
    let y = e.nativeEvent.offsetY;

    if (e.type === "pointerdown") {
      miniMapNode.setPointerCapture(e.pointerId);
      miniMapNode.style.cursor = "pointer";
    }
    if (e.type === "pointerup") miniMapNode.style.cursor = "default";

    const cropFrameW = cropFrameNode.clientWidth;
    const cropFrameH = cropFrameNode.clientHeight;
    const miniMapW = miniMapNode.clientWidth;
    const miniMapH = miniMapNode.clientHeight;

    let top = y;
    let left = x;

    if (top + cropFrameH > miniMapH) top = miniMapH - cropFrameH;
    if (left + cropFrameW > miniMapW) left = miniMapW - cropFrameW;

    cropFrameNode.style.top = Math.max(top, 0) + "px";
    cropFrameNode.style.left = Math.max(left, 0) + "px";
    top = Math.max(top, 0);
    left = Math.max(left, 0);

    const topWithRatio = Math.floor(top * yRatio);
    const botWithRatio = drawingCanvasH - (Math.abs(topWithRatio) + visibleH);
    const leftWithRatio = Math.floor(left * xRatio);
    const rightWithRatio =
      drawingCanvasW - (Math.abs(leftWithRatio) + visibleW);

    position.top = -topWithRatio;
    position.bot = -botWithRatio;
    position.left = -leftWithRatio;
    position.right = -rightWithRatio;

    dispatch(
      setCanvasPosition({
        top: -topWithRatio,
        bot: -botWithRatio,
        left: -leftWithRatio,
        right: -rightWithRatio,
      })
    );
    drawVisibleArea(height, width, ctx, rowsColsValues!, matrix, scale);
  };

  const cropFrameHandler = (e: React.PointerEvent<HTMLDivElement>) => {
    miniMapNode.setPointerCapture(e.pointerId);
    e.stopPropagation();
  };

  return (
    <div
      className="main__mini-map"
      ref={miniMapRef}
      onPointerMove={miniMapHandler}
      onPointerUp={miniMapHandler}
      onPointerDown={miniMapHandler}
    >
      {(isOverflowY || isOverflowX) && (
        <div
          className="main__mini-map-crop-frame"
          ref={cropFrameRef}
          onPointerDown={cropFrameHandler}
        ></div>
      )}
    </div>
  );
}

export default MiniMap;
