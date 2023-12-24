import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { IPixel } from "../models";
import { setMatrix } from "./drawingCanvasSlice";

function DrawingCanvas() {
  const drawingCanvasRef = useRef(null);
  const drawingCanvas = useSelector((state: RootState) => state.drawingCanvas);
  const dispatch = useDispatch();

  const canvasWidth = drawingCanvas.width * drawingCanvas.scale;
  const pixelSize = canvasWidth / drawingCanvas.width;

  let drawingCanvasHTML: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  useEffect(() => {
    drawingCanvasHTML = drawingCanvasRef.current!;
    ctx = drawingCanvasHTML.getContext("2d")!;
    if (!drawingCanvas.matrix) initializeDrawingCanvasMatrix();
  });

  useEffect(() => {
    updateDrawingCanvasMatrix();
  }, [drawingCanvas.scale]);

  const updateDrawingCanvasMatrix = () => {
    if (!drawingCanvas.matrix) return;
    const copyMatrix = Array.from(drawingCanvas.matrix);
    copyMatrix.length = drawingCanvas.height;

    const newDrawingCanvasMatrix = Array.from(copyMatrix, (row, rowIndex) => {
      const copyMatrixRow = Array.from(row);
      copyMatrixRow.length = drawingCanvas.width;

      return Array.from(copyMatrixRow, (pixel, pixelIndex) => {
        return {
          ...pixel,
          y: rowIndex * pixelSize,
          x: pixelIndex * pixelSize,
        };
      });
    });
    updateDrawingCanvas(newDrawingCanvasMatrix);
    dispatch(setMatrix(newDrawingCanvasMatrix));
  };

  const initializeDrawingCanvasMatrix = () => {
    const newDrawingCanvasMatrix = Array.from(
      Array(drawingCanvas.height),
      (row, rowIndex) => {
        return Array.from(Array(drawingCanvas.width), (pixel, pixelIndex) => {
          return {
            y: rowIndex * pixelSize,
            x: pixelIndex * pixelSize,
            isFilled: false,
          };
        });
      }
    );

    updateDrawingCanvas(newDrawingCanvasMatrix);
    dispatch(setMatrix(newDrawingCanvasMatrix));
  };

  const updateDrawingCanvas = (matrix: IPixel[][]) => {
    if (!drawingCanvas.matrix) return;

    const canvasWidth = drawingCanvas.width * drawingCanvas.scale;
    const canvasHeight = drawingCanvas.height * drawingCanvas.scale;
    const pixelSize = canvasWidth / drawingCanvas.width;

    ctx!.clearRect(0, 0, canvasWidth, canvasHeight);

    matrix.forEach((row, rowIndex) => {
      row.forEach((pixel, pixelIndex) => {
        if (!pixel.isFilled) return;
        ctx!.fillRect(pixel.x, pixel.y, pixelSize, pixelSize);
      });
    });
  };

  return (
    <canvas
      className="main__drawing-canvas"
      width={drawingCanvas.width * drawingCanvas.scale}
      height={drawingCanvas.height * drawingCanvas.scale}
      ref={drawingCanvasRef}
    ></canvas>
  );
}

export default DrawingCanvas;
