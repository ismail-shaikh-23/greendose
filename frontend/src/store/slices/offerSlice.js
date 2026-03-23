import OfferService from "@/services/api/offer";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const name = "offer";

const initialState = {
  totalOffers: 0,
  offers: [],
  isFetching: false,
};

export const getOffers = createAsyncThunk(
  `${name}/getOffers`,
  async (params, { rejectWithValue }) => {
    try {
      const data = await OfferService.getOffers(params);
      return data.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const offerSlice = createSlice({
  name: "offer",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOffers.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(getOffers.fulfilled, (state, action) => {
        state.isFetching = false;
        state.offers = action.payload.rows;
        state.totalOffers = action.payload.count;
      })
      .addCase(getOffers.rejected, (state, action) => {
        state.isFetching = false;
        console.error("Failed to fetch offers:", action.payload);
      });
  },
});

export default offerSlice.reducer;
export const { clear } = offerSlice.actions;
