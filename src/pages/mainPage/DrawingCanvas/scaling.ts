import { CalcIntervalsCoords, RowsColsValues } from "./models";

export const calcRowsOrColsValues = (scale: number, value: number) => {
  const baseValue = Math.floor(scale);
  const sumBaseValues = value * baseValue;
  const scaledValue = Math.floor(value * scale);
  const difference = scaledValue - sumBaseValues;

  const numBaseValues = value - difference;
  const numIncrementedValues = difference;

  const buffer = new ArrayBuffer(value * 2);

  let valueForFill1: number;
  let valueForFill2: number;
  let fillLimiter: number;

  let step: number;

  if (numBaseValues > numIncrementedValues) {
    valueForFill1 = baseValue;
    valueForFill2 = baseValue + 1;
    step = Math.floor(value / numIncrementedValues);
    fillLimiter = numIncrementedValues;
  } else {
    valueForFill1 = baseValue + 1;
    valueForFill2 = baseValue;
    step = Math.floor(value / numBaseValues);
    fillLimiter = numBaseValues;
  }

  const result = new Uint16Array(buffer).fill(valueForFill1);

  let numCurrFill = 0;
  for (let i = 1; i <= value; i++) {
    if (fillLimiter === numCurrFill) break;
    if (i % step === 0) {
      result[i - 1] = valueForFill2;
      numCurrFill += 1;
    }
  }

  return result;
};

export const calcRowsColsAllScales = (
  scalingSteps: number[],
  width: number,
  height: number
) => {
  const rowsColsValues: RowsColsValues = {};

  scalingSteps.forEach((scale) => {
    const rows = calcRowsOrColsValues(scale, height);
    const cols = calcRowsOrColsValues(scale, width);

    rowsColsValues[scale] = {
      rows,
      cols,
    };
  });

  return rowsColsValues;
};

export const calcIntervals = (
  pos: number,
  axis: string,
  length: number,
  values: Uint16Array,
  coords: CalcIntervalsCoords
) => {
  if (pos > 0) return;

  const overflow = Math.abs(pos);
  let sum = 0;

  for (let i = 0; i < length; i++) {
    const curValue = values[i];
    sum += curValue;
    if (sum > overflow) {
      if (axis === "y1") {
        coords.y1 = i;
        coords.remainderTop = overflow - (sum - curValue);
      }
      if (axis === "x1") {
        coords.x1 = i;
        coords.remainderLeft = overflow - (sum - curValue);
      }
      sum = 0;
      break;
    }
  }

  for (let i = 0; i < length; i++) {
    const curValue = values[length - 1 - i];
    sum += curValue;
    if (sum > overflow) {
      if (axis === "y2") coords.y2 = length - i;
      if (axis === "x2") coords.x2 = length - i;

      break;
    }
  }
};
