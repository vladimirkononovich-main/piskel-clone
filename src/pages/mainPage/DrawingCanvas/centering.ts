import { CanvasPosition, CenteringParams, RowsColsValues } from "./models";

export const centerRelativeToPixelInY = (params: {
  e: React.WheelEvent<HTMLCanvasElement>;
  pos: CanvasPosition;
  height: number;
  prevScale: number;
  newScale: number;
  visibleH: number;
  rowsColsValues: RowsColsValues | null;
}) => {
  const e = params.e;
  const pos = params.pos;
  const height = params.height;
  const prevScale = params.prevScale;
  const newScale = params.newScale;
  const visibleH = params.visibleH;
  const rowsColsValues = params.rowsColsValues!;

  const prevRowsHeightValues = rowsColsValues[prevScale].rows;
  const newRowsHeightValues = rowsColsValues[newScale].rows;

  const offsetY = e.nativeEvent.offsetY;
  const scaledH = Math.floor(height * newScale);
  const intervalY = Math.abs(Math.min(pos.top, 0)) + offsetY;

  let yIndex = 0;
  let sum = 0;
  let remainder = 0;

  for (let i = 0; i < height; i++) {
    sum += prevRowsHeightValues[i];
    if (sum >= intervalY) {
      yIndex = i;
      remainder = intervalY - (sum - prevRowsHeightValues[i]);
      break;
    }
  }

  let newSum = 0;
  for (let i = 0; i < yIndex; i++) newSum += newRowsHeightValues[i];
  newSum += remainder;

  const newTopPos = offsetY - newSum;
  const newBotPos = visibleH - (Math.min(newTopPos, 0) + scaledH);

  if (newTopPos > 0 && newBotPos < 0) {
    pos.top = 0;
    pos.bot = visibleH - scaledH;
    return;
  }
  if (newTopPos < 0 && newBotPos > 0) {
    pos.top = visibleH - scaledH;
    pos.bot = 0;
    return;
  }

  pos.top = newTopPos;
  pos.bot = newBotPos;
};

export const centerRelativeToPixelInX = (params: {
  e: React.WheelEvent<HTMLCanvasElement>;
  pos: CanvasPosition;
  width: number;
  prevScale: number;
  newScale: number;
  visibleW: number;
  rowsColsValues: RowsColsValues | null;
}) => {
  const e = params.e;
  const pos = params.pos;
  const width = params.width;
  const prevScale = params.prevScale;
  const newScale = params.newScale;
  const visibleW = params.visibleW;
  const rowsColsValues = params.rowsColsValues;

  const prevColsWidthValues = rowsColsValues![prevScale].cols;
  const newColsWidthValues = rowsColsValues![newScale].cols;

  const offsetX = e.nativeEvent.offsetX;
  const scaledW = Math.floor(width * newScale);
  const intervalW = Math.abs(Math.min(pos.left, 0)) + offsetX;

  let xIndex = 0;
  let sum = 0;
  let remainder = 0;

  for (let i = 0; i < width; i++) {
    sum += prevColsWidthValues[i];

    if (sum >= intervalW) {
      xIndex = i;
      remainder = intervalW - (sum - prevColsWidthValues[i]);
      break;
    }
  }

  let newSum = 0;
  for (let i = 0; i < xIndex; i++) newSum += newColsWidthValues[i];
  newSum += remainder;

  const newLeftPos = offsetX - newSum;
  const newRightPos = visibleW - (Math.min(newLeftPos, 0) + scaledW);

  if (newLeftPos > 0 && newRightPos < 0) {
    pos.left = 0;
    pos.right = visibleW - scaledW;
    return;
  }
  if (newLeftPos < 0 && newRightPos > 0) {
    pos.left = visibleW - scaledW;
    pos.right = 0;
    return;
  }
  pos.left = newLeftPos;
  pos.right = newRightPos;
};

export const centerOnXAxis = (
  parentW: number,
  width: number,
  position: CanvasPosition
) => {
  position.left = Math.floor(parentW / 2 - width / 2);
  position.right = Math.ceil(parentW / 2 - width / 2);
};

export const centerOnYAxis = (
  parentH: number,
  height: number,
  position: CanvasPosition
) => {
  position.top = Math.floor(parentH / 2 - height / 2);
  position.bot = Math.ceil(parentH / 2 - height / 2);
};

export const centerTheCanvas = ({
  canvasEvent,
  scaledH,
  scaledW,
  parentW,
  parentH,
  prevScaledW,
  prevScaledH,
  position,
  prevScale,
  scale,
  rowsColsValues,
  height,
  width,
  visibleH,
  visibleW,
}: CenteringParams) => {
  if (canvasEvent === "init") centerOnYAxis(parentH, scaledH, position);
  if (canvasEvent === "init") centerOnXAxis(parentW, scaledW, position);

  if (canvasEvent && canvasEvent !== "init") {
    const prevHLess = prevScaledH < parentH;
    const prevHMore = prevScaledH > parentH;
    const currHLess = scaledH < parentH;
    const currHMore = scaledH > parentH;
    const equalH = scaledH === parentH;

    const prevWLess = prevScaledW < parentW;
    const prevWMore = prevScaledW > parentW;
    const currWLess = scaledW < parentW;
    const currWMore = scaledW > parentW;
    const equalW = scaledW === parentW;

    const e = canvasEvent as React.WheelEvent<HTMLCanvasElement>;

    const commonParams = {
      e,
      pos: position,
      prevScale,
      newScale: scale,
      rowsColsValues,
    };

    const yParams = {
      ...commonParams,
      height,
      visibleH,
    };

    const xParams = {
      ...commonParams,
      width,
      visibleW,
    };

    if (prevHLess || equalH || currHLess) {
      centerOnYAxis(parentH, scaledH, position);
    }
    if (prevWLess || equalW || currWLess) {
      centerOnXAxis(parentW, scaledW, position);
    }
    if (prevHMore && currHLess) centerOnYAxis(parentH, scaledH, position);
    if (prevWMore && currWLess) centerOnXAxis(parentW, scaledW, position);
    if (prevHMore && currHMore) centerRelativeToPixelInY(yParams);
    if (prevWMore && currWMore) centerRelativeToPixelInX(xParams);
  }
};
