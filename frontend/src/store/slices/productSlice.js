import ProductService from "@/services/api/product";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const name = "product";

const initialState = {
  totalProducts: 0,
  products: [],
  isFetching: false,
};

export const getProduct = createAsyncThunk(
  `${name}/getProduct`,
  async (params, { rejectWithValue }) => {
    try {
      const data = await ProductService.getProduct(params);
      return data.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProduct.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.isFetching = false;
        state.products = action.payload.rows;
        state.totalProducts = action.payload.count;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.isFetching = false;
        console.error("Failed to fetch Products:", action.payload);
      });
  },
});

export default productSlice.reducer;
export const { clear } = productSlice.actions;
