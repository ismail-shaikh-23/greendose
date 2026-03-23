import CategoryService from "@/services/api/category";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const name = "category";

const initialState = {
  totalCategory: 0,
  categories: [],
  isFetching: false,
};

export const getCategory = createAsyncThunk(
  `${name}/getCategory`,
  async (params, { rejectWithValue }) => {
    try {
      const data = await CategoryService.getCategory(params);
      return data.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategory.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(getCategory.fulfilled, (state, action) => {
        state.isFetching = false;
        state.categories = action.payload.rows;
        state.totalCategory = action.payload.count;
      })
      .addCase(getCategory.rejected, (state, action) => {
        state.isFetching = false;
        console.error("Failed to fetch categorys:", action.payload);
      });
  },
});

export default categorySlice.reducer;
export const { clear } = categorySlice.actions;
