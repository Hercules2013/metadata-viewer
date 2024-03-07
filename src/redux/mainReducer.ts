// const initialState = {
//   srcFolder: '',
//   srcFiles: []
// }

// const homeReducer = (state = initialState, action: any) => {
//   switch (action.type) {
//     case 'OPEN_FOLDER':
//       return {
//         ...state,
//         srcFolder: action.payload.srcFolder,
//         srcFiles: action.payload.srcFiles
//       };
//     default:
//       return state;
//   }
// }

// export default homeReducer;

import { createSlice } from "@reduxjs/toolkit";

export const mainSlice = createSlice({
  name: 'main',
  initialState: {
    srcDir: '',
    srcFiles: [],
    destDir: '',
    destFiles: [],
    totalKeys: [],
  },
  reducers: {
    setSource: (state, action) => {
      state.srcDir = action.payload.dir;
      state.srcFiles = action.payload.files;
    },
    setDest: (state, action) => {
      state.destDir = action.payload.dir;
      state.destFiles = action.payload.files;
    },
    setKeys: (state, action) => {
      state.totalKeys = action.payload;
    }
  }
});

// States
export const selectSource = (state: any) => {
  return { dir: state.main.srcDir, files: state.main.srcFiles };
}

export const selectDest = (state: any) => {
  return { dir: state.main.destDir, files: state.main.destFiles };
}

export const selectKeys = (state: any) => {
  return state.main.totalKeys;
}

// Actions
export const { setSource, setDest, setKeys } = mainSlice.actions;

export default mainSlice.reducer;