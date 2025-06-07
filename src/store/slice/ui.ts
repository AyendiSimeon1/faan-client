// features/ui/uiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type BottomTabKey = 'Home' | 'Wallet' | 'History' | 'Profile';

interface UiState {
  activeBottomTab: BottomTabKey;
}

const initialState: UiState = {
  activeBottomTab: 'Home',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveBottomTab: (state, action: PayloadAction<BottomTabKey>) => {
      state.activeBottomTab = action.payload;
    },
  },
});

export const { setActiveBottomTab } = uiSlice.actions;
export default uiSlice.reducer;