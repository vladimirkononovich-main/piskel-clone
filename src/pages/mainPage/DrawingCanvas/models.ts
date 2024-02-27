export interface IWheelPos {
  offSetX: number;
  offSetY: number;
}

export interface IScalingParams {
  event: React.WheelEvent<HTMLCanvasElement> | null;
  prevScale: number | null;
}
export interface IProps {
  parentRef: React.MutableRefObject<null>;
  parentCoordinates: {
    x: number;
    y: number;
    prevScale: number;
  } | null;
}
