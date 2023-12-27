import { createSlice } from '@reduxjs/toolkit';

const TIMER_SLICE_NAME = 'timer';

const initialState = {
  completedEventsCount: 0,
};

const timerSlice = createSlice({
  name: TIMER_SLICE_NAME,
  initialState,
  reducers: {
    setCompletedEventsCount: (state, action) => {
      state.completedEventsCount = action.payload;
    },
  },
});

const { actions, reducer } = timerSlice;

export const { setCompletedEventsCount } = actions;
export default reducer;
