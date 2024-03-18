import { ICurrentToolParams } from "../../DrawingCanvas/models";

export const pickerTool = (params: ICurrentToolParams) => {
  if (!params.matrix) return;
  if (params.e.type !== "pointerdown") return;

  const x = params.xIndex;
  const y = params.yIndex;
  const dispatch = params.dispatch;
  const presets = params.allPresetColors;
  const [r, g, b, a] = params.matrix[y][x];
  const alpha = a / 255;

  const sameColor = presets.find((el) => {
    return el.r === r && el.g === g && el.b === b && el.a === alpha;
  });

  if (sameColor) {
    dispatch(params.setColorParams(sameColor));
  } else {
    dispatch(
      params.setColorParams({
        ...{ r, g, b, a: alpha },
        hueY: 0,
        palletX: null,
        palletY: null,
      })
    );
  }
};
