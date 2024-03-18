import classNames from "classnames";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { RootState } from "../../../store";
import { setCurrentToolName, setPenSize } from "./drawingToolsSlice";
import "./drawingTools.css";

function DrawingTools() {
  const { penSizes, penSize, currentToolName } = useAppSelector(
    (state: RootState) => state.drawingTools
  );
  const dispatch = useAppDispatch();
  const tools = [
    { className: "pen-tool", toolFuncName: "penTool" },
    { className: "stroke-tool", toolFuncName: "strokeTool" },
    { className: "picker-tool", toolFuncName: "pickerTool" },
  ];

  return (
    <div className="main__drawing-tools">
      <div className="main__pen-size-container">
        {penSizes.map((size) => {
          return (
            <div
              key={size}
              onClick={() => dispatch(setPenSize(size))}
              className={classNames("main__pen-size", {
                "main__pen-size_selected": penSize === size,
              })}
              data-size={size}
            ></div>
          );
        })}
      </div>
      {tools.map((tool, index) => {
        return (
          <div
            key={index}
            onClick={() => dispatch(setCurrentToolName(tool.toolFuncName))}
            className={classNames("main__tool", "main__" + tool.className, {
              main__tool_selected: currentToolName === tool.toolFuncName,
            })}
          ></div>
        );
      })}
    </div>
  );
}

export default DrawingTools;
