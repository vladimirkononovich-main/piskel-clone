import { off } from "process";
import React, { useEffect, useRef, useState } from "react";
import { windowPressedMouseButton } from "../../../App";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { RootState } from "../../../store";
import { drawingToolFunctions } from "../DrawingTools/tools";
import { IDrawingToolFunctions, IPixel } from "../models";
import { setScale } from "./drawingCanvasSlice";
import { IProps, IScalingParams } from "./models";

let matrix: IPixel[][] | null = null;
let top: number;
let right: number;
let bottom: number;
let left: number;

function DrawingCanvas({ parentRef, parentCoordinates }: IProps) {
  const drawingCanvasRef = useRef(null);
  const [scalingParams, setScalingParams] = useState<IScalingParams | null>(
    null
  );
  const drawingTools = useAppSelector((state: RootState) => state.drawingTools);
  const dispatch = useAppDispatch();
  const drawingCanvas = useAppSelector(
    (state: RootState) => state.drawingCanvas
  );
  const currentTool =
    drawingToolFunctions[
      drawingTools.currentToolName as keyof IDrawingToolFunctions
    ];
  const scale = drawingCanvas.scale;
  let drawingCanvasHTML: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  let parent: HTMLDivElement;
  let parentWidth: number;
  let parentHeight: number;
  let visibleWidth: number;
  let visibleHeight: number;

  const cropped = {
    top: scale,
    right: scale,
    bott: scale,
    left: scale,
  };
  const overflow = {
    top: 0,
    right: 0,
    bott: 0,
    left: 0,
  };

  const widthToScale = drawingCanvas.width * drawingCanvas.scale;
  const heightToScale = drawingCanvas.height * drawingCanvas.scale;
  const height = drawingCanvas.height;
  const width = drawingCanvas.width;

  useEffect(() => {
    drawingCanvasHTML = drawingCanvasRef.current!;
    parent = parentRef.current!;

    parentWidth = parent.clientWidth;
    parentHeight = parent.clientHeight;

    visibleWidth = Math.min(widthToScale, parentWidth);
    visibleHeight = Math.min(heightToScale, parentHeight);

    ctx = drawingCanvasHTML.getContext("2d", { willReadFrequently: true })!;
    if (!matrix) initDrawingCanvasMatrix();
  });

  useEffect(() => {
    centerTheCanvas();
  }, []);

  useEffect(() => {
    scaleDrawingCanvas();
  }, [drawingCanvas.scale]);

  const initDrawingCanvasMatrix = () => {
    matrix = Array.from(Array(drawingCanvas.height), () => {
      return Array.from(Array(drawingCanvas.width), () => {
        return {
          colorRGBA: {
            red: "0",
            green: "0",
            blue: "0",
            alpha: "0",
          },
        };
      });
    });
  };

  const updateCanvas = () => {
    if (!matrix) return;

    const xStart = Math.floor(Math.abs(overflow.left) / scale);
    const xEnd = width - 1 - Math.floor(overflow.right / scale);
    const yStart = Math.floor(Math.abs(overflow.top) / scale);
    const yEnd = height - 1 - Math.floor(overflow.bott / scale);
    let curr = 0;

    const imageData: ImageData = ctx.getImageData(
      0,
      0,
      visibleWidth,
      visibleHeight
    );

    for (let y = yStart; y <= yEnd; y++) {
      let height = scale;

      if (y === yStart) height = cropped.top;
      if (y === yEnd) height = cropped.bott;

      for (let h = 0; h < height; h++) {
        for (let x = xStart; x <= xEnd; x++) {
          let width = 4 * scale;

          if (x === xStart) width = 4 * cropped.left;
          if (x === xEnd) width = 4 * cropped.right;

          for (let w = 1; w <= width; w++) {
            if (w % 4 === 0)
              imageData.data[curr] = +matrix[y][x].colorRGBA.alpha;
            curr += 1;
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const centerTheCanvas = () => {
    drawingCanvasHTML.width = visibleWidth;
    drawingCanvasHTML.height = visibleHeight;

    left = Math.floor((parentWidth - visibleWidth) / 2);
    top = Math.floor((parentHeight - visibleHeight) / 2);
    right = left + widthToScale;
    bottom = top + heightToScale;

    if (heightToScale > visibleHeight) {
      const half = (heightToScale - visibleHeight) / 2;
      top = -Math.floor(half);
      bottom = Math.ceil(half);
      overflow.top = Math.floor(half);
      overflow.bott = Math.ceil(half);
    }

    if (widthToScale > visibleWidth) {
      const half = (widthToScale - visibleWidth) / 2;
      left = -Math.floor(half);
      right = Math.ceil(half);
      overflow.left = Math.floor(half);
      overflow.right = Math.ceil(half);
    }

    for (const key in overflow) {
      const value = overflow[key as keyof typeof overflow];
      if (!value) continue;
      cropped[key as keyof typeof cropped] =
        value >= scale ? scale - (value % scale) : scale - value;
    }

    drawingCanvasHTML.style.left = Math.max(left, 0) + "px";
    drawingCanvasHTML.style.top = Math.max(top, 0) + "px";

    updateCanvas();
  };

  const scaleDrawingCanvas = () => {
    if (!matrix) return;
    if (!parentCoordinates && !scalingParams) return;

    let xIndex = 0;
    let yIndex = 0;
    let x = 0;
    let y = 0;
    let xOutside = 0;
    let yOutside = 0;

    if (scalingParams) {
      const e = scalingParams.event!;
      const prevScale = scalingParams.prevScale!;

      x = e.nativeEvent.offsetX;
      y = e.nativeEvent.offsetY;

      xOutside = Math.max(left, 0) + x;
      yOutside = Math.max(top, 0) + y;

      xIndex = Math.floor((left < 0 ? Math.abs(left) + x : x) / prevScale);
      yIndex = Math.floor((top < 0 ? Math.abs(top) + y : y) / prevScale);
    }

    if (parentCoordinates) {
      const x = parentCoordinates.x;
      const y = parentCoordinates.y;
      const prevScale = parentCoordinates.prevScale;

      if (y < top) yIndex = 0;
      if (y > bottom) yIndex = height - 1;
      if (x < left) xIndex = 0;
      if (x > right) xIndex = width - 1;

      yOutside = top + Math.floor(yIndex * prevScale + prevScale / 2);
      xOutside = left + Math.floor(xIndex * prevScale + prevScale / 2);

      if (x > left && x < right) {
        xIndex = Math.floor((x - left) / prevScale);
        xOutside = x;
      }
      if (y > top && y < bottom) {
        yIndex = Math.floor((y - top) / prevScale);
        yOutside = y;
      }
    }

    if (xIndex < 0 || xIndex >= width) return;
    if (yIndex < 0 || yIndex >= height) return;

    left = xOutside - Math.floor(xIndex * scale + scale / 2);
    right = xOutside + Math.ceil((width - 1 - xIndex) * scale + scale / 2);
    top = yOutside - Math.floor(yIndex * scale + scale / 2);
    bottom = yOutside + Math.ceil((height - 1 - yIndex) * scale + scale / 2);

    overflow.left = left < 0 ? Math.abs(left) : 0;
    overflow.right = right > parentWidth ? right - parentWidth : 0;
    overflow.top = top < 0 ? Math.abs(top) : 0;
    overflow.bott = bottom > parentHeight ? bottom - parentHeight : 0;

    for (const key in overflow) {
      const value = overflow[key as keyof typeof overflow];
      if (!value) continue;

      cropped[key as keyof typeof cropped] =
        value >= scale ? scale - (value % scale) : scale - value;
    }

    visibleWidth = Math.min(right, parentWidth) - Math.max(left, 0);
    visibleHeight = Math.min(bottom, parentHeight) - Math.max(top, 0);

    drawingCanvasHTML.width = visibleWidth;
    drawingCanvasHTML.height = visibleHeight;

    drawingCanvasHTML.style.left = Math.max(left, 0) + "px";
    drawingCanvasHTML.style.top = Math.max(top, 0) + "px";

    updateCanvas();
    setScalingParams(null);
  };

  const mouseDownHandler = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    // ........................................................
    const xWithOverflow = Math.floor(
      (e.nativeEvent.offsetX + (widthToScale - visibleWidth) / 2) / scale
    );
    const yWithOverflow = Math.floor(
      (e.nativeEvent.offsetY + (heightToScale - visibleHeight) / 2) / scale
    );

    const offsetX = e.nativeEvent.offsetX;
    const offsetY = e.nativeEvent.offsetY;

    const xIndex = Math.floor(
      ((left < 0 ? Math.abs(left) : 0) + offsetX) / scale
    );
    const yIndex = Math.floor(
      ((top < 0 ? Math.abs(top) : 0) + offsetY) / scale
    );
    console.log(xIndex, "xIndex", yIndex, 'yIndex');

    // const fillRectY = !(yWithOverflow - overflowY)
    //   ? 0
    //   : croppedRowHeight + (yWithOverflow - overflowY - 1) * scale;
    // const fillRectX = !(xWithOverflow - overflowX)
    //   ? 0
    //   : croppedPixelWidth + (xWithOverflow - overflowX - 1) * scale;
    // const fillRectHeight = !(yWithOverflow - overflowY)
    //   ? croppedRowHeight
    //   : scale;
    // const fillRectWidth = !(xWithOverflow - overflowX)
    //   ? croppedPixelWidth
    //   : scale;

    const fillRectArgs = {
      // x: fillRectX,
      // y: fillRectY,
      // height: fillRectHeight,
      // width: fillRectWidth,

      x: 0,
      y: 0,
      height: 0,
      width: 0,
    };

    const args = {
      xIndex,
      yIndex,
      fillRectArgs,
      matrix,
      scale: drawingCanvas.scale,
      rgba: drawingTools.colorRGBALeftClick,
      ctx,
    };
    currentTool(args);
  };
  // const [scalingEvent, setScalingEvent] =
  //   useState<React.WheelEvent<HTMLCanvasElement> | null>(null);

  const onWheelHandler = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.stopPropagation();
    setScalingParams({ prevScale: scale, event: e });

    const w = drawingCanvas.width;
    const h = drawingCanvas.height;
    const w2 = parentWidth;
    const h2 = parentHeight;

    const maxScale = 100;
    const minScale = 1;
    let dividend = w2 - w >= h2 - h ? w2 : h2;
    let divisor = w2 - w >= h2 - h ? w : h;
    let step = Math.round(dividend / divisor / 10);
    if (maxScale * w < w2 || maxScale * h < h2) step = 10;
    if (widthToScale > w2 && heightToScale > h2) step = 5;

    setTimeout(() => {
      if (Math.sign(e.deltaY) === -1)
        dispatch(setScale(scale + Math.max(step, minScale)));
      if (Math.sign(e.deltaY) === 1)
        dispatch(setScale(scale - Math.max(step, minScale)));
    });
  };

  // const connectTwoPixels = (
  //   e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  // ) => {
  //   const endX = Math.floor(e.nativeEvent.offsetX / pixelSize);
  //   const endY = Math.floor(e.nativeEvent.offsetY / pixelSize);

  //   let y = 25;
  //   let x = 25;

  //   const yInterval = endY > y ? endY - y + 1 : y - endY + 1 || 1;
  //   const xInterval = endX > x ? endX - x + 1 : x - endX + 1;
  //   const yDirection = endY > y ? 1 : -1;
  //   const xDirection = endX > x ? 1 : -1;

  //   let connectionWay: number[][][] = [];

  //   const avgStep = Math.floor(
  //     Math.max(yInterval, xInterval) / Math.min(yInterval, xInterval)
  //   );
  //   const remainder =
  //     Math.max(yInterval, xInterval) % Math.min(yInterval, xInterval);
  //   const defaultUnitsCount = Math.min(yInterval, xInterval) - remainder;
  //   const enlargedUnitsCount = remainder;

  //   if (!remainder) {
  //     connectionWay[0] = [];
  //     connectionWay[0].length = Math.min(yInterval, xInterval);
  //     connectionWay[0].fill(Array(avgStep).fill(1));
  //   }

  //   const moreUnits = Math.max(defaultUnitsCount, enlargedUnitsCount);
  //   const fewerUnits = Math.min(defaultUnitsCount, enlargedUnitsCount);
  //   const interval = Math.floor(moreUnits / (fewerUnits + 1));
  //   const intervalRemainder = moreUnits % (fewerUnits + 1);
  //   connectionWay.length = fewerUnits;

  //   const intervalUnits = Array.from(Array(interval), (v, index) => {
  //     if (enlargedUnitsCount > defaultUnitsCount) {
  //       return Array(avgStep + 1).fill(1);
  //     }
  //     return Array(avgStep).fill(1);
  //   });

  //   connectionWay = Array.from(connectionWay, () => {
  //     if (enlargedUnitsCount > defaultUnitsCount) {
  //       return [...intervalUnits, Array(avgStep).fill(1)];
  //     }
  //     return [...intervalUnits, Array(avgStep + 1).fill(1)];
  //   });
  //   connectionWay.push(intervalUnits);

  //   if (intervalRemainder) {
  //     const middle = Math.ceil((fewerUnits + 1) / 2);
  //     let increment = 1;
  //     let decrement = 1;
  //     const intervalRemainderWay = [];

  //     for (let i = 0; i < intervalRemainder; i++) {
  //       if (!i) {
  //         intervalRemainderWay[i] = middle;
  //         continue;
  //       }
  //       if (i % 2) {
  //         intervalRemainderWay[i] = middle - decrement;
  //         decrement += 1;
  //       } else {
  //         intervalRemainderWay[i] = middle + increment;
  //         increment += 1;
  //       }
  //     }
  //     intervalRemainderWay.forEach((pos) => {
  //       if (enlargedUnitsCount > defaultUnitsCount) {
  //         connectionWay[pos - 1].unshift(Array(avgStep + 1).fill(1));
  //         return;
  //       }
  //       connectionWay[pos - 1].unshift(Array(avgStep).fill(1));
  //     });
  //   }

  //   connectionWay.forEach((currInterval) => {
  //     currInterval.forEach((column) => {
  //       column.forEach((pos) => {
  //         // const pixel = intermediateMatrix[y][x];
  //         // pixel.isFilled = true;
  //         if (yInterval >= xInterval) y += yDirection;
  //         else x += xDirection;
  //       });
  //       if (yInterval >= xInterval) x += xDirection;
  //       else y += yDirection;
  //     });
  //   });
  // };

  return (
    <canvas
      onWheel={onWheelHandler}
      onMouseDown={mouseDownHandler}
      className="main__drawing-canvas"
      ref={drawingCanvasRef}
    ></canvas>
  );
}

export default DrawingCanvas;
