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
  } = useAppSelector((state: RootState) => state.colorPicker);
  const [menuVisibility, setMenuVisibility] = useState<MenuVisibility>({
    visibleLeft: false,
    visibleRight: false,
  });
  const [hueDegLeft, setHueDegLeft] = useState(0);
  const [hueDegRight, setHueDegRight] = useState(0);
  const [hueYleft, setHueYleft] = useState<number>(0);
  const [hueYright, setHueYright] = useState<number>(0);
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

  const hideSettingsMenu = useCallback(() => {
    setMenuVisibility({
      visibleLeft: false,
      visibleRight: false,
    });
    document.body.removeEventListener("click", hideSettingsMenu);
  }, []);

  const parseRGBAtoString = ({ r, g, b, a }: RGBA) => {
    return `rgba(${r},${g},${b},${a})`;
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
          backgroundColor: parseRGBAtoString(leftColorParams),
          backgroundImage: !leftColorParams.a
            ? `url(${opacityBackground})`
            : "",
        }}
        data-mouse-btn={"left"}
        onClick={toggleMenuLeft}
      />
      <button
        type="button"
        className="color-picker__mouse-right"
        style={{
          backgroundColor: parseRGBAtoString(rightColorParams),
          backgroundImage: !rightColorParams.a
            ? `url(${opacityBackground})`
            : "",
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
