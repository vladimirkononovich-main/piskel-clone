import { ICurrentToolParams } from "../../DrawingCanvas/models";

export const paintPixelsSameColorTool = (params: ICurrentToolParams) => {
  if (params.e.type !== "pointerdown") return;

  const x = params.xIndex;
  const y = params.yIndex;
  const matrix = params.matrix;
  const width = params.width;
  const height = params.height;

  if (x >= 0 && x < width && y >= 0 && y < height) {
    const r1 = matrix.red[x + width * y];
    const g1 = matrix.green[x + width * y];
    const b1 = matrix.blue[x + width * y];
    const a1 = matrix.alpha[x + width * y];

    const { r, g, b, a } = params.fillRectArgs.clickRGBA;
    const alpha = a * 255;

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const r2 = matrix.red[col + width * row];
        const g2 = matrix.green[col + width * row];
        const b2 = matrix.blue[col + width * row];
        const a2 = matrix.alpha[col + width * row];

        if (!(r1 === r2 && g1 === g2 && b1 === b2 && a1 === a2)) continue;

        matrix.red[col + width * row] = r;
        matrix.green[col + width * row] = g;
        matrix.blue[col + width * row] = b;
        matrix.alpha[col + width * row] = alpha;
      }
    }

    params.drawVisibleArea(
      height,
      width,
      params.ctx,
      params.rowsColsValues,
      matrix
    );
  }
};
