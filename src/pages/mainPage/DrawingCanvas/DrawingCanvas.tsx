import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { RootState } from "../../../store";
import {
  setLeftColorParams,
  setRightColorParams,
} from "../ColorPicker/colorPickerSlice";
import { ColorParams } from "../ColorPicker/models";
import { drawingToolFunctions } from "../DrawingTools/tools";
import { RGBA } from "../models";
import { setScale } from "./drawingCanvasSlice";
import {
  IDrawingCanvasProps,
  IScalingParams,
  DrawingCanvasMatrix,
  IDrawingToolFunctions,
  ICurrentToolParams,
  IFillRectArgs,
  PixelPosition,
  ActionColorParams,
} from "./models";
import { getFillRectXY } from "./prefillingTheRectangle";

export let matrix: DrawingCanvasMatrix = null;
export let top: number;
export let left: number;
export let right: number;
export let bottom: number;
export let scale: number;

export let firstPixelPos: PixelPosition = {
  xIndex: null,
  yIndex: null,
};

const DrawingCanvas = React.forwardRef(
  (
    { parentRef, parentCoordinates }: IDrawingCanvasProps,
    drawingCanvasRef: React.ForwardedRef<HTMLCanvasElement>
  ) => {
    const [scalingParams, setScalingParams] = useState<IScalingParams | null>(
      null
    );
    const { currentToolName } = useAppSelector(
      (state: RootState) => state.drawingTools
    );
    const {
      leftColorParams,
      rightColorParams,
      presetColorsLeft,
      presetColorsRight,
    } = useAppSelector((state: RootState) => state.colorPicker);
    const dispatch = useAppDispatch();
    const drawingCanvas = useAppSelector(
      (state: RootState) => state.drawingCanvas
    );
    const currentTool =
      drawingToolFunctions[currentToolName as keyof IDrawingToolFunctions];

    scale = drawingCanvas.scale;
    let drawingCanvasHTML: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;

    let parent: HTMLDivElement;
    let parentWidth: number;
    let parentHeight: number;
    let visibleWidth: number;
    let visibleHeight: number;

    const cropped = useMemo(() => {
      return {
        top: scale,
        right: scale,
        bott: scale,
        left: scale,
      };
    }, [scale]);

    const overflow = useMemo(() => {
      return {
        top: 0,
        right: 0,
        bott: 0,
        left: 0,
      };
    }, []);

    let widthToScale = drawingCanvas.width * drawingCanvas.scale;
    let heightToScale = drawingCanvas.height * drawingCanvas.scale;
    const height = drawingCanvas.height;
    const width = drawingCanvas.width;

    useEffect(() => {
      drawingCanvasHTML = (
        drawingCanvasRef as React.MutableRefObject<HTMLCanvasElement>
      ).current;
      parent = parentRef.current!;

      parentWidth = parent.clientWidth;
      parentHeight = parent.clientHeight;

      visibleWidth = Math.min(right, parentWidth) - Math.max(left, 0);
      visibleHeight = Math.min(bottom, parentHeight) - Math.max(top, 0);

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
          return [0, 0, 0, 0];
        });
      });
    };

    const updateCanvas = () => {
      if (!matrix) return;
      if (!visibleHeight || !visibleWidth) return;

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
            const pixel = matrix[y][x];
            let width = 4 * scale;

            if (x === xStart) width = 4 * cropped.left;
            if (x === xEnd) width = 4 * cropped.right;

            for (let w = 1; w <= width; w++) {
              if (w % 4 === 0) {
                imageData.data[curr - 3] = pixel[0];
                imageData.data[curr - 2] = pixel[1];
                imageData.data[curr - 1] = pixel[2];
                imageData.data[curr] = pixel[3];
              }
              curr += 1;
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
    };

    const calculateInitialScale = () => {
      const w = drawingCanvas.width;
      const h = drawingCanvas.height;
      const w2 = parentWidth;
      const h2 = parentHeight;
      const minScale = 1;
      const maxScale = 100;

      let dividend = w2 - w <= h2 - h ? w2 : h2;
      let divisor = w2 - w <= h2 - h ? w : h;
      let initScale = Math.floor(dividend / divisor);

      if (initScale < minScale) initScale = minScale;
      if (initScale > maxScale) initScale = maxScale;

      dispatch(setScale(initScale));

      return initScale;
    };

    const centerTheCanvas = () => {
      scale = calculateInitialScale();
      widthToScale = drawingCanvas.width * scale;
      heightToScale = drawingCanvas.height * scale;
      visibleWidth = Math.min(widthToScale, parentWidth);
      visibleHeight = Math.min(heightToScale, parentHeight);

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

    const pointerHandler = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (e.buttons === 0 && e.type !== "pointerup") return;

      const offsetX = e.nativeEvent.offsetX;
      const offsetY = e.nativeEvent.offsetY;
      const xIndex = Math.floor(
        ((left < 0 ? Math.abs(left) : 0) + offsetX) / scale
      );
      const yIndex = Math.floor(
        ((top < 0 ? Math.abs(top) : 0) + offsetY) / scale
      );
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
        ...getFillRectXY(xIndex, yIndex, scale),
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
        matrix,
        scale: drawingCanvas.scale,
        ctx,
        width,
        height,
        firstPixelPos,
        dispatch,
        allPresetColors,
        currPreset,
        setColorParams,
        updateCanvas,
      };

      currentTool(args);
    };

    const onWheelHandler = (e: React.WheelEvent<HTMLCanvasElement>) => {
      e.stopPropagation();
      setScalingParams({ prevScale: scale, event: e });

      const w = drawingCanvas.width;
      const h = drawingCanvas.height;
      const w2 = parentWidth;
      const h2 = parentHeight;

      if (!w || !h || !w2 || !h2) return;

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

    // console.log(
    //   "RERENDER",
    //   "cropped",
    //   cropped,
    //   "visibleHeight",
    //   visibleHeight!
    // );

    return (
      <canvas
        onWheel={onWheelHandler}
        onPointerMove={pointerHandler}
        onPointerDown={pointerHandler}
        onPointerUp={pointerHandler}
        onContextMenu={(e) => e.preventDefault()}
        className="main__drawing-canvas"
        ref={drawingCanvasRef}
      ></canvas>
    );
  }
);

export default DrawingCanvas;
