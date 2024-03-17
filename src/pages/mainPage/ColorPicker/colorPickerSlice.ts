import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { ColorParams, ColorPickerState } from "./models";

const presetColors: ColorParams[] = [
  { r: 0, g: 0, b: 0, a: 0, palletX: null, palletY: null, hueY: 0 },
  { r: 0, g: 0, b: 0, a: 1, palletX: 0, palletY: 136, hueY: 0 },
];
const initialState: ColorPickerState = {
  leftColorParams: {
    r: 0,
    g: 0,
    b: 0,
    a: 1,
    palletX: 0,
    palletY: 136,
    hueY: 0,
  },
  rightColorParams: {
    r: 0,
    g: 0,
    b: 0,
    a: 0,
    palletX: null,
    palletY: null,
    hueY: 0,
  },
  presetColorsLeft: presetColors,
  presetColorsRight: presetColors,
  paletteSize: {
    height: 136,
    width: 136,
  },
  hueSliderSize: {
    height: 136,
    width: 28,
  },
};

export const colorPickerSlice = createSlice({
  name: "colorPicker",
  initialState,
  reducers: {
    setLeftColorParams: (state, action: PayloadAction<ColorParams>) => {
      state.leftColorParams = action.payload;
    },
    setRightColorParams: (state, action: PayloadAction<ColorParams>) => {
      state.rightColorParams = action.payload;
    },

    addColorToPresetLeft: (state, action: PayloadAction<ColorParams>) => {
      const params = action.payload;
      const { r, g, b, a } = params;

      const presetColors = current(state.presetColorsLeft);
      const isSameColor = presetColors.some((el) => {
        return el.r === r && el.g === g && el.b === b && el.a === a;
      });
      if (isSameColor) return;
      if (presetColors.length === 6) {
        state.presetColorsLeft.splice(1, 0, { ...params });
        state.presetColorsLeft.pop();
        return;
      }
      state.presetColorsLeft.push({ ...params });
    },

    addColorToPresetRight: (state, action: PayloadAction<ColorParams>) => {
      const params = action.payload;
      const { r, g, b, a } = params;

      const presetColors = current(state.presetColorsRight);
      const isSameColor = presetColors.some((el) => {
        return el.r === r && el.g === g && el.b === b && el.a === a;
      });
      if (isSameColor) return;
      if (presetColors.length === 6) {
        state.presetColorsRight.splice(1, 0, { ...params });
        state.presetColorsRight.pop();
        return;
      }
      state.presetColorsRight.push({ ...params });
    },
  },
});

export const {
  setLeftColorParams,
  setRightColorParams,
  addColorToPresetLeft,
  addColorToPresetRight,
} = colorPickerSlice.actions;
export default colorPickerSlice.reducer;
