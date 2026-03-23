import SubCategoryService from "@/services/api/subCategory";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const name = "subCategory";

const initialState = {
  totalSubCategory: 0,
  subCategory: [],
  isFetching: false,
};

export const getSubCategory = createAsyncThunk(
  `${name}/getSubCategory`,
  async (params, { rejectWithValue }) => {
    try {
      const data = await SubCategoryService.getSubCategory(params);
      return data.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const subCategorySlice = createSlice({
  name: "subCategory",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSubCategory.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(getSubCategory.fulfilled, (state, action) => {
        state.isFetching = false;
        state.subCategory = action.payload.rows;
        state.totalSubCategory = action.payload.count;
      })
      .addCase(getSubCategory.rejected, (state, action) => {
        state.isFetching = false;
        console.error("Failed to fetch subCategory:", action.payload);
      });
  },
});

export default subCategorySlice.reducer;
export const { clear } = subCategorySlice.actions;
