import React, { useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import {
  setLeftColorParams,
  setRightColorParams,
} from "../ColorPicker/colorPickerSlice";
import { ColorParams } from "../ColorPicker/models";
import { drawingToolFunctions } from "../DrawingTools/tools";
import { frames } from "../frames/frames";
import { RGBA } from "../models";
import { changeFrameHash } from "../PreviewList/previewListSlice";
import { centerTheCanvas } from "./centering";
import {
  setScale,
  setPrevScale,
  setCanvasPosition,
} from "./drawingCanvasSlice";
import {
  IDrawingToolFunctions,
  ICurrentToolParams,
  IFillRectArgs,
  ActionColorParams,
  RowsColsValues,
  CanvasPosition,
  Matrix,
  CenteringParams,
} from "./models";
import { calcIntervals, calcRowsColsAllScales } from "./scaling";

export const drawVisibleArea = (
  height: number,
  width: number,
  ctx: CanvasRenderingContext2D,
  rowsColsValues: RowsColsValues,
  matrix: Matrix,
  scale: number
) => {
  const rowsHeightValues = rowsColsValues[scale].rows;
  const colsWidthValues = rowsColsValues[scale].cols;

  const coords = {
    x1: 0,
    x2: width,
    y1: 0,
    y2: height,
    remainderTop: 0,
    remainderLeft: 0,
  };

  calcIntervals(position.top, "y1", height, rowsHeightValues, coords);
  calcIntervals(position.bot, "y2", height, rowsHeightValues, coords);
  calcIntervals(position.left, "x1", width, colsWidthValues, coords);
  calcIntervals(position.right, "x2", width, colsWidthValues, coords);

  let x1 = coords.x1;
  let x2 = coords.x2;
  let y1 = coords.y1;
  let y2 = coords.y2;
  let remainderTop = coords.remainderTop;
  let remainderLeft = coords.remainderLeft;

  let sumHeight = 0;
  let sumWidth = 0;
  let rows = 0;
  let cols = 0;

  for (let i = y1; i < y2; i++) {
    rows += 1;
    sumHeight += rowsHeightValues[i];
  }
  for (let i = x1; i < x2; i++) {
    cols += 1;
    sumWidth += colsWidthValues[i];
  }

  const length = sumWidth * sumHeight * 4;
  const data = new Uint8ClampedArray(length);

  let curr = 0;

  for (let y = y1; y < y2; y++) {
    for (let h = 0; h < rowsHeightValues[y]; h++) {
      for (let x = x1; x < x2; x++) {
        const r = matrix.red[width * y + x];
        const g = matrix.green[width * y + x];
        const b = matrix.blue[width * y + x];
        const a = matrix.alpha[width * y + x];

        for (let w = 0; w < colsWidthValues[x]; w++) {
          data[curr] = r;
          data[curr + 1] = g;
          data[curr + 2] = b;
          data[curr + 3] = a;

          curr += 4;
        }
      }
    }
  }

  if (sumWidth < 1 || sumHeight < 1) return;
  const imageData = new ImageData(data, sumWidth, sumHeight);

  const layer = document.createElement("canvas");
  layer.width = sumWidth;
  layer.height = sumHeight;
  const layerCtx = layer.getContext("2d");
  layerCtx!.putImageData(imageData, 0, 0);

  const croppedImageData = layerCtx!.getImageData(
    remainderLeft,
    remainderTop,
    visibleW,
    visibleH
  );

  ctx.putImageData(croppedImageData, 0, 0);
};

export let rowsColsValues: RowsColsValues | null = null;

export const position: CanvasPosition = {
  top: 0,
  left: 0,
  bot: 0,
  right: 0,
};

export let visibleH = 0;
export let visibleW = 0;

export let ctx: CanvasRenderingContext2D;

let handlerInProgress = false;

function DrawingCanvas() {
  const parentRef = useRef(null);
  const canvasRef = useRef(null);
  const dispatch = useAppDispatch();
  const {
    leftColorParams,
    presetColorsLeft,
    presetColorsRight,
    rightColorParams,
  } = useAppSelector((state) => state.colorPicker);
  const { height, width, scale, scalingSteps, prevScale } = useAppSelector(
    (state) => state.drawingCanvas
  );
  const [canvasEvent, setCanvasEvent] = useState<
    React.WheelEvent<HTMLCanvasElement> | null | string
  >("init");
  const { currentToolName } = useAppSelector((state) => state.drawingTools);
  const { selectedFrameIndex } = useAppSelector((state) => state.previewList);

  const currentTool =
    drawingToolFunctions[currentToolName as keyof IDrawingToolFunctions];

  const matrix: Matrix = frames[selectedFrameIndex];

  let parentNode: HTMLDivElement;
  let canvasNode: HTMLCanvasElement;

  const pointerStart = useMemo(() => {
    return {
      x: null,
      y: null,
    };
  }, []);

  const scaledH = Math.floor(height * scale);
  const scaledW = Math.floor(width * scale);
  const prevScaledH = Math.floor(height * prevScale);
  const prevScaledW = Math.floor(width * prevScale);

  let parentH: number;
  let parentW: number;

  let centeringParams: CenteringParams;

  useEffect(() => {
    canvasNode = canvasRef.current!;
    parentNode = parentRef.current!;
    ctx = canvasNode.getContext("2d")!;

    parentH = parentNode.clientHeight;
    parentW = parentNode.clientWidth;
    visibleW = Math.min(parentW, scaledW);
    visibleH = Math.min(parentH, scaledH);

    centeringParams = {
      canvasEvent,
      scaledH,
      scaledW,
      parentW,
      parentH,
      prevScaledW,
      prevScaledH,
      position,
      prevScale,
      scale,
      rowsColsValues,
      height,
      width,
      visibleH,
      visibleW,
    };
  });

  useEffect(() => {
    if (!rowsColsValues) return;
    if (!canvasEvent) return;

    centerTheCanvas(centeringParams);

    canvasNode.width = visibleW;
    canvasNode.height = visibleH;

    canvasNode.style.left = Math.max(position.left, 0) + "px";
    canvasNode.style.top = Math.max(position.top, 0) + "px";

    drawVisibleArea(height, width, ctx, rowsColsValues, matrix, scale);

    setCanvasEvent(null);
    handlerInProgress = false;
  });

  useEffect(() => {
    rowsColsValues = calcRowsColsAllScales(scalingSteps, width, height);
  }, [height, width]);

  useEffect(() => {
    if (!rowsColsValues) return;

    centerTheCanvas(centeringParams);
    canvasNode.width = visibleW;
    canvasNode.height = visibleH;

    canvasNode.style.left = Math.max(position.left, 0) + "px";
    canvasNode.style.top = Math.max(position.top, 0) + "px";

    drawVisibleArea(height, width, ctx, rowsColsValues, matrix, scale);
  }, [selectedFrameIndex, frames.length]);

  useEffect(() => {
    dispatch(setCanvasPosition({ ...position }));
  }, [position.top, position.bot, position.left, position.right]);

  const onWhelHandler = async (e: React.WheelEvent<HTMLCanvasElement>) => {
    if (handlerInProgress) return;

    if (Math.sign(e.deltaY) === -1) {
      const stepIndex = scalingSteps.findIndex((el) => el === scale);
      const currScale = scalingSteps[stepIndex + 1];
      if (currScale === undefined) return;
      if (canvasEvent) return;

      dispatch(setPrevScale(scale));
      dispatch(setScale(currScale));
      setCanvasEvent(e);
    }

    if (Math.sign(e.deltaY) === 1) {
      const stepIndex = scalingSteps.findIndex((el) => el === scale);
      const currScale = scalingSteps[stepIndex - 1];
      if (currScale === undefined) return;
      if (canvasEvent) return;

      dispatch(setPrevScale(scale));
      dispatch(setScale(currScale));
      setCanvasEvent(e);
    }

    handlerInProgress = true;
  };

  const parentHandler = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.type === "pointerdown") canvasNode.setPointerCapture(e.pointerId);
  };

  const canvasPointerHandler = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.buttons === 0 && e.type !== "pointerup") return;
    const isCapture = canvasNode.hasPointerCapture(e.pointerId);
    if (!isCapture) canvasNode.setPointerCapture(e.pointerId);

    const offsetX = Math.round(e.nativeEvent.offsetX);
    const offsetY = Math.round(e.nativeEvent.offsetY);
    const cols = rowsColsValues![scale].cols;
    const rows = rowsColsValues![scale].rows;

    let yIndex = 0;
    let xIndex = 0;
    const yInterval = Math.abs(Math.min(position.top, 0)) + offsetY;
    const xInterval = Math.abs(Math.min(position.left, 0)) + offsetX;
    let sumRows = 0;
    let sumCols = 0;

    for (let i = 0; i < height; i++) {
      sumRows += rows[i];
      if (sumRows > yInterval) {
        yIndex = i;
        break;
      }
    }
    for (let i = 0; i < width; i++) {
      sumCols += cols[i];
      if (sumCols > xInterval) {
        xIndex = i;
        break;
      }
    }
    if (offsetX >= visibleW) {
      const diff = offsetX - visibleW;
      const overflowRight = Math.floor(Math.abs(Math.min(position.right, 0)));

      let lastX = 0;
      let sum = 0;
      for (let i = 0; i < width; i++) {
        sum += rowsColsValues![scale].cols[width - 1 - i];
        if (sum > overflowRight) {
          lastX = width - i;
          break;
        }
      }
      xIndex = lastX + Math.floor(diff / scale);
    }
    if (offsetY >= visibleH) {
      const diff = offsetY - visibleH;
      const overflowBot = Math.floor(Math.abs(Math.min(position.bot, 0)));

      let lastY = 0;
      let sum = 0;
      for (let i = 0; i < height; i++) {
        sum += rowsColsValues![scale].rows[height - 1 - i];
        if (sum > overflowBot) {
          lastY = height - i;
          break;
        }
      }
      yIndex = lastY + Math.floor(diff / scale);
    }
    if (offsetX < 0) {
      xIndex =
        Math.floor(Math.abs(Math.min(position.left, 0)) / scale) +
        Math.floor(offsetX / scale);
    }
    if (offsetY < 0) {
      yIndex =
        Math.floor(Math.abs(Math.min(position.top, 0)) / scale) +
        Math.floor(offsetY / scale);
    }

    let rgba: RGBA;
    let currPreset: ColorParams[];
    let setColorParams: ActionColorParams;

    if (e.buttons === 1 || e.button === 0) {
      rgba = leftColorParams;
      currPreset = presetColorsLeft;
      setColorParams = setLeftColorParams;
    }

    if (e.buttons === 2 || e.button === 2) {
      rgba = rightColorParams;
      currPreset = presetColorsRight;
      setColorParams = setRightColorParams;
    }

    if (!rgba! || !currPreset! || !setColorParams!) return;

    const fillRectArgs: IFillRectArgs = {
      colorPicker: {
        left: leftColorParams,
        right: rightColorParams,
      },
      clickRGBA: rgba!,
    };
    const allPresetColors = [...presetColorsLeft, ...presetColorsRight];

    const args: ICurrentToolParams = {
      e,
      xIndex,
      yIndex,
      fillRectArgs,
      ctx,
      width,
      height,
      dispatch,
      allPresetColors,
      currPreset,
      setColorParams,
      pointerStart,
      matrix,
      rowsColsValues: rowsColsValues!,
      drawVisibleArea,
      scale,
    };

    currentTool(args);

    if (e.type === "pointerup") {
      const hash = uuidv4();
      dispatch(changeFrameHash({ frameIndex: selectedFrameIndex, hash }));
    }
  };

  return (
    <div
      className="main__middle-section"
      ref={parentRef}
      onPointerDown={parentHandler}
      onContextMenu={(e) => e.preventDefault()}
    >
      <canvas
        className="main__drawing-canvas"
        ref={canvasRef}
        onPointerDown={canvasPointerHandler}
        onPointerMove={canvasPointerHandler}
        onPointerUp={canvasPointerHandler}
        onContextMenu={(e) => e.preventDefault()}
        onWheel={onWhelHandler}
      ></canvas>
    </div>
  );
}

export default DrawingCanvas;
