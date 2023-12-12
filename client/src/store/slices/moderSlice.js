import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as restController from '../../api/rest/restController';
import CONSTANTS from '../../constants';

const MODER_SLICE_NAME = 'moderPanel';

const initialState = {
  moderStatus: CONSTANTS.MODER_STATUS_PENDING,
  error: null,
  allPendingOffers: [],
  oneOffer: null,
};

export const getAllPendingOffers = createAsyncThunk(
  `${MODER_SLICE_NAME}/getAllPendingOffers`,
  async (data) => {
    const response = await restController.getAllPendingOffers(data);
    return response.data;
  }
);

export const updateOfferModerStatus = createAsyncThunk(
  `${MODER_SLICE_NAME}/updateOfferModerStatus`,
  async (data) => {
    const response = await restController.updateOfferModerStatus(data);
    return response.data;
  }
);

const reducers = {
  setModerStatus: (state, action) => {
    state.moderStatus = action.payload;
    state.error = null;
  },
  setModerStatusError: (state, action) => {
    state.error = action.payload;
  },
  clearModerStore: (state) => {
    state.error = null;
    state.allPendingOffers = [];
    state.oneOffer = null;
  },
  clearModerError: (state) => {
    state.error = null;
  },
};

const extraReducers = (builder) => {
  builder
    .addCase(getAllPendingOffers.fulfilled, (state, action) => {
      state.allPendingOffers = action.payload;
    })
    .addCase(updateOfferModerStatus.fulfilled, (state, action) => {
      const { offerId, newStatus } = action.payload;

      const updatedOffers = state.allPendingOffers.map((offer) =>
        offer.id === offerId ? { moderStatus: newStatus, ...offer } : offer
      );

      state.allPendingOffers = updatedOffers;
    });
};

const moderSlice = createSlice({
  name: MODER_SLICE_NAME,
  initialState,
  reducers,
  extraReducers,
});

const { actions, reducer } = moderSlice;

export const {
  setModerStatus,
  setModerStatusError,
  clearModerStore,
  clearModerError,
} = actions;

export default reducer;
