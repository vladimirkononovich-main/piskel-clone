import React, { forwardRef, useEffect, useRef, useState } from "react";
import "./main.css";

interface IPixel {
  x: number;
  y: number;
  isFilled: boolean;
}

const Main = () => {
  const drawingCanvasRef = useRef(null);
  const [drawingCanvasSize, setDrawingCanvasSize] = useState({
    width: 50,
    height: 40,
  });
  const [drawingCanvasScale, setDrawingCanvasScale] = useState(20);
  const [drawingCanvasMatrix, setDrawingCanvasMatrix] = useState<
    IPixel[][] | null
  >(null);

  let drawingCanvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  useEffect(() => {
    drawingCanvas = drawingCanvasRef.current!;
    ctx = drawingCanvas.getContext("2d")!;
  });

  useEffect(() => {
    initializeDrawingCanvas();
  }, [drawingCanvasScale]);

  useEffect(() => {
    updateDrawingCanvas();
  }, [drawingCanvasMatrix]);

  const initializeDrawingCanvas = () => {
    const canvasWidth = drawingCanvasSize.width * drawingCanvasScale;
    const pixelSize = canvasWidth / drawingCanvasSize.width;

    if (drawingCanvasMatrix)
      drawingCanvasMatrix.length = drawingCanvasSize.height;

    const rows: IPixel[][] =
      drawingCanvasMatrix || Array(drawingCanvasSize.height);

    const newDrawingCanvasMatrix: IPixel[][] = Array.from(
      rows,
      (row, rowIndex) => {
        if (drawingCanvasMatrix) {
          drawingCanvasMatrix[rowIndex].length = drawingCanvasSize.width;

          return Array.from(row, (pixel, pixelIndex) => {
            return {
              ...pixel,
              y: rowIndex * pixelSize,
              x: pixelIndex * pixelSize,
            };
          });
        }

        return Array.from(
          Array(drawingCanvasSize.width),
          (pixel, pixelIndex) => {
            return {
              y: rowIndex * pixelSize,
              x: pixelIndex * pixelSize,
              isFilled: false,
            };
          }
        );
      }
    );

    setDrawingCanvasMatrix(newDrawingCanvasMatrix);
  };

  const updateDrawingCanvas = () => {
    if (!drawingCanvas) return;
    if (!drawingCanvasMatrix) return;

    const canvasWidth = drawingCanvasSize.width * drawingCanvasScale;
    const canvasHeight = drawingCanvasSize.height * drawingCanvasScale;
    const pixelSize = canvasWidth / drawingCanvasSize.width;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    drawingCanvasMatrix.forEach((row, rowIndex) => {
      row.forEach((pixel, pixelIndex) => {
        if (!pixel.isFilled) return;

        ctx.fillRect(pixel.x, pixel.y, pixelSize, pixelSize);
      });
    });
  };

  const fillDrawingCanvasPixel = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!drawingCanvasMatrix) return;

    const canvasWidth = drawingCanvasSize.width * drawingCanvasScale;
    const pixelSize = canvasWidth / drawingCanvasSize.width;

    const pixelIndex = Math.floor(e.nativeEvent.offsetX / pixelSize);
    const rowIndex = Math.floor(e.nativeEvent.offsetY / pixelSize);

    const pixel = drawingCanvasMatrix[rowIndex][pixelIndex];
    pixel.isFilled = true;

    ctx.fillRect(pixel.x, pixel.y, pixelSize, pixelSize);
  };

  const drawingCanvasHandler = (e: React.WheelEvent<HTMLDivElement>) => {
    if (Math.sign(e.deltaY) === -1)
      setDrawingCanvasScale(drawingCanvasScale + 1);

    if (Math.sign(e.deltaY) === 1)
      setDrawingCanvasScale(drawingCanvasScale - 1);
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
          width={drawingCanvasSize.width * drawingCanvasScale}
          height={drawingCanvasSize.height * drawingCanvasScale}
          ref={drawingCanvasRef}
        ></canvas>
      </div>
      <div className="main__right-section"></div>
    </main>
  );
};

export default Main;
