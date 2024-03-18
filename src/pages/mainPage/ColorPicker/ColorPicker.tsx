import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { RootState } from "../../../store";
import "./colorPicker.css";
import {
  addColorToPresetLeft,
  addColorToPresetRight,
  setLeftColorParams,
  setRightColorParams,
} from "./colorPickerSlice";
import { MenuVisibility, RGBA } from "./models";
import SketchPicker from "./SkecthPicker/SketchPicker";
import opacityBackground from "../../../assets/color-picker-opacity-background.png";
import { SketchPickerProps } from "./SkecthPicker/models";
import chroma from "chroma-js";

const parseRGBAtoString = ({ r, g, b, a }: RGBA) => {
  return `rgba(${r},${g},${b},${a})`;
};

const pickerLeftStyles = {
  left: "-2px",
  top: "-200px",
};

const pickerRightStyles = {
  left: "15px",
  top: "-175px",
};

export const ColorPicker = () => {
  const dispatch = useAppDispatch();
  const {
    leftColorParams,
    rightColorParams,
    presetColorsLeft,
    presetColorsRight,
    paletteSize,
    hueSliderSize,
  } = useAppSelector((state: RootState) => state.colorPicker);
  const [menuVisibility, setMenuVisibility] = useState<MenuVisibility>({
    visibleLeft: false,
    visibleRight: false,
  });
  const [colorLeft, setColorLeft] = useState(
    chroma(parseRGBAtoString(leftColorParams)).hex()
  );
  const [colorRight, setColorRight] = useState(
    chroma(parseRGBAtoString(rightColorParams)).hex()
  );

  const [hueDegLeft, setHueDegLeft] = useState(0);
  const [hueDegRight, setHueDegRight] = useState(0);
  const [hueYleft, setHueYleft] = useState(0);
  const [hueYright, setHueYright] = useState(0);
  const [palettePosLeft, setPalettePosLeft] = useState<{
    x: number | null;
    y: number | null;
  }>({ x: 0, y: paletteSize.height });
  const [palettePosRight, setPalettePosRight] = useState<{
    x: number | null;
    y: number | null;
  }>({ x: null, y: null });

  useEffect(() => {
    if (menuVisibility.visibleLeft) return;
    dispatch(addColorToPresetLeft(leftColorParams));
  }, [menuVisibility.visibleLeft]);

  useEffect(() => {
    if (menuVisibility.visibleRight) return;
    dispatch(addColorToPresetRight(rightColorParams));
  }, [menuVisibility.visibleRight]);

  useEffect(() => {
    const x = palettePosLeft.x;
    const y = palettePosLeft.y;
    const { r, g, b, a } = leftColorParams;
    setColorLeft(calculateColorHEX(x, y, hueDegLeft, r, g, b, a));
  }, [hueYleft, palettePosLeft, hueDegLeft]);

  useEffect(() => {
    const x = palettePosRight.x;
    const y = palettePosRight.y;
    const { r, g, b, a } = rightColorParams;
    setColorRight(calculateColorHEX(x, y, hueDegRight, r, g, b, a));
  }, [hueYright, palettePosRight, hueDegRight]);

  useEffect(() => {
    const { palletX, palletY, hueY } = leftColorParams;
    const hueDeg = Math.round((360 / hueSliderSize.height) * hueY);
    setPalettePosLeft({ x: palletX, y: palletY });
    setHueYleft(hueY);
    setHueDegLeft(hueDeg);
    setColorLeft(chroma(parseRGBAtoString(leftColorParams)).hex());
    dispatch(addColorToPresetLeft(leftColorParams));
  }, [leftColorParams]);

  useEffect(() => {
    const { palletX, palletY, hueY } = rightColorParams;
    const hueDeg = Math.round((360 / hueSliderSize.height) * hueY);
    setPalettePosRight({ x: palletX, y: palletY });
    setHueYright(hueY);
    setHueDegRight(hueDeg);
    setColorRight(chroma(parseRGBAtoString(rightColorParams)).hex());
    dispatch(addColorToPresetRight(rightColorParams));
  }, [rightColorParams]);

  const hideSettingsMenu = useCallback(() => {
    setMenuVisibility({ visibleLeft: false, visibleRight: false });
    document.body.removeEventListener("click", hideSettingsMenu);
  }, []);

  const calculateColorHEX = (
    x: number | null,
    y: number | null,
    hueDeg: number,
    r: number,
    g: number,
    b: number,
    a: number
  ) => {
    if (x === null && y === null && a === 0) return "#00000000";
    if (x === null && y === null && a !== 0) {
      return chroma(parseRGBAtoString({ r, g, b, a })).hex();
    }

    const hueColor = chroma.hsl(hueDeg, 1, 0.5);
    const x2 = x! / paletteSize.width;
    const y2 = y! / paletteSize.height;
    const topLeftColor = chroma.mix(chroma("#ffffff"), chroma("#000000"), y2);
    const bottomRightColor = chroma.mix(hueColor, chroma("#000000"), y2);
    const finalColor = chroma.mix(topLeftColor, bottomRightColor, x2);

    return finalColor.hex();
  };

  const toggleMenuLeft = () => {
    hideSettingsMenu();
    if (menuVisibility.visibleLeft) return;

    document.body.addEventListener("click", hideSettingsMenu);
    setMenuVisibility({ visibleRight: false, visibleLeft: true });
  };

  const toggleMenuRight = () => {
    hideSettingsMenu();
    if (menuVisibility.visibleRight) return;

    document.body.addEventListener("click", hideSettingsMenu);
    setMenuVisibility({ visibleRight: true, visibleLeft: false });
  };

  const swapColors = () => {
    dispatch(setLeftColorParams(rightColorParams));
    dispatch(setRightColorParams(leftColorParams));

    dispatch(addColorToPresetLeft(leftColorParams));
    dispatch(addColorToPresetRight(rightColorParams));

    dispatch(addColorToPresetLeft(rightColorParams));
    dispatch(addColorToPresetRight(leftColorParams));

    setHueYleft(rightColorParams.hueY);
    setHueYright(leftColorParams.hueY);
    setPalettePosLeft({
      x: rightColorParams.palletX,
      y: rightColorParams.palletY,
    });
    setPalettePosRight({
      x: leftColorParams.palletX,
      y: leftColorParams.palletY,
    });
    setHueDegLeft(hueDegRight);
    setHueDegRight(hueDegLeft);
  };

  const pickers: SketchPickerProps[] = [
    {
      setColorParams: setLeftColorParams,
      colorParams: leftColorParams,
      presetColors: presetColorsLeft,
      setPalettePos: setPalettePosLeft,
      setHueDeg: setHueDegLeft,
      setHueY: setHueYleft,
      isVisible: menuVisibility.visibleLeft,
      palettePos: palettePosLeft,
      styles: pickerLeftStyles,
      hueDeg: hueDegLeft,
      hueY: hueYleft,
    },
    {
      setColorParams: setRightColorParams,
      colorParams: rightColorParams,
      presetColors: presetColorsRight,
      setPalettePos: setPalettePosRight,
      setHueDeg: setHueDegRight,
      setHueY: setHueYright,
      isVisible: menuVisibility.visibleRight,
      palettePos: palettePosRight,
      styles: pickerRightStyles,
      hueDeg: hueDegRight,
      hueY: hueYright,
    },
  ];

  return (
    <div className="color-picker" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        className="color-picker__mouse-left"
        style={{
          backgroundColor: colorLeft,
          backgroundImage:
            colorLeft === "#00000000" ? `url(${opacityBackground})` : "",
        }}
        data-mouse-btn={"left"}
        onClick={toggleMenuLeft}
      />
      <button
        type="button"
        className="color-picker__mouse-right"
        style={{
          backgroundColor: colorRight,
          backgroundImage:
            colorRight === "#00000000" ? `url(${opacityBackground})` : "",
        }}
        data-mouse-btn={"right"}
        onClick={toggleMenuRight}
      />
      <button
        type="button"
        className="color-picker__swaper"
        onClick={swapColors}
      />

      {pickers.map((props, index) => {
        if (!props.isVisible) return null;
        return <SketchPicker {...props} key={index} />;
      })}
    </div>
  );
};
