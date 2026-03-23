import PermissionService from "@/services/api/permission";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const name = "permission";

const initialState = {
  totalPermissions: 0,
  permissions: [],
  isFetching: false,
};

export const getPermissions = createAsyncThunk(
  `${name}/getPermissions`,
  async (params, { rejectWithValue }) => {
    try {
      const data = await PermissionService.getPermissions(params);
      return data.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const permissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPermissions.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(getPermissions.fulfilled, (state, action) => {
        state.isFetching = false;
        state.permissions = action.payload.rows;
        state.totalPermissions = action.payload.count;
      })
      .addCase(getPermissions.rejected, (state, action) => {
        state.isFetching = false;
        console.error("Failed to fetch permissions:", action.payload);
      });
  },
});

export default permissionSlice.reducer;
export const { clear } = permissionSlice.actions;
