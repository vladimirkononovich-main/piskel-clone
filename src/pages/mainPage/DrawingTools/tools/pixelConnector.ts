import { ICurrentToolParams, PixelIndexes } from "../../DrawingCanvas/models";

export const connectTwoPixels = (params: ICurrentToolParams) => {
  const endX = params.xIndex;
  const endY = params.yIndex;

  let y = params.prevPixelIndexes.yIndex!;
  let x = params.prevPixelIndexes.xIndex!;

  const yInterval = endY > y ? endY - y + 1 : y - endY + 1 || 1;
  const xInterval = endX > x ? endX - x + 1 : x - endX + 1;
  const yDirection = endY > y ? 1 : -1;
  const xDirection = endX > x ? 1 : -1;

  let connectionWay: number[][][] = [];

  const avgStep = Math.floor(
    Math.max(yInterval, xInterval) / Math.min(yInterval, xInterval)
  );
  const remainder =
    Math.max(yInterval, xInterval) % Math.min(yInterval, xInterval);
  const defaultUnitsCount = Math.min(yInterval, xInterval) - remainder;
  const enlargedUnitsCount = remainder;

  if (!remainder) {
    connectionWay[0] = [];
    connectionWay[0].length = Math.min(yInterval, xInterval);
    connectionWay[0].fill(Array(avgStep).fill(1));
  }

  const moreUnits = Math.max(defaultUnitsCount, enlargedUnitsCount);
  const fewerUnits = Math.min(defaultUnitsCount, enlargedUnitsCount);
  const interval = Math.floor(moreUnits / (fewerUnits + 1));
  const intervalRemainder = moreUnits % (fewerUnits + 1);
  connectionWay.length = fewerUnits;

  const intervalUnits: number[][] = Array.from(Array(interval), (v, index) => {
    if (enlargedUnitsCount > defaultUnitsCount) {
      return Array(avgStep + 1).fill(1);
    }
    return Array(avgStep).fill(1);
  });

  connectionWay = Array.from(connectionWay, () => {
    if (enlargedUnitsCount > defaultUnitsCount) {
      return [...intervalUnits, Array(avgStep).fill(1)];
    }
    return [...intervalUnits, Array(avgStep + 1).fill(1)];
  });
  connectionWay.push(intervalUnits);

  if (intervalRemainder) {
    const middle = Math.ceil((fewerUnits + 1) / 2);
    let increment = 1;
    let decrement = 1;
    const intervalRemainderWay: number[] = [];

    for (let i = 0; i < intervalRemainder; i++) {
      if (!i) {
        intervalRemainderWay[i] = middle;
        continue;
      }
      if (i % 2) {
        intervalRemainderWay[i] = middle - decrement;
        decrement += 1;
      } else {
        intervalRemainderWay[i] = middle + increment;
        increment += 1;
      }
    }
    intervalRemainderWay.forEach((pos) => {
      if (enlargedUnitsCount > defaultUnitsCount) {
        connectionWay[pos - 1].unshift(Array(avgStep + 1).fill(1));
        return;
      }
      connectionWay[pos - 1].unshift(Array(avgStep).fill(1));
    });
  }

  const indexesForFilling: PixelIndexes[] = [];

  connectionWay.forEach((currInterval) => {
    currInterval.forEach((column) => {
      column.forEach(() => {
        indexesForFilling.push({ xIndex: x, yIndex: y });
        if (yInterval >= xInterval) y += yDirection;
        else x += xDirection;
      });

      if (yInterval >= xInterval) x += xDirection;
      else y += yDirection;
    });
  });

  return indexesForFilling;
};
