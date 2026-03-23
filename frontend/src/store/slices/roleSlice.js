import RoleService from "@/services/api/role";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const name = "role";

const initialState = {
  totalRoles: 0,
  roles: [],
  isFetching: false,
};

export const getRoles = createAsyncThunk(
  `${name}/getRoles`,
  async (params, { rejectWithValue }) => {
    try {
      const data = await RoleService.getRoles(params);
      return data.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRoles.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(getRoles.fulfilled, (state, action) => {
        state.isFetching = false;
        state.roles = action.payload.rows;
        state.totalRoles = action.payload.count;
      })
      .addCase(getRoles.rejected, (state, action) => {
        state.isFetching = false;
        console.error("Failed to fetch roles:", action.payload);
      });
  },
});

export default roleSlice.reducer;
export const { clear } = roleSlice.actions;
