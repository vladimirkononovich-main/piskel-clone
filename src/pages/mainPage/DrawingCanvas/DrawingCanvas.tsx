import { off } from "process";
import React, { useEffect, useRef, useState } from "react";
import { windowPressedMouseButton } from "../../../App";
import { useAppSelector } from "../../../hooks";
import { RootState } from "../../../store";
import { drawingToolFunctions } from "../DrawingTools/tools";
import { IDrawingToolFunctions, IPixel } from "../models";

let matrix: IPixel[][] | null = null;

function DrawingCanvas({
  middleSectionRef,
}: {
  middleSectionRef: React.MutableRefObject<null>;
}) {
  const drawingCanvasRef = useRef(null);
  const drawingTools = useAppSelector((state: RootState) => state.drawingTools);
  const drawingCanvas = useAppSelector(
    (state: RootState) => state.drawingCanvas
  );
  const currentTool =
    drawingToolFunctions[
      drawingTools.currentToolName as keyof IDrawingToolFunctions
    ];
  let drawingCanvasHTML: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  let middleSection: HTMLDivElement;
  let middleSectionWidth: number;
  let middleSectionHeight: number;
  let visibleWidth: number;
  let visibleHeight: number;
  let overflowY: number;
  let overflowX: number;
  let croppedRowHeight: number;
  let croppedPixelWidth: number;
  let pixelWidthRemainder: number;

  const canvasWidthToScale = drawingCanvas.width * drawingCanvas.scale;
  const canvasHeightToScale = drawingCanvas.height * drawingCanvas.scale;
  const scale = drawingCanvas.scale;
  const height = drawingCanvas.height;
  const width = drawingCanvas.width;

  useEffect(() => {
    drawingCanvasHTML = drawingCanvasRef.current!;
    middleSection = middleSectionRef.current!;
    middleSectionHeight = middleSection.clientHeight;
    middleSectionWidth = middleSection.clientWidth;
    visibleWidth = Math.min(canvasWidthToScale, middleSectionWidth);
    visibleHeight = Math.min(canvasHeightToScale, middleSectionHeight);
    overflowY = Math.floor((canvasHeightToScale - visibleHeight) / 2 / scale);
    overflowX = Math.floor((canvasWidthToScale - visibleWidth) / 2 / scale);
    croppedRowHeight = Math.floor(
      (visibleHeight - (height - overflowY * 2 - 2) * scale) / 2
    );
    croppedPixelWidth = Math.floor(
      (visibleWidth - (width - overflowX * 2 - 2) * scale) / 2
    );
    pixelWidthRemainder =
      (visibleWidth - (width - overflowX * 2 - 2) * scale) % 2;

    ctx = drawingCanvasHTML.getContext("2d", { willReadFrequently: true })!;
    if (!matrix) initDrawingCanvasMatrix();
  });

  useEffect(() => {
    drawingCanvasHTML.width = Math.min(
      canvasWidthToScale,
      middleSection.clientWidth
    );
    drawingCanvasHTML.height = Math.min(
      canvasHeightToScale,
      middleSection.clientHeight
    );

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

  const scaleDrawingCanvas = () => {
    if (!matrix) return;

    const imageData: ImageData | null = ctx.getImageData(
      0,
      0,
      visibleWidth,
      visibleHeight
    );

    const matrixStart = overflowY;
    const matrixEnd = height - overflowY - 1;
    const rowStart = overflowX;
    const rowEnd = width - overflowX - 1;
    let curr = 0;

    for (let rowI = matrixStart; rowI <= matrixEnd; rowI++) {
      let currRowHeight = scale;
      if (rowI === matrixStart || rowI === matrixEnd)
        currRowHeight = croppedRowHeight;

      for (let i = 0; i < currRowHeight; i++) {
        for (let pxlI = rowStart; pxlI <= rowEnd; pxlI++) {
          const pixelAlpha = +matrix[rowI][pxlI].colorRGBA.alpha;
          let currPixelWidth = 4 * scale;
          if (pxlI === rowStart) currPixelWidth = 4 * croppedPixelWidth;
          if (pxlI === rowEnd) currPixelWidth = 4 * croppedPixelWidth;

          for (let j = 1; j <= currPixelWidth; j++) {
            if (j % 4 === 0) imageData!.data[curr] = pixelAlpha;
            curr += 1;
          }
        }
        if (pixelWidthRemainder) curr += 4;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const mouseDownHandler = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const xWithOverflow = Math.floor(
      (e.nativeEvent.offsetX + (canvasWidthToScale - visibleWidth) / 2) / scale
    );
    const yWithOverflow = Math.floor(
      (e.nativeEvent.offsetY + (canvasHeightToScale - visibleHeight) / 2) /
        scale
    );
    const fillRectY = !(yWithOverflow - overflowY)
      ? 0
      : croppedRowHeight + (yWithOverflow - overflowY - 1) * scale;
    const fillRectX = !(xWithOverflow - overflowX)
      ? 0
      : croppedPixelWidth + (xWithOverflow - overflowX - 1) * scale;
    const fillRectHeight = !(yWithOverflow - overflowY)
      ? croppedRowHeight
      : scale;
    const fillRectWidth = !(xWithOverflow - overflowX)
      ? croppedPixelWidth
      : scale;

    const fillRectArgs = {
      x: fillRectX,
      y: fillRectY,
      height: fillRectHeight,
      width: fillRectWidth,
    };

    const args = {
      xWithOverflow,
      yWithOverflow,
      fillRectArgs,
      matrix,
      scale: drawingCanvas.scale,
      rgba: drawingTools.colorRGBALeftClick,
      ctx,
    };
    currentTool(args);
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
      onMouseDown={mouseDownHandler}
      className="main__drawing-canvas"
      ref={drawingCanvasRef}
    ></canvas>
  );
}

export default DrawingCanvas;
