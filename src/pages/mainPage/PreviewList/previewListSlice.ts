import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PreviewListInitState } from "./models";

const initialState: PreviewListInitState = {
  selectedFrameIndex: 0,
  framesQuantity: 0,
  firstRenderedFrameIndex: 0,
  lastRenderedFrameIndex: 0,
  frameHashes: [],
};

export const previewListSlice = createSlice({
  name: "previewList",
  initialState,
  reducers: {
    setSelectedFrameIndex: (state, action: PayloadAction<number>) => {
      state.selectedFrameIndex = action.payload;
    },

    incrementFramesQuantity: (state, action: PayloadAction<number>) => {
      state.framesQuantity += action.payload;
    },

    decrementFramesQuantity: (state, action: PayloadAction<number>) => {
      state.framesQuantity -= action.payload;
    },

    setRenderedFramesIndexes: (
      state,
      action: PayloadAction<{ first: number; last: number }>
    ) => {
      state.firstRenderedFrameIndex = action.payload.first;
      state.lastRenderedFrameIndex = action.payload.last;
    },

    addFrameHash: (
      state,
      {
        payload: { frameIndex, hash },
      }: PayloadAction<{ frameIndex: number; hash: string }>
    ) => {
      state.frameHashes.splice(frameIndex, 0, hash);
    },

    changeFrameHash: (
      state,
      {
        payload: { frameIndex, hash },
      }: PayloadAction<{ frameIndex: number; hash: string }>
    ) => {
      state.frameHashes[frameIndex] = hash;
    },

    deleteFrameHash: (state, action: PayloadAction<number>) => {
      state.frameHashes.splice(action.payload, 1);
    },
  },
});

export const {
  setSelectedFrameIndex,
  incrementFramesQuantity,
  decrementFramesQuantity,
  setRenderedFramesIndexes,
  addFrameHash,
  changeFrameHash,
  deleteFrameHash,
} = previewListSlice.actions;

export default previewListSlice.reducer;
