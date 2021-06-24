import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

interface FileInfo {
  name: string | undefined;
  size: number;
}

// Define a type for the slice state
interface ParsedDataState {
  data: Record<string, unknown>[];
  fileInfo: FileInfo;
  filter: string;
}

// Define the initial state using that type
const initialState: ParsedDataState = {
  data: [],
  fileInfo: {
    name: undefined,
    size: 0,
  },
  filter: '',
};

export const parsedDataSlice = createSlice({
  name: 'parsedData',
  initialState,
  reducers: {
    setParsedData: (
      state: RootState,
      action: PayloadAction<Record<string, unknown>[]>,
    ) => {
      state.data = action.payload;
      state.filter = '';
    },
    setFileInfo: (state: RootState, action: PayloadAction<FileInfo>) => {
      state.fileInfo = action.payload;
    },
    setFilter: (state: RootState, action: PayloadAction<string>) => {
      state.filter = action.payload;
    },
  },
});

export const selectData = (state: RootState) => state.parsedData.data;
export const selectFileInfo = (state: RootState) => state.parsedData.fileInfo;
export const selectFilter = (state: RootState) => state.parsedData.filter;

export default parsedDataSlice.reducer;
