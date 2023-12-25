import classNames from "classnames";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { setPenSize } from "./drawingToolsSlice";

function DrawingTools() {
  const { penSizes, penSize } = useSelector(
    (state: RootState) => state.drawingTools
  );
  const dispatch = useDispatch();

  return (
    <div className="main__drawing-tools">
      <div className="main__pen-size-container">
        {penSizes.map((size) => {
          return (
            <div
              onClick={() => dispatch(setPenSize(size))}
              className={classNames("main__pen-size", {
                "main__pen-size_selected": penSize === size,
              })}
              data-size={size}
            ></div>
          );
        })}
      </div>
    </div>
  );
}

export default DrawingTools;
