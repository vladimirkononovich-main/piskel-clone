import classNames from "classnames";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { Matrix } from "../DrawingCanvas/models";
import { createNewFrame, frames } from "../frames/frames";
import Frame from "./Frame";
import "./previewList.css";
import {
  setSelectedFrameIndex,
  incrementFramesQuantity,
  setRenderedFramesIndexes,
  addFrameHash,
  deleteFrameHash,
} from "./previewListSlice";

import { v4 as uuidv4 } from "uuid";
import { framesPNG } from "../frames/framesPNG";

const PreviewList = () => {
  const {
    selectedFrameIndex,
    framesQuantity,
    frameHashes,
    lastRenderedFrameIndex,
  } = useAppSelector((state) => state.previewList);
  const { height, width } = useAppSelector((state) => state.drawingCanvas);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const hash = uuidv4();

    dispatch(addFrameHash({ frameIndex: 0, hash }));
    dispatch(incrementFramesQuantity(1));
    dispatch(setRenderedFramesIndexes({ first: 0, last: frames.length - 1 }));
  }, []);

  const addFrameHandler = () => {
    const newFrame = createNewFrame(width, height);
    const hash = uuidv4();
    frames.push(newFrame);

    dispatch(addFrameHash({ frameIndex: framesQuantity, hash }));
    dispatch(incrementFramesQuantity(1));
    dispatch(setRenderedFramesIndexes({ first: 0, last: frames.length - 1 }));
  };

  const copyFrame = (frame: Matrix, index: number) => {
    const newFrame: Matrix = {
      red: new Uint8ClampedArray(frame.red),
      green: new Uint8ClampedArray(frame.green),
      blue: new Uint8ClampedArray(frame.blue),
      alpha: new Uint8ClampedArray(frame.alpha),
    };

    const hash = uuidv4();
    frames.splice(index, 0, newFrame);

    dispatch(addFrameHash({ frameIndex: index + 1, hash }));
    dispatch(incrementFramesQuantity(1));
    dispatch(setRenderedFramesIndexes({ first: 0, last: frames.length - 1 }));
  };

  const deleteFrame = (index: number) => {
    if (frames.length === 1) return;

    if (
      index === selectedFrameIndex ||
      selectedFrameIndex === lastRenderedFrameIndex
    ) {
      if (selectedFrameIndex !== 0) {
        dispatch(setSelectedFrameIndex(selectedFrameIndex - 1));
      }
    }

    frames.splice(index, 1);
    framesPNG.splice(index, 1);


    dispatch(deleteFrameHash(index));
    dispatch(incrementFramesQuantity(1));
    dispatch(setRenderedFramesIndexes({ first: 0, last: frames.length - 1 }));
  };

  
  return (
    <div className="main__preview-list">
      {frames.map((frame, i) => {
        const hash = frameHashes[i];
        return (
          <Frame
            copyFrame={copyFrame}
            deleteFrame={deleteFrame}
            isSelected={selectedFrameIndex === i}
            index={i}
            frame={frame}
            hash={hash}
            key={i}
          />
        );
      })}

      <button
        type="button"
        className="main__add-frame-btn"
        onClick={addFrameHandler}
      >
        <div className="icon"></div>
        <div className="label">Add new frame</div>
      </button>
    </div>
  );
};

export default PreviewList;
