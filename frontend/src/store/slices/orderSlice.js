import OrderService from "@/services/api/order";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const name = "order";

const initialState = {
  totalOrders: 0,
  orders: [],
  isFetching: false,
};

export const getOrders = createAsyncThunk(
  `${name}/getOrders`,
  async ({ noLoading: _, ...params }, { rejectWithValue }) => {
    try {
      const data = await OrderService.getOrders(params);
      return data.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: name,
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state, action) => {
        state.isFetching = !action.meta.arg.noLoading;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isFetching = false;
        state.orders = action.payload.rows;
        state.totalOrders = action.payload.count;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isFetching = false;
        console.error("Failed to fetch Order List", action.payload);
      });
  },
});

export default orderSlice.reducer;
export const { clear } = orderSlice.actions;
