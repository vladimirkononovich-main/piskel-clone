import { ICurrentToolParams, Matrix } from "../../DrawingCanvas/models";

export const moveTool = (params: ICurrentToolParams) => {
  const matrix = params.matrix;
  const x = params.xIndex;
  const y = params.yIndex;
  const ctx = params.ctx;
  const width = params.width;
  const height = params.height;
  const start = params.pointerStart;
  const rowsColsValues = params.rowsColsValues;
  const drawVisibleArea = params.drawVisibleArea;

  const copyRed = new Uint8ClampedArray(width * height);
  const copyGreen = new Uint8ClampedArray(width * height);
  const copyBlue = new Uint8ClampedArray(width * height);
  const copyAlpha = new Uint8ClampedArray(width * height);

  if (params.e.type === "pointerdown") {
    start.x = x;
    start.y = y;
    return;
  }

  if (start.x !== null && start.y !== null) {
    const shiftX = x - start.x;
    const shiftY = y - start.y;

    const red = matrix.red;
    const green = matrix.green;
    const blue = matrix.blue;
    const alpha = matrix.alpha;

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const r = red[col + width * row];
        const g = green[col + width * row];
        const b = blue[col + width * row];
        const a = alpha[col + width * row];

        if (col + shiftX >= width) continue;
        if (row + shiftY >= height) continue;
        if (col + shiftX < 0) continue;
        if (row + shiftY < 0) continue;

        copyRed[col + shiftX + width * (row + shiftY)] = r;
        copyGreen[col + shiftX + width * (row + shiftY)] = g;
        copyBlue[col + shiftX + width * (row + shiftY)] = b;
        copyAlpha[col + shiftX + width * (row + shiftY)] = a;
      }
    }
    const copyMatrix: Matrix = {
      red: copyRed,
      green: copyGreen,
      blue: copyBlue,
      alpha: copyAlpha,
    };

    drawVisibleArea(height, width, ctx, rowsColsValues, copyMatrix, params.scale);
  }

  if (params.e.type === "pointerup") {
    start.x = null;
    start.y = null;

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const r = copyRed[col + width * row];
        const g = copyGreen[col + width * row];
        const b = copyBlue[col + width * row];
        const a = copyAlpha[col + width * row];

        matrix.red[col + width * row] = r;
        matrix.green[col + width * row] = g;
        matrix.blue[col + width * row] = b;
        matrix.alpha[col + width * row] = a;
      }
    }

    return;
  }
};
