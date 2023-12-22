import React, { forwardRef, useEffect, useRef, useState } from "react";
import "./main.css";
import { IDrawingCanvas, IPixel } from "./models";

const Main = () => {
  const drawingCanvasRef = useRef(null);
  const [drawingCanvas, setDrawingCanvas] = useState<IDrawingCanvas>({
    width: 50,
    height: 40,
    scale: 1,
    ctx: null,
    matrix: null,
  });
  const canvasWidth = drawingCanvas.width * drawingCanvas.scale;
  const pixelSize = canvasWidth / drawingCanvas.width;

  useEffect(() => {
    let canvas: HTMLCanvasElement = drawingCanvasRef.current!;
    drawingCanvas.ctx = canvas.getContext("2d");
    initializeDrawingCanvasMatrix();
  }, []);

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
    setDrawingCanvas({ ...drawingCanvas, matrix: newDrawingCanvasMatrix });
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
    setDrawingCanvas({ ...drawingCanvas, matrix: newDrawingCanvasMatrix });
  };

  const updateDrawingCanvas = (matrix: IPixel[][]) => {
    if (!drawingCanvas.matrix) return;

    const canvasWidth = drawingCanvas.width * drawingCanvas.scale;
    const canvasHeight = drawingCanvas.height * drawingCanvas.scale;
    const pixelSize = canvasWidth / drawingCanvas.width;

    drawingCanvas.ctx!.clearRect(0, 0, canvasWidth, canvasHeight);

    matrix.forEach((row, rowIndex) => {
      row.forEach((pixel, pixelIndex) => {
        if (!pixel.isFilled) return;

        drawingCanvas.ctx!.fillRect(pixel.x, pixel.y, pixelSize, pixelSize);
      });
    });
  };

  const fillDrawingCanvasPixel = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!drawingCanvas.matrix) return;

    const canvasWidth = drawingCanvas.width * drawingCanvas.scale;
    const pixelSize = canvasWidth / drawingCanvas.width;

    const pixelIndex = Math.floor(e.nativeEvent.offsetX / pixelSize);
    const rowIndex = Math.floor(e.nativeEvent.offsetY / pixelSize);

    const pixel = drawingCanvas.matrix[rowIndex][pixelIndex];
    pixel.isFilled = true;

    drawingCanvas.ctx!.fillRect(pixel.x, pixel.y, pixelSize, pixelSize);
  };

  const drawingCanvasHandler = (e: React.WheelEvent<HTMLDivElement>) => {
    if (Math.sign(e.deltaY) === -1)
      setDrawingCanvas({ ...drawingCanvas, scale: drawingCanvas.scale + 1 });

    if (Math.sign(e.deltaY) === 1)
      setDrawingCanvas({ ...drawingCanvas, scale: drawingCanvas.scale - 1 });
  };

  return (
    <main className="main">
      <div className="main__left-section"></div>
      <div
        className="main__middle-section"
        onWheel={(e) => drawingCanvasHandler(e)}
      >
        <canvas
          className="main__drawing-canvas"
          onClick={(e) => {
            fillDrawingCanvasPixel(e);
          }}
          width={drawingCanvas.width * drawingCanvas.scale}
          height={drawingCanvas.height * drawingCanvas.scale}
          ref={drawingCanvasRef}
        ></canvas>
      </div>
      <div className="main__right-section"></div>
    </main>
  );
};

export default Main;
