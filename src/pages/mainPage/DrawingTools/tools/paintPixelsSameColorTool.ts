import { ICurrentToolParams } from "../../DrawingCanvas/models";

export const paintPixelsSameColorTool = (params: ICurrentToolParams) => {
  if (!params.matrix) return;
  if (params.e.type !== "pointerdown") return;

  const x = params.xIndex;
  const y = params.yIndex;
  const matrix = params.matrix;
  const width = params.width;
  const height = params.height;

  if (x >= 0 && x < width && y >= 0 && y < height) {
    const [r1, g1, b1, a1] = matrix[y][x];
    const { r, g, b, a } = params.fillRectArgs.clickRGBA;
    const alpha = a * 255;

    matrix.forEach((row, rowIndex) => {
      row.forEach((pix, pixIndex) => {
        const [r2, g2, b2, a2] = pix;
        if (!(r1 === r2 && g1 === g2 && b1 === b2 && a1 === a2)) return;

        matrix[rowIndex][pixIndex] = [r, g, b, alpha];
      });
    });

    params.updateCanvas();
  }
};
