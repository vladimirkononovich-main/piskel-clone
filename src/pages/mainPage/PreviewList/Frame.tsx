import classNames from "classnames";
import React, { createElement, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { framesPNG } from "../frames/framesPNG";
import { FrameProps } from "./models";
import { setSelectedFrameIndex } from "./previewListSlice";
import pica from "pica";

const Frame = React.memo(
  ({ isSelected, index, frame, copyFrame, deleteFrame, hash }: FrameProps) => {
    const dispatch = useAppDispatch();
    const canvasRef = useRef(null);
    const { height, width } = useAppSelector((state) => state.drawingCanvas);
    const { frameHashes } = useAppSelector((state) => state.previewList);

    let canvasNode: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;

    useEffect(() => {
      canvasNode = canvasRef.current!;
      ctx = canvasNode.getContext("2d", { willReadFrequently: true })!;
      canvasNode.width = 96;
      canvasNode.height = 96;
    }, [frameHashes[index]]);

    useEffect(() => {
      drawImage();
      createMiniMapImgPNG();
    }, [frameHashes[index]]);

    const createNewImageData = (
      ratioX: number,
      ratioY: number,
      finalWidth: number,
      finalHeight: number,
      ctx: CanvasRenderingContext2D
    ): ImageData => {
      const imageData = ctx.getImageData(0, 0, finalWidth, finalHeight);
      const data = imageData.data;

      for (let i = 0; i < finalWidth * finalHeight; i++) {
        const y = Math.floor(i / finalWidth);
        const x = i % finalWidth;

        const r = frame.red[x * ratioX + y * ratioY * width];
        const g = frame.green[x * ratioX + y * ratioY * width];
        const b = frame.blue[x * ratioX + y * ratioY * width];
        const a = frame.alpha[x * ratioX + y * ratioY * width];

        data[(y * finalWidth + x) * 4 + 0] = r;
        data[(y * finalWidth + x) * 4 + 1] = g;
        data[(y * finalWidth + x) * 4 + 2] = b;
        data[(y * finalWidth + x) * 4 + 3] = a;
      }

      return imageData;
    };

    const scaleImage = async (
      srcCanvas: HTMLCanvasElement,
      destCanvas: HTMLCanvasElement
    ) => {
      const picaInstance = pica();
      await picaInstance.resize(srcCanvas, destCanvas);
    };

    const drawImage = () => {
      const ratioX = Math.floor(width / 96);
      const ratioY = Math.floor(height / 96);

      const newImageData = createNewImageData(ratioX, ratioY, 96, 96, ctx);
      ctx.putImageData(newImageData, 0, 0);
    };

    const createMiniMapImgPNG = async () => {
      const ratioX = Math.floor(width / 200);
      const ratioY = Math.floor(height / 200);

      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext("2d", {
        willReadFrequently: true,
      })!;

      if (height < 200 || width < 200) {
        const bigCanvas = document.createElement("canvas");
        bigCanvas.width = 200;
        bigCanvas.height = 200;

        const smallCanvas = document.createElement("canvas");
        smallCanvas.width = width;
        smallCanvas.height = height;
        const smallCtx = smallCanvas.getContext("2d", {
          willReadFrequently: true,
        })!;

        const newImageData = createNewImageData(1, 1, width, height, smallCtx);
        smallCtx.putImageData(newImageData, 0, 0);

        await scaleImage(smallCanvas, bigCanvas).then(() => {
          framesPNG[index] = bigCanvas.toDataURL("image/png");
        });

        return;
      }

      const newImageData = createNewImageData(ratioX, ratioY, 200, 200, ctx);
      ctx.putImageData(newImageData, 0, 0);

      return canvas.toDataURL("image/png");
    };

    return (
      <div
        className={classNames("main__preview-list-frame", {
          "main__preview-list-frame_selected": isSelected,
        })}
        onClick={() => dispatch(setSelectedFrameIndex(index))}
      >
        <canvas ref={canvasRef}></canvas>
        <div className="frame-number">{index + 1}</div>
        <div
          className="delete-frame-btn"
          onClick={(e) => {
            e.stopPropagation();
            deleteFrame(index);
          }}
        ></div>
        <div
          className="duplicate-frame-btn"
          onClick={(e) => {
            e.stopPropagation();
            copyFrame(frame, index);
          }}
        ></div>
      </div>
    );
  },
  (prevProps, currProps) => {
    return (
      prevProps.isSelected === currProps.isSelected &&
      prevProps.hash === currProps.hash
    );
  }
);

export default Frame;
