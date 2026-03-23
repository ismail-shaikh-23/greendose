import VendorService from "@/services/api/vendor";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const name = "vendor";

const initialState = {
  totalVendors: 0,
  vendors: [],
  isFetching: false,
};

export const getVendors = createAsyncThunk(
  `${name}/getVendors`,
  async (params, { rejectWithValue }) => {
    try {
      const data = await VendorService.getVendors(params);
      return data.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const vendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getVendors.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(getVendors.fulfilled, (state, action) => {
        state.isFetching = false;
        state.vendors = action.payload.rows;
        state.totalVendors = action.payload.count;
      })
      .addCase(getVendors.rejected, (state, action) => {
        state.isFetching = false;
        console.error("Failed to fetch vendors:", action.payload);
      });
  },
});

export default vendorSlice.reducer;
export const { clear } = vendorSlice.actions;
