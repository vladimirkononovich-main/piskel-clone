export type RGBA = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type ColorParams = {
  r: number;
  g: number;
  b: number;
  a: number;
  palletX: number | null;
  palletY: number | null;
  hueY: number;
};

export type ColorPickerState = {
  leftColorParams: ColorParams;
  rightColorParams: ColorParams;
  presetColorsLeft: ColorParams[];
  presetColorsRight: ColorParams[];
  paletteSize: {
    height: number;
    width: number;
  };
  hueSliderSize: {
    height: number,
    width: number
  }
};

export type MenuVisibility = {
  visibleLeft: boolean;
  visibleRight: boolean;
};
