import classNames from "classnames";
import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { FrameProps } from "./models";
import { setSelectedFrameIndex } from "./previewListSlice";

const Frame = ({
  isSelected,
  index,
  frame,
  copyFrame,
  deleteFrame,
}: FrameProps) => {
  const dispatch = useAppDispatch();
  const canvasRef = useRef(null);
  const { height, width } = useAppSelector((state) => state.drawingCanvas);

  let canvasNode: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  useEffect(() => {
    canvasNode = canvasRef.current!;
    ctx = canvasNode.getContext("2d")!;

    canvasNode.width = 96;
    canvasNode.height = 96;
  });

  useEffect(() => {
    drawImage();
  });

  const drawImage = () => {
    const sourceImageData = new ImageData(width, height);
    const sourceData = sourceImageData.data;

    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = width;
    tempCanvas.height = height;

    for (let i = 0; i < width * height; i++) {
      sourceData[i * 4] = frame.red[i];
      sourceData[i * 4 + 1] = frame.green[i];
      sourceData[i * 4 + 2] = frame.blue[i];
      sourceData[i * 4 + 3] = frame.alpha[i];
    }

    tempCtx!.putImageData(sourceImageData, 0, 0);
    ctx.drawImage(tempCanvas, 0, 0, width, height, 0, 0, 96, 96);
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
};

export default Frame;
