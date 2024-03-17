import React, { useEffect, useRef } from "react";
import "./sketchPicker.css";
import chroma from "chroma-js";
import { SketchPickerProps } from "./models";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { CSSProperties } from "react";
import opacityBackground from "../../../../assets/color-picker-opacity-background.png";
import classNames from "classnames";
import { RGBA } from "../models";
import { RootState } from "../../../../store";

function SketchPicker({
  styles,
  hueY,
  palettePos,
  setHueY,
  setPalettePos,
  hueDeg,
  setHueDeg,
  colorParams,
  presetColors,
  setColorParams,
}: SketchPickerProps) {
  const { paletteSize, hueSliderSize } = useAppSelector(
    (state: RootState) => state.colorPicker
  );
  const dispatch = useAppDispatch();
  const hueSliderRef = useRef(null);
  const paletteRef = useRef(null);

  const paletteWidth = paletteSize.width;
  const paletteHeight = paletteSize.height;
  const hueHeight = hueSliderSize.height;
  let hueSliderHTML: HTMLDivElement;
  let paletteHTML: HTMLDivElement;

  useEffect(() => {
    hueSliderHTML = hueSliderRef.current!;
    paletteHTML = paletteRef.current!;
  });

  useEffect(() => {
    const [r, g, b, a] = chroma(getColorHEX()).rgba();
    const rgba = { r, g, b, a };

    dispatch(
      setColorParams({
        ...rgba,
        hueY,
        palletX: palettePos.x,
        palletY: palettePos.y,
      })
    );
  }, [hueDeg, palettePos]);

  const getColorHEX = () => {
    if (palettePos.x === null || palettePos.y === null)
      return chroma("#00000000");

    const hueColor = chroma.hsl(hueDeg, 1, 0.5);
    const x = palettePos.x! / paletteWidth;
    const y = palettePos.y! / paletteHeight;
    const topLeftColor = chroma.mix(chroma("#ffffff"), chroma("#000000"), y);
    const bottomRightColor = chroma.mix(hueColor, chroma("#000000"), y);
    const finalColor = chroma.mix(topLeftColor, bottomRightColor, x);

    return finalColor.hex();
  };

  const hueSliderHandler = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!hueSliderHTML) return;
    if (e.buttons === 0 && e.type === "pointermove") return;
    const y = e.nativeEvent.offsetY;

    if (e.type === "pointermove") {
      if (!hueSliderHTML.hasPointerCapture(e.pointerId)) {
        hueSliderHTML.setPointerCapture(e.pointerId);
        hueSliderHTML.style.cursor = "pointer";
      }
    }
    if (e.type === "pointerdown") {
      hueSliderHTML.setPointerCapture(e.pointerId);
      hueSliderHTML.style.cursor = "pointer";
    }
    if (e.type === "pointerup") {
      hueSliderHTML.releasePointerCapture(e.pointerId);
      hueSliderHTML.style.cursor = "default";
    }

    const validPosY = y < 0 ? 0 : y > hueHeight ? hueHeight : y;
    const hueDeg = Math.round((360 / hueHeight) * validPosY);

    setHueDeg(hueDeg);
    setHueY(validPosY);
  };

  const paletteHandler = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!paletteHTML) return;
    if (e.buttons === 0 && e.type === "pointermove") return;
    const x = Math.floor(e.nativeEvent.offsetX);
    const y = Math.floor(e.nativeEvent.offsetY);

    if (e.type === "pointermove") {
      if (!paletteHTML.hasPointerCapture(e.pointerId)) {
        paletteHTML.setPointerCapture(e.pointerId);
        paletteHTML.style.cursor = "pointer";
      }
    }
    if (e.type === "pointerdown") {
      paletteHTML.setPointerCapture(e.pointerId);
      paletteHTML.style.cursor = "pointer";
    }
    if (e.type === "pointerup") {
      paletteHTML.releasePointerCapture(e.pointerId);
      paletteHTML.style.cursor = "default";
    }

    const validPosY = y < 0 ? 0 : y > paletteHeight ? paletteHeight : y;
    const validPosX = x < 0 ? 0 : x > paletteWidth ? paletteWidth : x;

    setPalettePos({
      x: validPosX,
      y: validPosY,
    });
  };

  const parseRGBAtoHEX = ({ r, g, b, a }: RGBA) => {
    return chroma(`rgba(${r},${g},${b},${a})`).hex();
  };

  return (
    <div className="sketch-picker" style={styles}>
      <div className="preset-colors">
        {presetColors.map((color, index) => {
          const { r, g, b, a, hueY, palletX, palletY } = color;
          const { r: r2, g: g2, b: b2, a: a2 } = colorParams;
          const stringRGBA = `rgba(${r},${g},${b},${a})`;
          const style: CSSProperties = { backgroundColor: stringRGBA };

          if (a === 0) style.backgroundImage = `url(${opacityBackground})`;
          const isSameColor = r === r2 && g === g2 && b === b2 && a === a2;
          const hueDeg = Math.round((360 / hueHeight) * hueY);

          return (
            <div
              key={index}
              onClick={() => {
                setHueDeg(hueDeg);
                setHueY(hueY);
                setPalettePos({ x: palletX, y: palletY });
              }}
              className={classNames("preset-colors__color", {
                "preset-colors__color_selected": isSameColor,
              })}
              style={style}
            ></div>
          );
        })}
      </div>
      <div className="palette-hue-wrapper">
        <div
          className="palette"
          style={{
            backgroundColor: chroma.hsl(hueDeg, 1, 0.5).hex(),
          }}
          onPointerDown={paletteHandler}
          onPointerMove={paletteHandler}
          onPointerUp={paletteHandler}
          ref={paletteRef}
        >
          {palettePos.x !== null && palettePos.y !== null && (
            <button
              type="button"
              className="palette-btn"
              style={{
                top: palettePos.y! - 6 + "px",
                left: palettePos.x! - 6 + "px",
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                paletteHTML.style.cursor = "pointer";
                paletteHTML.setPointerCapture(e.pointerId);
              }}
            />
          )}
        </div>
        <div
          className="hue-slider"
          onPointerMove={hueSliderHandler}
          onPointerDown={hueSliderHandler}
          onPointerUp={hueSliderHandler}
          ref={hueSliderRef}
        >
          <button
            type="button"
            className="hue-slider__btn"
            onPointerDown={(e) => {
              e.stopPropagation();
              hueSliderHTML.style.cursor = "pointer";
              hueSliderHTML.setPointerCapture(e.pointerId);
            }}
            style={{
              top: hueY! - 4 + "px",
            }}
          ></button>
        </div>
        <input
          className="color-input"
          readOnly
          value={parseRGBAtoHEX(colorParams)}
        ></input>
      </div>
    </div>
  );
}

export default SketchPicker;
