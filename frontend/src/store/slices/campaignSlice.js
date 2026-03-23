import CampaignService from "@/services/api/campaign";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const name = "campaign";

const initialState = {
  totalCampaign: 0,
  categories: [],
  isFetching: false,
};

export const getCampaign = createAsyncThunk(
  `${name}/getCampaign`,
  async (params, { rejectWithValue }) => {
    try {
      const data = await CampaignService.getCampaign(params);
      return data.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCampaign.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(getCampaign.fulfilled, (state, action) => {
        state.isFetching = false;
        state.categories = action.payload.rows;
        state.totalCampaign = action.payload.count;
      })
      .addCase(getCampaign.rejected, (state, action) => {
        state.isFetching = false;
        console.error("Failed to fetch campaigns:", action.payload);
      });
  },
});

export default campaignSlice.reducer;
export const { clear } = campaignSlice.actions;
