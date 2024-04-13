import { ICurrentToolParams } from "../../DrawingCanvas/models";

export const pickerTool = (params: ICurrentToolParams) => {
  if (params.e.type !== "pointerdown") return;

  const x = params.xIndex;
  const y = params.yIndex;
  const dispatch = params.dispatch;
  const presets = params.allPresetColors;
  const matrix = params.matrix;
  const r = matrix.red[x + y * params.width];
  const g = matrix.green[x + y * params.width];
  const b = matrix.blue[x + y * params.width];
  const a = matrix.alpha[x + y * params.width] / 255;

  const sameColor = presets.find((el) => {
    return el.r === r && el.g === g && el.b === b && el.a === a;
  });

  if (sameColor) {
    dispatch(params.setColorParams(sameColor));
  } else {
    dispatch(
      params.setColorParams({
        ...{ r, g, b, a },
        hueY: 0,
        palletX: null,
        palletY: null,
      })
    );
  }
};
