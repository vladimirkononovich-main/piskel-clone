import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { CSSProperties } from "react";
import { ColorParams} from "../models";

export type SketchPickerProps = {
  setColorParams: ActionCreatorWithPayload<
    ColorParams,
    "colorPicker/setLeftColorParams" | "colorPicker/setRightColorParams"
  >;
  colorParams: ColorParams;
  presetColors: ColorParams[];
  styles: CSSProperties;
  palettePos: { x: number | null; y: number | null };
  isVisible: boolean;
  hueY: number;
  hueDeg: number;
  setHueDeg: React.Dispatch<React.SetStateAction<number>>;
  setHueY: React.Dispatch<React.SetStateAction<number>>;
  setPalettePos: React.Dispatch<React.SetStateAction<{ x: number | null; y: number | null }>>;
};
