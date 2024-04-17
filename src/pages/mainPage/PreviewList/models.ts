import { Matrix } from "../DrawingCanvas/models";

export type FrameProps = {
  copyFrame: (frame: Matrix, index: number) => void;
  deleteFrame: (index: number) => void;
  isSelected: boolean;
  index: number;
  frame: Matrix;
};

export type PreviewListInitState = {
  selectedFrameIndex: number;
  framesQuantity: number;
  firstRenderedFrameIndex: number;
  lastRenderedFrameIndex: number;
  frameHashes: string[];
};
